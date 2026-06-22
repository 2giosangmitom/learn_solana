pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

use instructions::*;

declare_id!("DZ6dbiagaYka6FznFgLGEnBRhbbosjhod4Wwou1z3EcK");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::initialize_handler(ctx)
    }
}
