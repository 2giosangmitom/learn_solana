use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct GlobalState {
    pub admin: Pubkey,
    pub poll_count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct VoteRecord {
    pub poll_id: u64,
    pub voter: Pubkey,
    pub option_index: u8,
    pub bump: u8,
}

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
