package com.tab.dra2.web;

import com.tab.dra2.dto.ApiResponse;
import com.tab.dra2.dto.CreateRequestDto;
import com.tab.dra2.dto.RequestResponse;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.service.RequestService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@Tag(name = "Requests")
public class RequestController {

        private final RequestService requestService;

        @PostMapping
        @PreAuthorize("hasAnyRole('MANAGER')")
        public ResponseEntity<ApiResponse<RequestResponse>> create(@Valid @RequestBody CreateRequestDto dto) {
                RequestResponse data = requestService.create(dto);
                ApiResponse<RequestResponse> resp = ApiResponse.<RequestResponse>builder()
                                .success(true)
                                .message("Created")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        }

        @GetMapping
        @PreAuthorize("hasRole('MANAGER')")
        public ResponseEntity<ApiResponse<ListResponse<RequestResponse>>> list(
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) String status,
                        @RequestParam(required = false) String manager,
                        @RequestParam(required = false) String dateFrom,
                        @RequestParam(required = false) String dateTo,
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "10") int limit,
                        @RequestParam(defaultValue = "id") String orderBy,
                        @RequestParam(defaultValue = "ASC") String sort) {
                ListResponse<RequestResponse> data = requestService.list(q, status, manager, dateFrom, dateTo, page,
                                limit,
                                orderBy,
                                sort);
                ApiResponse<ListResponse<RequestResponse>> resp = ApiResponse.<ListResponse<RequestResponse>>builder()
                                .success(true)
                                .message("OK")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.ok(resp);
        }

        @GetMapping("/{id}")
        @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
        public ResponseEntity<ApiResponse<RequestResponse>> getById(@PathVariable Integer id) {
                RequestResponse data = requestService.getById(id);
                ApiResponse<RequestResponse> resp = ApiResponse.<RequestResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.ok(resp);
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasRole('MANAGER')")
        public ResponseEntity<ApiResponse<RequestResponse>> update(@PathVariable Integer id,
                        @Valid @RequestBody CreateRequestDto dto) {
                RequestResponse data = requestService.update(id, dto);
                ApiResponse<RequestResponse> resp = ApiResponse.<RequestResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.ok(resp);
        }
}
