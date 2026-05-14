package com.tab.dra2.service;

import com.tab.dra2.dto.ActivityTypeDto;
import com.tab.dra2.entity.ActivityType;
import com.tab.dra2.enums.ActivityName;
import com.tab.dra2.repository.ActivityTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ActivityTypeService {

    private final ActivityTypeRepository activityTypeRepository;

    @Transactional
    public ActivityTypeDto create(ActivityTypeDto dto) {
        ActivityType activityType = ActivityType.builder()
                .actType(parseActivityName(dto.getActType()))
                .build();
        return toResponse(activityTypeRepository.save(activityType));
    }

    @Transactional(readOnly = true)
    public Page<ActivityTypeDto> list(int page, int limit, String orderBy, String sort) {
        Sort.Direction direction = Sort.Direction.fromString(sort == null ? "ASC" : sort);
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit, Sort.by(direction, orderBy == null ? "id" : orderBy));
        return activityTypeRepository.findAll(pageable).map(this::toResponse);
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
