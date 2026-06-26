pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

use instructions::*;
use state::PollOption;

declare_id!("DXZ1gUBaHsj5cKAfRGZjqYigWF7wv1Js2aHKwKVYtUVA");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::Initialize::execute(ctx)
    }

    pub fn create_poll(
        ctx: Context<CreatePoll>,
        title: String,
        description: String,
        options: Vec<PollOption>,
    ) -> Result<()> {
        create_poll::CreatePoll::execute(ctx, title, description, options)
    }

    pub fn vote(ctx: Context<Vote>, poll_id: u64, option_index: u8) -> Result<()> {
        vote::Vote::execute(ctx, poll_id, option_index)
    }
}
