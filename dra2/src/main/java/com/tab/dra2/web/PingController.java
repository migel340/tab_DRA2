package com.tab.dra2.web;

import com.tab.dra2.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping("/ping")
    public ApiResponse<String> ping() {
        return ApiResponse.<String>builder()
                .success(true)
                .message("pong")
                .data("pong")
                .timestamp(java.time.LocalDateTime.now())
                .build();
    }

}
