pub use gstd::{prelude::*, ActorId};
use gtest::{Program as InnerProgram, System};

pub fn initialize_system() -> System {
    let system = System::new();

    system.init_logger();

    system
}

pub trait Program {
    fn inner_program(&self) -> &InnerProgram;

    fn actor_id(&self) -> ActorId {
        let bytes: [u8; 32] = self.inner_program().id().into();

        bytes.into()
    }
}
