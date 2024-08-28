class TestModel(object):

    def __init__(self):
        print("Initializing")

    def predict(self,X,features_names):
        print("Result:")
        value = X[0]
        return X