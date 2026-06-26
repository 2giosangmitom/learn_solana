use anchor_lang::prelude::*;

use crate::{constants, state::GlobalState};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct PollOption {
    #[max_len(100)]
    pub label: String,
    pub votes: u32,
}

#[account]
#[derive(InitSpace)]
pub struct PollAccount {
    pub id: u64,
    pub owner: Pubkey,
    pub bump: u8,
    #[max_len(100)]
    pub title: String,
    #[max_len(200)]
    pub description: String,
    #[max_len(10)]
    pub options: Vec<PollOption>,
}

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
mod tests {}
