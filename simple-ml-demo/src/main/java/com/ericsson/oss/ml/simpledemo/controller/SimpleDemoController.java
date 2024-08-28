package com.ericsson.oss.ml.simpledemo.controller;

import static java.nio.charset.StandardCharsets.UTF_8;

import com.ericsson.oss.ml.simpledemo.service.MxeModelEndpoint;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/simplemldemo")
public class SimpleDemoController {

    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleDemoController.class);
    private static final String HELLO_WORLD = "Hello ML Execution Environment!";

    @Autowired
    private MxeModelEndpoint modelEndpoint;

    @GetMapping
    public String getSimpledemoResponse(@RequestParam(required = false) String data) {
        if(data != null) {
            LOGGER.info("Started '/simplemldemo?data={data}' endpoint call");
            String response = modelEndpoint.send(data);
            LOGGER.info("Finished '/simplemldemo?data={data}' endpoint call");
            return response;
        }
        return HELLO_WORLD;
    }

}

