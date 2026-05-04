package com.tab.dra2.web;

import com.tab.dra2.dto.CreatePersonelRequest;
import com.tab.dra2.dto.PersonelListResponse;
import com.tab.dra2.dto.PersonelResponse;
import com.tab.dra2.dto.UpdatePersonelRequest;
import com.tab.dra2.service.PersonelService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping({"/api/personnel", "/api/personels"})
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN')")
@Validated
public class PersonelController {

    private final PersonelService personelService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PersonelListResponse> list(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "ASC") String sort,
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "page must be > 0") int page,
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "limit must be > 0") int limit
    ) {
        return ResponseEntity.ok(personelService.getList(q, orderBy, sort, page, limit));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PersonelResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(personelService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PersonelResponse> create(@Valid @RequestBody CreatePersonelRequest request) {
        return ResponseEntity.ok(personelService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PersonelResponse> update(@PathVariable Long id, @Valid @RequestBody UpdatePersonelRequest request) {
        return ResponseEntity.ok(personelService.update(id, request));
        
    }

}
