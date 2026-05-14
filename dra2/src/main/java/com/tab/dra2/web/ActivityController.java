package com.tab.dra2.web;

import com.tab.dra2.dto.ActivityResponse;
import com.tab.dra2.dto.ApiResponse;
import com.tab.dra2.dto.CreateActivityDto;
import com.tab.dra2.dto.UpdateActivityStatusDto;
import com.tab.dra2.service.ActivityService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Tag(name = "Activities")
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<ApiResponse<ActivityResponse>> create(@Valid @RequestBody CreateActivityDto dto) {
        ActivityResponse data = activityService.create(dto);
        ApiResponse<ActivityResponse> resp = ApiResponse.<ActivityResponse>builder()
                .success(true)
                .message("Created")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<ApiResponse<ActivityResponse>> update(@PathVariable Long id, @Valid @RequestBody CreateActivityDto dto) {
        ActivityResponse data = activityService.update(id, dto);
        ApiResponse<ActivityResponse> resp = ApiResponse.<ActivityResponse>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<ActivityResponse>> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateActivityStatusDto dto) {
        ActivityResponse data = activityService.updateAssignedStatus(id, dto);
        ApiResponse<ActivityResponse> resp = ApiResponse.<ActivityResponse>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.ok(resp);
    }
}
