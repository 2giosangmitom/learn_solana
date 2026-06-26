use anchor_lang::prelude::*;

use crate::{constants, state::GlobalState};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + GlobalState::INIT_SPACE,
        seeds = [constants::SEED.as_bytes()],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn execute(ctx: Context<Initialize>) -> Result<()> {
    let state = &mut ctx.accounts.global_state;

    state.admin = ctx.accounts.admin.key();
    state.poll_count = 0;

    Ok(())
}

#[cfg(test)]
mod tests {
    use {
        crate::{constants, state::GlobalState},
        anchor_lang::{
            prelude::*, solana_program::instruction::Instruction, system_program, InstructionData,
        },
        mollusk_svm::{program::keyed_account_for_system_program, Mollusk},
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

    /// Successful initialization sets admin and poll_count = 0
    #[test]
    fn test_initialize_success() {
        let (mollusk, admin, global_state) = setup();

        let instruction = initialize_instruction(crate::ID, admin, global_state);

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

        // Verify state was written correctly
        let state_account = result
            .get_account(&global_state)
            .expect("global_state not found");
        let state = GlobalState::try_deserialize(&mut state_account.data.as_slice())
            .expect("failed to deserialize GlobalState");

        assert_eq!(state.admin, admin);
        assert_eq!(state.poll_count, 0);
    }

    /// Admin must have enough lamports to fund the PDA rent
    #[test]
    fn test_initialize_fails_with_insufficient_lamports() {
        let (mollusk, admin, global_state) = setup();

        let instruction = initialize_instruction(crate::ID, admin, global_state);

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
                        lamports: 0,
                        ..Default::default()
                    },
                ), // no funds
                keyed_account_for_system_program(),
            ],
        );

        assert!(!result.program_result.is_ok());
    }

    /// Calling initialize twice on the same PDA should fail
    #[test]
    fn test_initialize_fails_if_already_initialized() {
        let (mollusk, admin, global_state) = setup();

        let instruction = initialize_instruction(crate::ID, admin, global_state);

        // First call — should succeed
        let first = mollusk.process_instruction(
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
        assert!(first.program_result.is_ok());

        // Second call — reuse the already-initialized account from first result
        let initialized_account = first
            .get_account(&global_state)
            .expect("global_state not found")
            .clone();

        let second = mollusk.process_instruction(
            &instruction,
            &[
                (global_state, initialized_account),
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

        assert!(!second.program_result.is_ok());
    }

    /// A different signer becomes the admin
    #[test]
    fn test_initialize_different_admin() {
        let (mollusk, _, global_state) = setup();
        let another_admin = Pubkey::new_unique();

        let instruction = initialize_instruction(crate::ID, another_admin, global_state);

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
                    another_admin,
                    Account {
                        lamports: 1_000_000_000,
                        ..Default::default()
                    },
                ),
                keyed_account_for_system_program(),
            ],
        );

        assert!(result.program_result.is_ok());

        let state_account = result
            .get_account(&global_state)
            .expect("global_state not found");
        let state = GlobalState::try_deserialize(&mut state_account.data.as_slice())
            .expect("failed to deserialize GlobalState");

        assert_eq!(state.admin, another_admin);
        assert_eq!(state.poll_count, 0);
    }
}
