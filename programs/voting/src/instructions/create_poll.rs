use anchor_lang::prelude::*;

use crate::{
    constants,
    state::{GlobalState, PollAccount, PollOption},
};

#[derive(Accounts)]
pub struct CreatePoll<'info> {
    #[account(mut, seeds = [constants::SEED.as_bytes()], bump)]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + PollAccount::INIT_SPACE,
        seeds = [constants::SEED.as_bytes(), &global_state.poll_count.to_le_bytes()],
        bump
    )]
    pub poll_account: Account<'info, PollAccount>,

    pub system_program: Program<'info, System>,
}

impl<'info> CreatePoll<'info> {
    pub fn execute(
        ctx: Context<CreatePoll>,
        title: String,
        description: String,
        options: Vec<PollOption>,
    ) -> Result<()> {
        let state = &mut ctx.accounts.global_state;

        let poll_account = &mut ctx.accounts.poll_account;
        poll_account.id = state.poll_count;
        poll_account.owner = ctx.accounts.owner.key();
        poll_account.bump = ctx.bumps.poll_account;
        poll_account.title = title;
        poll_account.description = description;
        poll_account.options = options;

        state.poll_count += 1;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use {
        super::*,
        crate::{constants, state::GlobalState},
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

    /// Initialize global_state and return the result for account extraction.
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

    /// Happy path: create a poll with options and verify state
    #[test]
    fn test_create_poll_success() {
        let (mollusk, admin, global_state) = setup();
        let owner = Pubkey::new_unique();
        let program_id = crate::ID;

        let init_result = initialize_global_state(&mollusk, program_id, admin, global_state);

        let poll_count_bytes = 0_u64.to_le_bytes();
        let (poll_account, _) = Pubkey::find_program_address(
            &[constants::SEED.as_bytes(), &poll_count_bytes],
            &program_id,
        );

        let options = vec![
            PollOption {
                label: "Option A".to_string(),
                votes: 0,
            },
            PollOption {
                label: "Option B".to_string(),
                votes: 0,
            },
        ];

        let instruction = create_poll_instruction(
            program_id,
            owner,
            global_state,
            poll_account,
            "My Poll".to_string(),
            "A test poll".to_string(),
            options,
        );

        let global_state_account = init_result
            .get_account(&global_state)
            .expect("global_state not found")
            .clone();

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

        let poll_account_data = result
            .get_account(&poll_account)
            .expect("poll_account not found");
        let poll = PollAccount::try_deserialize(&mut poll_account_data.data.as_slice())
            .expect("failed to deserialize PollAccount");

        assert_eq!(poll.id, 0);
        assert_eq!(poll.owner, owner);
        assert_eq!(poll.title, "My Poll");
        assert_eq!(poll.description, "A test poll");
        assert_eq!(poll.options.len(), 2);
        assert_eq!(poll.options[0].label, "Option A");
        assert_eq!(poll.options[0].votes, 0);
        assert_eq!(poll.options[1].label, "Option B");
        assert_eq!(poll.options[1].votes, 0);

        let state_account = result
            .get_account(&global_state)
            .expect("global_state not found");
        let state = GlobalState::try_deserialize(&mut state_account.data.as_slice())
            .expect("failed to deserialize GlobalState");
        assert_eq!(state.poll_count, 1);
    }

    /// Create two polls sequentially, verify incrementing id and poll_count
    #[test]
    fn test_create_poll_increments_count() {
        let (mollusk, admin, global_state) = setup();
        let owner = Pubkey::new_unique();
        let program_id = crate::ID;

        let init_result = initialize_global_state(&mollusk, program_id, admin, global_state);

        // First poll
        let poll_count_bytes_0 = 0_u64.to_le_bytes();
        let (poll_account_0, _) = Pubkey::find_program_address(
            &[constants::SEED.as_bytes(), &poll_count_bytes_0],
            &program_id,
        );

        let options_0 = vec![PollOption {
            label: "Yes".to_string(),
            votes: 0,
        }];

        let instruction_0 = create_poll_instruction(
            program_id,
            owner,
            global_state,
            poll_account_0,
            "Poll One".to_string(),
            "First poll".to_string(),
            options_0,
        );

        let global_state_account = init_result
            .get_account(&global_state)
            .expect("global_state not found")
            .clone();

        let result_0 = mollusk.process_instruction(
            &instruction_0,
            &[
                (global_state, global_state_account),
                (
                    owner,
                    Account {
                        lamports: 2_000_000_000,
                        ..Default::default()
                    },
                ),
                (
                    poll_account_0,
                    Account {
                        lamports: 0,
                        ..Default::default()
                    },
                ),
                keyed_account_for_system_program(),
            ],
        );

        assert!(result_0.program_result.is_ok());

        let poll_0_data = result_0
            .get_account(&poll_account_0)
            .expect("poll_account not found");
        let poll_0 = PollAccount::try_deserialize(&mut poll_0_data.data.as_slice())
            .expect("failed to deserialize PollAccount");
        assert_eq!(poll_0.id, 0);

        // Second poll
        let poll_count_bytes_1 = 1_u64.to_le_bytes();
        let (poll_account_1, _) = Pubkey::find_program_address(
            &[constants::SEED.as_bytes(), &poll_count_bytes_1],
            &program_id,
        );

        let options_1 = vec![PollOption {
            label: "No".to_string(),
            votes: 0,
        }];

        let instruction_1 = create_poll_instruction(
            program_id,
            owner,
            global_state,
            poll_account_1,
            "Poll Two".to_string(),
            "Second poll".to_string(),
            options_1,
        );

        let global_state_after = result_0
            .get_account(&global_state)
            .expect("global_state not found")
            .clone();

        let result_1 = mollusk.process_instruction(
            &instruction_1,
            &[
                (global_state, global_state_after),
                (
                    owner,
                    Account {
                        lamports: 2_000_000_000,
                        ..Default::default()
                    },
                ),
                (
                    poll_account_1,
                    Account {
                        lamports: 0,
                        ..Default::default()
                    },
                ),
                keyed_account_for_system_program(),
            ],
        );

        assert!(result_1.program_result.is_ok());

        let poll_1_data = result_1
            .get_account(&poll_account_1)
            .expect("poll_account not found");
        let poll_1 = PollAccount::try_deserialize(&mut poll_1_data.data.as_slice())
            .expect("failed to deserialize PollAccount");
        assert_eq!(poll_1.id, 1);
        assert_eq!(poll_1.title, "Poll Two");

        let state_account = result_1
            .get_account(&global_state)
            .expect("global_state not found");
        let state = GlobalState::try_deserialize(&mut state_account.data.as_slice())
            .expect("failed to deserialize GlobalState");
        assert_eq!(state.poll_count, 2);
    }

    /// Calling create_poll without initializing global_state first should fail
    #[test]
    fn test_create_poll_fails_without_global_state() {
        let (mollusk, _, global_state) = setup();
        let owner = Pubkey::new_unique();
        let program_id = crate::ID;

        let poll_count_bytes = 0_u64.to_le_bytes();
        let (poll_account, _) = Pubkey::find_program_address(
            &[constants::SEED.as_bytes(), &poll_count_bytes],
            &program_id,
        );

        let options = vec![PollOption {
            label: "Only".to_string(),
            votes: 0,
        }];

        let instruction = create_poll_instruction(
            program_id,
            owner,
            global_state,
            poll_account,
            "Fail Poll".to_string(),
            "Should fail".to_string(),
            options,
        );

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

        assert!(!result.program_result.is_ok());
    }

    /// Owner with 0 lamports should fail to fund the poll_account PDA
    #[test]
    fn test_create_poll_fails_with_insufficient_lamports() {
        let (mollusk, admin, global_state) = setup();
        let owner = Pubkey::new_unique();
        let program_id = crate::ID;

        let init_result = initialize_global_state(&mollusk, program_id, admin, global_state);

        let poll_count_bytes = 0_u64.to_le_bytes();
        let (poll_account, _) = Pubkey::find_program_address(
            &[constants::SEED.as_bytes(), &poll_count_bytes],
            &program_id,
        );

        let options = vec![PollOption {
            label: "Only".to_string(),
            votes: 0,
        }];

        let instruction = create_poll_instruction(
            program_id,
            owner,
            global_state,
            poll_account,
            "Poor Poll".to_string(),
            "No funds".to_string(),
            options,
        );

        let global_state_account = init_result
            .get_account(&global_state)
            .expect("global_state not found")
            .clone();

        let result = mollusk.process_instruction(
            &instruction,
            &[
                (global_state, global_state_account),
                (
                    owner,
                    Account {
                        lamports: 0,
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

        assert!(!result.program_result.is_ok());
    }

    /// Owner not marked as signer should fail
    #[test]
    fn test_create_poll_fails_without_owner_signature() {
        let (mollusk, admin, global_state) = setup();
        let owner = Pubkey::new_unique();
        let program_id = crate::ID;

        let init_result = initialize_global_state(&mollusk, program_id, admin, global_state);

        let poll_count_bytes = 0_u64.to_le_bytes();
        let (poll_account, _) = Pubkey::find_program_address(
            &[constants::SEED.as_bytes(), &poll_count_bytes],
            &program_id,
        );

        let options = vec![PollOption {
            label: "Only".to_string(),
            votes: 0,
        }];

        let instruction = Instruction::new_with_bytes(
            program_id,
            &crate::instruction::CreatePoll {
                title: "Unsigned Poll".to_string(),
                description: "No signature".to_string(),
                options,
            }
            .data(),
            vec![
                AccountMeta::new(global_state, false),
                AccountMeta::new(owner, false),
                AccountMeta::new(poll_account, false),
                AccountMeta::new_readonly(system_program::ID, false),
            ],
        );

        let global_state_account = init_result
            .get_account(&global_state)
            .expect("global_state not found")
            .clone();

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

        assert!(!result.program_result.is_ok());
    }
}
