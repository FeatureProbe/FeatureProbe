FROM debian:buster-slim
RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY ./scripts/start.sh  /usr/local/bin/start.sh
COPY ./server/target/release/feature_probe_server /usr/local/bin/feature_probe_server
COPY ./api/admin/target/api.jar /usr/local/bin/api.jar
COPY ./analysis/target/analysis.jar /usr/local/bin/analysis.jar
ENTRYPOINT ["/usr/local/bin/start.sh"]

