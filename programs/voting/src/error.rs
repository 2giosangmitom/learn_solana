use anchor_lang::prelude::*;

#[error_code]
pub enum VotingError {
    #[msg("Invalid option index")]
    InvalidOptionIndex,
    #[msg("Already voted on this poll")]
    AlreadyVoted,
    #[msg("Poll does not exist")]
    PollNotFound,
}
