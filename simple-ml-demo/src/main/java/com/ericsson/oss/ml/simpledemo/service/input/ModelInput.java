package com.ericsson.oss.ml.simpledemo.service.input;

public class ModelInput {
    private DataWrapper data;

    public ModelInput(String input) {
        data = new DataWrapper(input);
    }

    public void setData(DataWrapper data) {
        this.data = data;
    }

    public DataWrapper getData() {
        return data;
    }

    public static class DataWrapper {
        private String[] ndarray;

        public DataWrapper(String input) {
            ndarray = new String[1];
            ndarray[0] = input;
        }

        public void setNdarray(String[] ndarray) {
            this.ndarray = ndarray;
        }

        public String[] getNdarray() {
            return ndarray;
        }
    }
}
