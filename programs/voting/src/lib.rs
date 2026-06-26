pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

use instructions::*;

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
}
