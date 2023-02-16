FROM openjdk:8-jre-alpine
COPY ./ ./

RUN apk --no-cache add curl

ENV JVM_ARGS=${JVM_ARGS}

COPY admin/target/analysis.jar feature-probe-analysis.jar



ENTRYPOINT java ${JVM_ARGS} -jar feature-probe-analysis.jar
