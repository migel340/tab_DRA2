package com.tab.dra2.web;

import com.tab.dra2.dto.ActivityTypeDto;
import com.tab.dra2.dto.ApiResponse;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.service.ActivityTypeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activity-types")
@RequiredArgsConstructor
@Tag(name = "Activity Types")
public class ActivityTypeController {

    private final ActivityTypeService activityTypeService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ActivityTypeDto>> create(@Valid @RequestBody ActivityTypeDto dto) {
        ActivityTypeDto data = activityTypeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ActivityTypeDto>builder()
                .success(true)
                .message("Created")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ListResponse<ActivityTypeDto>>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "id") String orderBy,
            @RequestParam(defaultValue = "ASC") String sort
    ) {
        ListResponse<ActivityTypeDto> data = activityTypeService.list(page, limit, orderBy, sort);
        return ResponseEntity.ok(ApiResponse.<ListResponse<ActivityTypeDto>>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ActivityTypeDto>> getById(@PathVariable Long id) {
        ActivityTypeDto data = activityTypeService.getById(id);
        return ResponseEntity.ok(ApiResponse.<ActivityTypeDto>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ActivityTypeDto>> update(@PathVariable Long id, @Valid @RequestBody ActivityTypeDto dto) {
        ActivityTypeDto data = activityTypeService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.<ActivityTypeDto>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build());
    }
}
