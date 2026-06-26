use anchor_lang::prelude::*;

use crate::{constants, error::VotingError, state::PollAccount, state::VoteRecord};

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct Vote<'info> {
    #[account(
        mut,
        seeds = [constants::SEED.as_bytes(), &poll_id.to_le_bytes()],
        bump = poll_account.bump,
    )]
    pub poll_account: Account<'info, PollAccount>,

    #[account(mut)]
    pub voter: Signer<'info>,

    #[account(
        init,
        payer = voter,
        space = 8 + VoteRecord::INIT_SPACE,
        seeds = [constants::SEED.as_bytes(), &poll_id.to_le_bytes(), voter.key().as_ref()],
        bump,
    )]
    pub vote_record: Account<'info, VoteRecord>,

    pub system_program: Program<'info, System>,
}

impl<'info> Vote<'info> {
    pub fn execute(ctx: Context<Vote>, poll_id: u64, option_index: u8) -> Result<()> {
        let poll_account = &mut ctx.accounts.poll_account;

        require!(
            (option_index as usize) < poll_account.options.len(),
            VotingError::InvalidOptionIndex
        );

        poll_account.options[option_index as usize].votes += 1;

        let vote_record = &mut ctx.accounts.vote_record;
        vote_record.poll_id = poll_id;
        vote_record.voter = ctx.accounts.voter.key();
        vote_record.option_index = option_index;
        vote_record.bump = ctx.bumps.vote_record;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use {
        super::*,
        crate::{constants, state::PollOption},
        anchor_lang::{solana_program::instruction::Instruction, system_program, InstructionData},
        mollusk_svm::{
            program::keyed_account_for_system_program, result::types::InstructionResult, Mollusk,
        },
        solana_sdk::account::Account,
    };

    fn setup() -> (Mollusk, Pubkey, Pubkey) {
        let program_id = crate::ID;
        let mollusk = Mollusk::new(&program_id, "../../target/deploy/voting");

        let admin = Pubkey::new_unique();
        let (global_state, _) =
            Pubkey::find_program_address(&[constants::SEED.as_bytes()], &program_id);

        (mollusk, admin, global_state)
    }

    fn initialize_instruction(
        program_id: Pubkey,
        admin: Pubkey,
        global_state: Pubkey,
    ) -> Instruction {
        Instruction::new_with_bytes(
            program_id,
            &crate::instruction::Initialize {}.data(),
            vec![
                AccountMeta::new(global_state, false),
                AccountMeta::new(admin, true),
                AccountMeta::new_readonly(system_program::ID, false),
            ],
        )
    }

    fn create_poll_instruction(
        program_id: Pubkey,
        owner: Pubkey,
        global_state: Pubkey,
        poll_account: Pubkey,
        title: String,
        description: String,
        options: Vec<PollOption>,
    ) -> Instruction {
        Instruction::new_with_bytes(
            program_id,
            &crate::instruction::CreatePoll {
                title,
                description,
                options,
            }
            .data(),
            vec![
                AccountMeta::new(global_state, false),
                AccountMeta::new(owner, true),
                AccountMeta::new(poll_account, false),
                AccountMeta::new_readonly(system_program::ID, false),
            ],
        )
    }

    fn vote_instruction(
        program_id: Pubkey,
        voter: Pubkey,
        poll_account: Pubkey,
        vote_record: Pubkey,
        poll_id: u64,
        option_index: u8,
    ) -> Instruction {
        Instruction::new_with_bytes(
            program_id,
            &crate::instruction::Vote {
                poll_id,
                option_index,
            }
            .data(),
            vec![
                AccountMeta::new(poll_account, false),
                AccountMeta::new(voter, true),
                AccountMeta::new(vote_record, false),
                AccountMeta::new_readonly(system_program::ID, false),
            ],
        )
    }

    fn initialize_global_state(
        mollusk: &Mollusk,
        program_id: Pubkey,
        admin: Pubkey,
        global_state: Pubkey,
    ) -> InstructionResult {
        let instruction = initialize_instruction(program_id, admin, global_state);

        let result = mollusk.process_instruction(
            &instruction,
            &[
                (
                    global_state,
                    Account {
                        lamports: 0,
                        ..Default::default()
                    },
                ),
                (
                    admin,
                    Account {
                        lamports: 1_000_000_000,
                        ..Default::default()
                    },
                ),
                keyed_account_for_system_program(),
            ],
        );

        assert!(result.program_result.is_ok());
        result
    }

    fn create_poll_and_get_result(
        mollusk: &Mollusk,
        program_id: Pubkey,
        owner: Pubkey,
        global_state: Pubkey,
        global_state_account: Account,
        poll_account: Pubkey,
        options: Vec<PollOption>,
    ) -> InstructionResult {
        let instruction = create_poll_instruction(
            program_id,
            owner,
            global_state,
            poll_account,
            "Test Poll".to_string(),
            "A poll for testing".to_string(),
            options,
        );

        let result = mollusk.process_instruction(
            &instruction,
            &[
                (global_state, global_state_account),
                (
                    owner,
                    Account {
                        lamports: 1_000_000_000,
                        ..Default::default()
                    },
                ),
                (
                    poll_account,
                    Account {
                        lamports: 0,
                        ..Default::default()
                    },
                ),
                keyed_account_for_system_program(),
            ],
        );

        assert!(result.program_result.is_ok());
        result
    }

    /// Helper: set up global state + create a poll, return poll_account key and create result
    fn setup_poll(
        mollusk: &Mollusk,
        program_id: Pubkey,
        admin: Pubkey,
        global_state: Pubkey,
        owner: Pubkey,
        num_options: usize,
    ) -> (Pubkey, InstructionResult) {
        let init_result = initialize_global_state(mollusk, program_id, admin, global_state);

        let global_state_account = init_result
            .get_account(&global_state)
            .expect("global_state not found")
            .clone();

        let poll_count_bytes = 0_u64.to_le_bytes();
        let (poll_account, _) = Pubkey::find_program_address(
            &[constants::SEED.as_bytes(), &poll_count_bytes],
            &program_id,
        );

        let options: Vec<PollOption> = (0..num_options)
            .map(|i| PollOption {
                label: format!("Option {}", i),
                votes: 0,
            })
            .collect();

        let create_result = create_poll_and_get_result(
            mollusk,
            program_id,
            owner,
            global_state,
            global_state_account,
            poll_account,
            options,
        );

        (poll_account, create_result)
    }

    /// Happy path: vote for option 0 and verify state
    #[test]
    fn test_vote_success() {
        let (mollusk, admin, global_state) = setup();
        let owner = Pubkey::new_unique();
        let voter = Pubkey::new_unique();
        let program_id = crate::ID;

        let (poll_account, create_result) =
            setup_poll(&mollusk, program_id, admin, global_state, owner, 2);

        let (vote_record, _) = Pubkey::find_program_address(
            &[
                constants::SEED.as_bytes(),
                &0_u64.to_le_bytes(),
                voter.as_ref(),
            ],
            &program_id,
        );

        let poll_account_after_create = create_result
            .get_account(&poll_account)
            .expect("poll_account not found")
            .clone();

        let instruction = vote_instruction(program_id, voter, poll_account, vote_record, 0, 0);

        let result = mollusk.process_instruction(
            &instruction,
            &[
                (poll_account, poll_account_after_create),
                (
                    voter,
                    Account {
                        lamports: 1_000_000_000,
                        ..Default::default()
                    },
                ),
                (
                    vote_record,
                    Account {
                        lamports: 0,
                        ..Default::default()
                    },
                ),
                keyed_account_for_system_program(),
            ],
        );

        assert!(result.program_result.is_ok());

        let poll_data = result
            .get_account(&poll_account)
            .expect("poll_account not found");
        let poll = PollAccount::try_deserialize(&mut poll_data.data.as_slice())
            .expect("failed to deserialize PollAccount");
        assert_eq!(poll.options[0].votes, 1);
        assert_eq!(poll.options[1].votes, 0);

        let record_data = result
            .get_account(&vote_record)
            .expect("vote_record not found");
        let record = VoteRecord::try_deserialize(&mut record_data.data.as_slice())
            .expect("failed to deserialize VoteRecord");
        assert_eq!(record.poll_id, 0);
        assert_eq!(record.voter, voter);
        assert_eq!(record.option_index, 0);
    }

    /// Vote for option 1, verify only that option's count changes
    #[test]
    fn test_vote_increments_correct_option() {
        let (mollusk, admin, global_state) = setup();
        let owner = Pubkey::new_unique();
        let voter = Pubkey::new_unique();
        let program_id = crate::ID;

        let (poll_account, create_result) =
            setup_poll(&mollusk, program_id, admin, global_state, owner, 3);

        let (vote_record, _) = Pubkey::find_program_address(
            &[
                constants::SEED.as_bytes(),
                &0_u64.to_le_bytes(),
                voter.as_ref(),
            ],
            &program_id,
        );

        let poll_account_after_create = create_result
            .get_account(&poll_account)
            .expect("poll_account not found")
            .clone();

        let instruction = vote_instruction(program_id, voter, poll_account, vote_record, 0, 2);

        let result = mollusk.process_instruction(
            &instruction,
            &[
                (poll_account, poll_account_after_create),
                (
                    voter,
                    Account {
                        lamports: 1_000_000_000,
                        ..Default::default()
                    },
                ),
                (
                    vote_record,
                    Account {
                        lamports: 0,
                        ..Default::default()
                    },
                ),
                keyed_account_for_system_program(),
            ],
        );

        assert!(result.program_result.is_ok());

        let poll_data = result
            .get_account(&poll_account)
            .expect("poll_account not found");
        let poll = PollAccount::try_deserialize(&mut poll_data.data.as_slice())
            .expect("failed to deserialize PollAccount");
        assert_eq!(poll.options[0].votes, 0);
        assert_eq!(poll.options[1].votes, 0);
        assert_eq!(poll.options[2].votes, 1);
    }

    /// Vote with out-of-range option_index should fail
    #[test]
    fn test_vote_fails_invalid_option_index() {
        let (mollusk, admin, global_state) = setup();
        let owner = Pubkey::new_unique();
        let voter = Pubkey::new_unique();
        let program_id = crate::ID;

        let (poll_account, create_result) =
            setup_poll(&mollusk, program_id, admin, global_state, owner, 2);

        let (vote_record, _) = Pubkey::find_program_address(
            &[
                constants::SEED.as_bytes(),
                &0_u64.to_le_bytes(),
                voter.as_ref(),
            ],
            &program_id,
        );

        let poll_account_after_create = create_result
            .get_account(&poll_account)
            .expect("poll_account not found")
            .clone();

        let instruction = vote_instruction(program_id, voter, poll_account, vote_record, 0, 99);

        let result = mollusk.process_instruction(
            &instruction,
            &[
                (poll_account, poll_account_after_create),
                (
                    voter,
                    Account {
                        lamports: 1_000_000_000,
                        ..Default::default()
                    },
                ),
                (
                    vote_record,
                    Account {
                        lamports: 0,
                        ..Default::default()
                    },
                ),
                keyed_account_for_system_program(),
            ],
        );

        assert!(!result.program_result.is_ok());
    }

    /// Double voting with same voter should fail
    #[test]
    fn test_vote_fails_double_vote() {
        let (mollusk, admin, global_state) = setup();
        let owner = Pubkey::new_unique();
        let voter = Pubkey::new_unique();
        let program_id = crate::ID;

        let (poll_account, create_result) =
            setup_poll(&mollusk, program_id, admin, global_state, owner, 2);

        let (vote_record, _) = Pubkey::find_program_address(
            &[
                constants::SEED.as_bytes(),
                &0_u64.to_le_bytes(),
                voter.as_ref(),
            ],
            &program_id,
        );

        let poll_account_after_create = create_result
            .get_account(&poll_account)
            .expect("poll_account not found")
            .clone();

        let instruction = vote_instruction(program_id, voter, poll_account, vote_record, 0, 0);

        // First vote — should succeed
        let first = mollusk.process_instruction(
            &instruction,
            &[
                (poll_account, poll_account_after_create.clone()),
                (
                    voter,
                    Account {
                        lamports: 2_000_000_000,
                        ..Default::default()
                    },
                ),
                (
                    vote_record,
                    Account {
                        lamports: 0,
                        ..Default::default()
                    },
                ),
                keyed_account_for_system_program(),
            ],
        );

        assert!(first.program_result.is_ok());

        // Second vote — should fail (vote_record already exists)
        let poll_account_after_vote = first
            .get_account(&poll_account)
            .expect("poll_account not found")
            .clone();

        let vote_record_after_first = first
            .get_account(&vote_record)
            .expect("vote_record not found")
            .clone();

        let second = mollusk.process_instruction(
            &instruction,
            &[
                (poll_account, poll_account_after_vote),
                (
                    voter,
                    Account {
                        lamports: 2_000_000_000,
                        ..Default::default()
                    },
                ),
                (vote_record, vote_record_after_first),
                keyed_account_for_system_program(),
            ],
        );

        assert!(!second.program_result.is_ok());
    }

    /// Vote without voter signature should fail
    #[test]
    fn test_vote_fails_without_voter_signature() {
        let (mollusk, admin, global_state) = setup();
        let owner = Pubkey::new_unique();
        let voter = Pubkey::new_unique();
        let program_id = crate::ID;

        let (poll_account, create_result) =
            setup_poll(&mollusk, program_id, admin, global_state, owner, 2);

        let (vote_record, _) = Pubkey::find_program_address(
            &[
                constants::SEED.as_bytes(),
                &0_u64.to_le_bytes(),
                voter.as_ref(),
            ],
            &program_id,
        );

        let poll_account_after_create = create_result
            .get_account(&poll_account)
            .expect("poll_account not found")
            .clone();

        let instruction = Instruction::new_with_bytes(
            program_id,
            &crate::instruction::Vote {
                poll_id: 0,
                option_index: 0,
            }
            .data(),
            vec![
                AccountMeta::new(poll_account, false),
                AccountMeta::new(voter, false),
                AccountMeta::new(vote_record, false),
                AccountMeta::new_readonly(system_program::ID, false),
            ],
        );

        let result = mollusk.process_instruction(
            &instruction,
            &[
                (poll_account, poll_account_after_create),
                (
                    voter,
                    Account {
                        lamports: 1_000_000_000,
                        ..Default::default()
                    },
                ),
                (
                    vote_record,
                    Account {
                        lamports: 0,
                        ..Default::default()
                    },
                ),
                keyed_account_for_system_program(),
            ],
        );

        assert!(!result.program_result.is_ok());
    }
}
