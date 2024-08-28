package com.ericsson.oss.ml.simpledemo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ericsson.oss.ml.simpledemo.service.MxeModelEndpoint;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest
class SimpleDemoApplicationTests {

    @Autowired
    private MockMvc controller;

    @MockBean
    private MxeModelEndpoint modelEndpoint;

    @Test
    public void contextLoaderSmokeTest() {
        assertThat(controller).isNotNull();
    }

    @Test
    @WithMockUser
    public void greetingShouldReturnDefaultMessage() throws Exception {
        this.controller.perform(get("/simplemldemo"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Hello ML Execution Environment!")));
    }

    @Test
    @WithMockUser
    public void greetingShouldReturnMessageFromModelEndpoint() throws Exception {
        when(modelEndpoint.send(any())).thenReturn("bar");

        this.controller.perform(get("/simplemldemo?data=test"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("bar")));
    }
}
