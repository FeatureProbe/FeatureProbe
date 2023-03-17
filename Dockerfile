# Rust 编译阶段
FROM rust:1.64.0 as rust-builder
WORKDIR /workspace

COPY server/Cargo.toml server/Cargo.lock server/build.rs ./
RUN mkdir -p src && echo "fn main() {}" > src/main.rs && echo "" > src/lib.rs && cargo build --release
RUN rm -rf src target/release/.fingerprint/server-*
COPY ./ ./
WORKDIR /workspace/server
RUN rustc -V
RUN cargo build --release --verbose

# Java 编译阶段
FROM maven:3.8.3-openjdk-11 AS java-builder
WORKDIR /workspace
COPY api ./api
COPY ui  ./ui
RUN mvn -B package --file ./api/pom.xml
COPY analysis ./analysis
RUN mvn -B package --file ./analysis/pom.xml


# 最终镜像
FROM debian:buster-slim
RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY ./scripts/start.sh /usr/local/bin/start.sh
COPY --from=rust-builder /workspace/server/target/release/feature_probe_server /usr/local/bin/feature_probe_server
COPY --from=java-builder /workspace/api/admin/target/api.jar /usr/local/bin/api.jar
COPY --from=java-builder /workspace/analysis/target/analysis.jar /usr/local/bin/analysis.jar
ENTRYPOINT ["/usr/local/bin/start.sh"]

