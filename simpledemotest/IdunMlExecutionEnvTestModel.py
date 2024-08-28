class IdunMlExecutionEnvTestModel(object):

    def __init__(self):
        print("Initializing")
        self._metrics = []

    def predict(self,X,feature_names):
        print("Predict called with feature names: ")
        print(feature_names)
        print("Result:")
        Y = "mxe_" + str(X[0])
        print(Y)
        return [Y]

    def metrics(self):
        print("Returning metrics:")
        print(self._metrics)
        return self._metrics
