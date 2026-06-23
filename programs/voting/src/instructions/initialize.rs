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

pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
    let state = &mut ctx.accounts.global_state;
    state.admin = ctx.accounts.admin.key();
    state.poll_count = 0;

    Ok(())
}
