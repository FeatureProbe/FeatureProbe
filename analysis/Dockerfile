FROM openjdk:8-jre-alpine

RUN apk --no-cache add curl

ENV JVM_ARGS=${JVM_ARGS}

COPY ./target/analysis.jar feature-probe-analysis.jar



ENTRYPOINT java ${JVM_ARGS} -jar feature-probe-analysis.jar
