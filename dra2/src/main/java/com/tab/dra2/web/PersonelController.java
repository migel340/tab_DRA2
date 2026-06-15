package com.tab.dra2.web;

import com.tab.dra2.dto.CreatePersonelRequest;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.dto.PersonelLookupResponse;
import com.tab.dra2.dto.PersonelResponse;
import com.tab.dra2.dto.UpdatePersonelRequest;
import com.tab.dra2.enums.Role;
import com.tab.dra2.dto.ApiResponse;
import com.tab.dra2.service.PersonelService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import java.util.List;

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
@RequestMapping({ "/api/personnel", "/api/personels" })
@RequiredArgsConstructor
@Validated
public class PersonelController {

        private final PersonelService personelService;

        @GetMapping
        @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
        public ResponseEntity<ApiResponse<ListResponse<PersonelResponse>>> list(
                        @RequestParam(required = false) String q,
                        @RequestParam(defaultValue = "id") String orderBy,
                        @RequestParam(defaultValue = "ASC") String sort,
                        @RequestParam(defaultValue = "1") @Min(value = 1, message = "page must be > 0") int page,
                        @RequestParam(defaultValue = "10") @Min(value = 1, message = "limit must be > 0") int limit,
                        @RequestParam(required = false) Boolean active) {
                ListResponse<PersonelResponse> data = personelService.getList(q, orderBy, sort, page, limit, active);
                ApiResponse<ListResponse<PersonelResponse>> response = ApiResponse
                                .<ListResponse<PersonelResponse>>builder()
                                .success(true)
                                .message("OK")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.ok(response);
        }

        @GetMapping("/{id}")
        @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
        public ResponseEntity<ApiResponse<PersonelResponse>> getById(@PathVariable Long id) {
                PersonelResponse data = personelService.getById(id);
                ApiResponse<PersonelResponse> response = ApiResponse.<PersonelResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.ok(response);
        }

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<PersonelResponse>> create(@Valid @RequestBody CreatePersonelRequest request) {
                PersonelResponse data = personelService.create(request);
                ApiResponse<PersonelResponse> response = ApiResponse.<PersonelResponse>builder()
                                .success(true)
                                .message("Created")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(response);
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<PersonelResponse>> update(@PathVariable Long id,
                        @Valid @RequestBody UpdatePersonelRequest request) {
                PersonelResponse data = personelService.update(id, request);
                ApiResponse<PersonelResponse> response = ApiResponse.<PersonelResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.ok(response);
        }

        @GetMapping("/lookup")
        @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
        public ResponseEntity<ApiResponse<List<PersonelLookupResponse>>> lookup(
                        @Valid @RequestParam(required = false) Role role) {
                ApiResponse<List<PersonelLookupResponse>> response = ApiResponse.<List<PersonelLookupResponse>>builder()
                                .success(true)
                                .message("OK")
                                .data(personelService.lookup(role))
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.ok(response);

        }

}
