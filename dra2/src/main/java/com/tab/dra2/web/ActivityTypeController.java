package com.tab.dra2.web;

import com.tab.dra2.dto.ActivityTypeResponseDto;
import com.tab.dra2.dto.ApiResponse;
import com.tab.dra2.dto.ActivityTypeSaveDto;
import com.tab.dra2.service.ActivityTypeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activity-types")
@RequiredArgsConstructor
@Tag(name = "Activity Types")
@Validated
public class ActivityTypeController {

    private final ActivityTypeService activityTypeService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ActivityTypeResponseDto>> create(@Valid @RequestBody ActivityTypeSaveDto dto) {
        ActivityTypeResponseDto data = activityTypeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ActivityTypeResponseDto>builder()
                .success(true)
                .message("Created")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<ActivityTypeResponseDto>>> list() {
        List<ActivityTypeResponseDto> data = activityTypeService.list();
        return ResponseEntity.ok(ApiResponse.<List<ActivityTypeResponseDto>>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ActivityTypeResponseDto>> getById(@PathVariable Long id) {
        ActivityTypeResponseDto data = activityTypeService.getById(id);
        return ResponseEntity.ok(ApiResponse.<ActivityTypeResponseDto>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ActivityTypeResponseDto>> update(@PathVariable Long id,
            @Valid @RequestBody ActivityTypeSaveDto dto) {
        ActivityTypeResponseDto data = activityTypeService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.<ActivityTypeResponseDto>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        activityTypeService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Deleted")
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }
}
