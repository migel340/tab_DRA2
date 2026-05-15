package com.tab.dra2.service;

import com.tab.dra2.dto.ActivityTypeDto;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.dto.ListResponseMeta;
import com.tab.dra2.entity.ActivityType;
import com.tab.dra2.enums.ActivityName;
import com.tab.dra2.repository.ActivityTypeRepository;
import com.tab.dra2.util.PaginationValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ActivityTypeService {
    
    private static final List<String> ORDER_BY_FIELDS = List.of("id", "actType");

    private final ActivityTypeRepository activityTypeRepository;

    @Transactional
    public ActivityTypeDto create(ActivityTypeDto dto) {
        ActivityType activityType = ActivityType.builder()
                .actType(parseActivityName(dto.getActType()))
                .build();
        return toResponse(activityTypeRepository.save(activityType));
    }

    @Transactional(readOnly = true)
    public ListResponse<ActivityTypeDto> list(int page, int limit, String orderBy, String sort) {
        int validatedPage = PaginationValidator.validatePage(page);
        int validatedLimit = PaginationValidator.validateLimit(limit);
        String validatedOrderBy = PaginationValidator.validateOrderBy(orderBy, ORDER_BY_FIELDS);
        Sort.Direction direction = PaginationValidator.validateSort(sort);
        
        Pageable pageable = PageRequest.of(validatedPage - 1, validatedLimit, Sort.by(direction, validatedOrderBy));
        Page<ActivityTypeDto> pageData = activityTypeRepository.findAll(pageable).map(this::toResponse);
        
        return ListResponse.<ActivityTypeDto>builder()
                .data(pageData.getContent())
                .meta(ListResponseMeta.builder()
                        .page(validatedPage)
                        .limit(validatedLimit)
                        .orderBy(validatedOrderBy)
                        .sort(direction.name().toLowerCase())
                        .totalItems(pageData.getTotalElements())
                        .totalPages(pageData.getTotalPages())
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public ActivityTypeDto getById(Long id) {
        return activityTypeRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Activity type not found"));
    }

    @Transactional
    public ActivityTypeDto update(Long id, ActivityTypeDto dto) {
        ActivityType activityType = activityTypeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Activity type not found"));

        if (dto.getActType() != null) {
            activityType.setActType(parseActivityName(dto.getActType()));
        }

        return toResponse(activityTypeRepository.save(activityType));
    }

    private ActivityName parseActivityName(String value) {
        try {
            return ActivityName.valueOf(value);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid activity type: " + value);
        }
    }

    private ActivityTypeDto toResponse(ActivityType activityType) {
        return ActivityTypeDto.builder()
                .id(activityType.getId() == null ? 0 : activityType.getId().intValue())
                .actType(activityType.getActType() != null ? activityType.getActType().name() : null)
                .build();
    }
}
