package com.tab.dra2.web;

import com.tab.dra2.dto.ApiResponse;
import com.tab.dra2.dto.CreateDeviceDto;
import com.tab.dra2.dto.DeviceResponse;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.service.DeviceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
@Tag(name = "Devices")
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<ApiResponse<DeviceResponse>> create(@Valid @RequestBody CreateDeviceDto dto) {
        DeviceResponse data = deviceService.create(dto);
        ApiResponse<DeviceResponse> resp = ApiResponse.<DeviceResponse>builder()
                .success(true)
                .message("Created")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<ListResponse<DeviceResponse>>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "ASC") String sort,
            @RequestParam(required = false) Integer clientId) {
        ListResponse<DeviceResponse> data = deviceService.list(page, limit, orderBy, sort, clientId);
        ApiResponse<ListResponse<DeviceResponse>> resp = ApiResponse.<ListResponse<DeviceResponse>>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','STAFF')")
    public ResponseEntity<ApiResponse<DeviceResponse>> getById(@PathVariable Integer id) {
        DeviceResponse data = deviceService.getById(id);
        ApiResponse<DeviceResponse> resp = ApiResponse.<DeviceResponse>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<ApiResponse<DeviceResponse>> update(@PathVariable Integer id,
            @Valid @RequestBody CreateDeviceDto dto) {
        DeviceResponse data = deviceService.update(id, dto);
        ApiResponse<DeviceResponse> resp = ApiResponse.<DeviceResponse>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.ok(resp);
    }
}
