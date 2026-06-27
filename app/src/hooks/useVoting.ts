import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import {
  VOTING_PROGRAM_ADDRESS,
  getInitializeInstructionDataEncoder,
  getCreatePollInstructionDataEncoder,
  getVoteInstructionDataEncoder,
  findGlobalStatePda,
  findPollAccountPda,
  findVoteRecordPda,
  getPollAccountDecoder,
  getGlobalStateDecoder,
  getPollAccountDiscriminatorBytes,
} from "../../../client/src/generated/index.ts";
import type { Address, ReadonlyUint8Array } from "@solana/kit";
import type { Poll } from "../types";

const PROGRAM_ADDRESS = VOTING_PROGRAM_ADDRESS as Address;

function createTxIx(
  accounts: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[],
  data: Uint8Array | ReadonlyUint8Array,
): TransactionInstruction {
  return new TransactionInstruction({
    programId: new PublicKey(PROGRAM_ADDRESS),
    keys: accounts,
    data: Buffer.from(data as Uint8Array),
  });
}

export function useVoting() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, signTransaction } = wallet;

  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [globalState, setGlobalState] = useState<{
    admin: string;
    pollCount: number;
  } | null>(null);

  const fetchGlobalState = useCallback(async () => {
    try {
      const [pda] = await findGlobalStatePda();
      const accountInfo = await connection.getAccountInfo(new PublicKey(pda));
      if (!accountInfo) {
        setGlobalState(null);
        return null;
      }
      const decoded = getGlobalStateDecoder().decode(accountInfo.data);
      const state = {
        admin: decoded.admin,
        pollCount: Number(decoded.pollCount),
      };
      setGlobalState(state);
      return state;
    } catch {
      setGlobalState(null);
      return null;
    }
  }, [connection]);

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    try {
      const discriminator = getPollAccountDiscriminatorBytes();
      const discBytes = new Uint8Array(discriminator);
      const accounts = await connection.getProgramAccounts(
        new PublicKey(PROGRAM_ADDRESS),
      );

      const decodedPolls: Poll[] = accounts
        .filter(({ account }) => {
          const data = account.data;
          if (data.length < 8) return false;
          for (let i = 0; i < 8; i++) {
            if (data[i] !== discBytes[i]) return false;
          }
          return true;
        })
        .map(({ account }) => {
          const decoded = getPollAccountDecoder().decode(account.data);
          return {
            id: Number(decoded.id),
            owner: decoded.owner,
            title: decoded.title,
            description: decoded.description,
            options: decoded.options.map((opt) => ({
              label: opt.label,
              votes: opt.votes,
            })),
          };
        });

      decodedPolls.sort((a, b) => a.id - b.id);
      setPolls(decodedPolls);
    } catch (err) {
      console.error("Failed to fetch polls:", err);
    } finally {
      setLoading(false);
    }
  }, [connection]);

  const sendInstruction = useCallback(
    async (ix: TransactionInstruction) => {
      if (!publicKey || !signTransaction) throw new Error("Wallet not connected");

      const tx = new Transaction().add(ix);
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;
      tx.feePayer = publicKey;

      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction({
        signature: sig,
        blockhash,
        lastValidBlockHeight,
      });
      return sig;
    },
    [publicKey, signTransaction, connection],
  );

  const initialize = useCallback(async () => {
    if (!publicKey) throw new Error("Wallet not connected");

    const [pda] = await findGlobalStatePda();
    const data = getInitializeInstructionDataEncoder().encode({});

    const ix = createTxIx(
      [
        { pubkey: new PublicKey(pda), isSigner: false, isWritable: true },
        { pubkey: publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    );

    const sig = await sendInstruction(ix);
    await fetchGlobalState();
    return sig;
  }, [publicKey, sendInstruction, fetchGlobalState]);

  const createPoll = useCallback(
    async (title: string, description: string, optionLabels: string[]) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const state = await fetchGlobalState();
      const pollId = state?.pollCount ?? 0;

      const [globalStatePda] = await findGlobalStatePda();
      const [pollAccountPda] = await findPollAccountPda({ pollId });

      const options = optionLabels.map((label) => ({ label, votes: 0 }));
      const data = getCreatePollInstructionDataEncoder().encode({
        title,
        description,
        options,
      });

      const ix = createTxIx(
        [
          { pubkey: new PublicKey(globalStatePda), isSigner: false, isWritable: true },
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: new PublicKey(pollAccountPda), isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data,
      );

      const sig = await sendInstruction(ix);
      await fetchPolls();
      return sig;
    },
    [publicKey, sendInstruction, fetchGlobalState, fetchPolls],
  );

  const vote = useCallback(
    async (pollId: number, optionIndex: number) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const [pollAccountPda] = await findPollAccountPda({ pollId });
      const [voteRecordPda] = await findVoteRecordPda({
        pollId,
        voter: publicKey.toBase58() as Address,
      });

      const data = getVoteInstructionDataEncoder().encode({
        pollId: BigInt(pollId),
        optionIndex,
      });

      const ix = createTxIx(
        [
          { pubkey: new PublicKey(pollAccountPda), isSigner: false, isWritable: true },
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: new PublicKey(voteRecordPda), isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data,
      );

      const sig = await sendInstruction(ix);
      await fetchPolls();
      return sig;
    },
    [publicKey, sendInstruction, fetchPolls],
  );

  return {
    polls,
    loading,
    globalState,
    connected: wallet.connected,
    fetchPolls,
    fetchGlobalState,
    initialize,
    createPoll,
    vote,
  };
}
