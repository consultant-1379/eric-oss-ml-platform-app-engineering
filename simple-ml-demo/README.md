Simple app to be deployed on the test cluster where IDUN is deployed.
It is for testing the invocation of a model service of MXE.

In case of any modification in the app's code a new image is needed. Build the app and create the new image with docker and push it to the repo, tagged with the incremented version.

```bash
$ mvn package
$ docker build -t armdocker.rnd.ericsson.se/proj-smoke-dev/eric-simple-ml-demo:<new_version> .
$ docker push armdocker.rnd.ericsson.se/proj-smoke-dev/eric-simple-ml-demo:<new_version>
```

The `eric-product-info.yaml` also needs to be updated with the new version.