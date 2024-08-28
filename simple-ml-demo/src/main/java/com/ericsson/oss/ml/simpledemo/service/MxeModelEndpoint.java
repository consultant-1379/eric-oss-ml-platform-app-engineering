package com.ericsson.oss.ml.simpledemo.service;

import com.ericsson.oss.ml.simpledemo.service.input.ModelInput;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

@Service
public class MxeModelEndpoint {

    private static final Logger LOGGER = LogManager.getLogger(MxeModelEndpoint.class);

    @Value("${mxe.model-service-uri}")
    private String mxeModelServiceUri;

    @Autowired
    private OAuth2RestTemplate restTemplate;

    public String send(String data) {
        String result = restTemplate.exchange(
                mxeModelServiceUri,
                HttpMethod.POST,
                new HttpEntity<>(new ModelInput(data)),
                String.class).getBody();
        LOGGER.info("result: {}", result);
        return result;
    }
}
