package com.tab.dra2.web;

import com.tab.dra2.dto.ActivityResponse;
import com.tab.dra2.dto.ApiResponse;
import com.tab.dra2.dto.CreateActivityDto;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.dto.UpdateActivityDto;
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

        @GetMapping
        @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
        public ResponseEntity<ApiResponse<ListResponse<ActivityResponse>>> list(
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) String status,
                        @RequestParam(required = false) String executor,
                        @RequestParam(required = false) String dateFrom,
                        @RequestParam(required = false) String dateTo,
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "10") int limit,
                        @RequestParam(defaultValue = "seqNo") String orderBy,
                        @RequestParam(defaultValue = "ASC") String sort,
                        @RequestParam(required = false) Integer requestId) {
                ListResponse<ActivityResponse> data = activityService.list(q, status, executor, dateFrom, dateTo, page,
                                limit, orderBy, sort, requestId);
                return ResponseEntity.ok(ApiResponse.<ListResponse<ActivityResponse>>builder()
                                .success(true)
                                .message("OK")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build());
        }

        @GetMapping("/{id}")
        @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
        public ResponseEntity<ApiResponse<ActivityResponse>> get(@PathVariable Long id) {
                ActivityResponse data = activityService.get(id);
                ApiResponse<ActivityResponse> resp = ApiResponse.<ActivityResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.ok(resp);
        }

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
        public ResponseEntity<ApiResponse<ActivityResponse>> update(@PathVariable Long id,
                        @Valid @RequestBody UpdateActivityDto dto) {
                ActivityResponse data = activityService.update(id, dto);
                ApiResponse<ActivityResponse> resp = ApiResponse.<ActivityResponse>builder()
                                .success(true)
                                .message("OK")
                                .data(data)
                                .timestamp(java.time.LocalDateTime.now())
                                .build();
                return ResponseEntity.ok(resp);
        }

        @PatchMapping("/{id}")
        @PreAuthorize("hasRole('STAFF')")
        public ResponseEntity<ApiResponse<ActivityResponse>> updateStatus(@PathVariable Long id,
                        @Valid @RequestBody UpdateActivityStatusDto dto) {
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
