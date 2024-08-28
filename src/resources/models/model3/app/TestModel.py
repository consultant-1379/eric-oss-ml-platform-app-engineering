class TestModel(object):

    def __init__(self):
        print("Initializing")

    def predict(self,X,features_names):
        print("Result:")
        Y = "ml_" + str(X[0])
        print(Y)
        return Y