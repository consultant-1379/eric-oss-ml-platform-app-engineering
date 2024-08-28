ARG CBO_IMAGE_URL=armdocker.rnd.ericsson.se/proj-ldc/common_base_os_release/sles
ARG CBO_VERSION=6.12.0-13

FROM maven:3-eclipse-temurin-11 AS build

COPY settings.xml /root/.m2/settings.xml
COPY pom.xml /home/app/
COPY src /home/app/src

RUN mvn -f /home/app/pom.xml clean package

FROM ${CBO_IMAGE_URL}:${CBO_VERSION}
ARG CBO_VERSION
ARG CBO_REPO=arm.sero.gic.ericsson.se/artifactory/proj-ldc-repo-rpm-local/common_base_os/sles/

RUN zypper addrepo --gpgcheck-strict -f https://${CBO_REPO}${CBO_VERSION} COMMON_BASE_OS_SLES_REPO \
    && zypper --gpg-auto-import-keys refresh \
    && zypper update -y \
    && zypper install -l -y java-11-openjdk-headless \
    && zypper clean --all

COPY --from=build /home/app/target/simple-ml-demo-0.0.1-SNAPSHOT.jar /app/app.jar

ARG USER_ID=261848
RUN chown -R $USER_ID /app \
    && echo "$USER_ID:!::0:::::" >>/etc/shadow \
    && echo "$USER_ID:x:$USER_ID:$USER_ID:An Identity for simple-ml-demo user:/nonexistent:/bin/false" >>/etc/passwdUSER $USER_ID

USER $USER_ID

ENTRYPOINT ["/usr/bin/java", "-jar", "/app/app.jar"]
