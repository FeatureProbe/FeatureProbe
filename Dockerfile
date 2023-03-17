# Rust compile
FROM rust:1.64.0 as rust-builder
WORKDIR /workspace
COPY ./ ./
WORKDIR /workspace/server
RUN rustc -V
RUN cargo build --release --verbose

# Java compile
FROM maven:3.8.3-openjdk-11 AS java-builder
WORKDIR /workspace
COPY api ./api
COPY ui  ./ui
RUN mvn -B package --file ./api/pom.xml
COPY analysis ./analysis
RUN mvn -B package --file ./analysis/pom.xml


# FeatureProbe All
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

