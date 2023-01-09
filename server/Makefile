build_date = `date +%Y%m%d%H%M`
commit = `git rev-parse HEAD`
version = `git rev-parse --short HEAD`

.PHONY: release
build:
	cargo build --verbose
release:
	cargo build --release --verbose
test:
	cargo test --release --verbose && \
	cargo test --release --verbose --features realtime --no-default-features
example:
	cargo build --examples --release --verbose
