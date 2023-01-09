use vergen::{vergen, Config};

fn main() {
    // Generate the default 'cargo:' instruction output
    let _ = vergen(Config::default());
}
