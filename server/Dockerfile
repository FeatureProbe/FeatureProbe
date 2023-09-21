FROM rust:1.64.0 as build

RUN rustup target add x86_64-unknown-linux-musl
RUN apt update && apt install -y musl-tools musl-dev build-essential
RUN update-ca-certificates


WORKDIR /app
COPY . /app
WORKDIR /app/server

RUN rustc -V
RUN cargo build --release --verbose

FROM debian:buster-slim
COPY --from=build /app/server/target/release/feature_probe_server .

CMD [ "./feature_probe_server" ]

