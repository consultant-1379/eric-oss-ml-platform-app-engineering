##### Files:
* `IdunMlExecutionEnvTestModel.py`: simple test model, that returns the received string with *"mxe_"* prefix added
* `requirements.txt`: Python dependencies
* `.s2i/environment`: add required parameters here

You can also add a `setup.py` rather than a `requirements.txt` file.

##### How to wrap:
```bash
s2i build simpledemotest/ seldonio/seldon-core-s2i-python3 simpledemotest:1.0.0
```

##### Running as a standalone container (for testing only!!!):
```bash
docker run -p 5000:5000 simpledemotest:1.0.0
```

##### How to interact:
```bash
curl -X POST -H "Content-Type: multipart/form-data" --form "json={<PAYLOAD>}" http://localhost:5000/predict
```

Sample payload:
```json
{"data": {"ndarray": [1,2,3], "names": ["f1", "f2"]}}
```

Custom metrics: -

##### Onboard the model into MXE:
```bash
mxe-model onboard --source <...>/eric-oss-ml-platform-app-engineering/simpledemotest
```

##### Start the model service in MXE:
```bash
mxe-service create --manifest <...>/eric-oss-ml-platform-app-engineering/mxe-k6-functional/k6/resources/manifests/simple-demo.yml
```
