package com.tab.dra2.web;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/personels")
@RequiredArgsConstructor
 @PreAuthorize("hasAnyRole('ADMIN')")
public class PersonelController {


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public String getMethodName() {
        return "Hej to ja";
    }

}
