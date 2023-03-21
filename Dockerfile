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
RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY ./scripts/start.sh  /usr/local/bin/start.sh
COPY --from=build /app/server/target/release/feature_probe_server /usr/local/bin/feature_probe_server
COPY ./api/admin/target/api.jar /usr/local/bin/api.jar
COPY ./analysis/target/analysis.jar /usr/local/bin/analysis.jar
ENTRYPOINT ["/usr/local/bin/start.sh"]

