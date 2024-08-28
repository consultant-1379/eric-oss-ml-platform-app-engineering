# Seldon required python version 3.8
FROM armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/python:3.8-slim
WORKDIR /app

# Define environment variable
ENV MODEL_NAME TestModel
ENV SERVICE_TYPE MODEL

# Install python packages
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY /app /app

# Port for REST
EXPOSE 5000

# Changing folder to Seldon's default user
ARG USER_ID=8888
RUN chown -R $USER_ID /app \
    && echo "$USER_ID:!::0:::::" >>/etc/shadow \
    && echo "$USER_ID:x:$USER_ID:$USER_ID:An Identity for model user:/nonexistent:/bin/false" >>/etc/passwdUSER $USER_ID

USER $USER_ID

CMD exec seldon-core-microservice $MODEL_NAME --service-type $SERVICE_TYPE
