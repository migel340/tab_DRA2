package com.tab.dra2.web;

import com.tab.dra2.dto.ApiResponse;
import com.tab.dra2.dto.ClientResponse;
import com.tab.dra2.dto.CreateClientDto;
import com.tab.dra2.service.ClientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@Tag(name = "Clients")
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<ApiResponse<ClientResponse>> create(@Valid @RequestBody CreateClientDto dto) {
        ClientResponse data = clientService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ClientResponse>builder()
                .success(true)
                .message("Created")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<Page<ClientResponse>>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "ASC") String sort
    ) {
        Page<ClientResponse> data = clientService.list(page, limit, orderBy, sort);
        return ResponseEntity.ok(ApiResponse.<Page<ClientResponse>>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ClientResponse>> getById(@PathVariable Integer id) {
        ClientResponse data = clientService.getById(id);
        return ResponseEntity.ok(ApiResponse.<ClientResponse>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<ApiResponse<ClientResponse>> update(@PathVariable Integer id, @Valid @RequestBody CreateClientDto dto) {
        ClientResponse data = clientService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.<ClientResponse>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }
}
