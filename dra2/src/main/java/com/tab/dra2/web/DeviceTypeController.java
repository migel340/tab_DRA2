package com.tab.dra2.web;

import com.tab.dra2.dto.ApiResponse;
import com.tab.dra2.dto.DeviceTypeResponseDto;
import com.tab.dra2.dto.DeviceTypeSaveDto;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.service.DeviceTypeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/device-types")
@RequiredArgsConstructor

@Tag(name = "Device Types")
public class DeviceTypeController {

    private final DeviceTypeService deviceTypeService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<DeviceTypeResponseDto>> create(@Valid @RequestBody DeviceTypeSaveDto dto) {
        DeviceTypeResponseDto data = deviceTypeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<DeviceTypeResponseDto>builder()
                .success(true)
                .message("Created")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ListResponse<DeviceTypeResponseDto>>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "ASC") String sort) {
        ListResponse<DeviceTypeResponseDto> data = deviceTypeService.list(page, limit, orderBy, sort);
        return ResponseEntity.ok(ApiResponse.<ListResponse<DeviceTypeResponseDto>>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<DeviceTypeResponseDto>> getById(@PathVariable Integer id) {
        DeviceTypeResponseDto data = deviceTypeService.getById(id);
        return ResponseEntity.ok(ApiResponse.<DeviceTypeResponseDto>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<DeviceTypeResponseDto>> update(@PathVariable Integer id,
            @Valid @RequestBody DeviceTypeSaveDto dto) {
        DeviceTypeResponseDto data = deviceTypeService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.<DeviceTypeResponseDto>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }
}
