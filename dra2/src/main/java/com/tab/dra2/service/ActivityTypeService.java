package com.tab.dra2.service;

import com.tab.dra2.dto.ActivityTypeResponseDto;
import com.tab.dra2.dto.ActivityTypeSaveDto;
import com.tab.dra2.entity.ActivityType;
import com.tab.dra2.repository.ActivityTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ActivityTypeService {

    private final ActivityTypeRepository activityTypeRepository;

    @Transactional
    public ActivityTypeResponseDto create(ActivityTypeSaveDto dto) {
        ActivityType activityType = ActivityType.builder()
                .actType(dto.getActType())
                .build();
        return toResponse(activityTypeRepository.save(activityType));
    }

    @Transactional(readOnly = true)
    public List<ActivityTypeResponseDto> list() {
        List<ActivityType> pageData = activityTypeRepository.findAll();

        return pageData.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ActivityTypeResponseDto getById(Long id) {
        return activityTypeRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Activity type not found"));
    }

    @Transactional
    public ActivityTypeResponseDto update(Long id, ActivityTypeSaveDto dto) {
        ActivityType activityType = activityTypeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Activity type not found"));

        if (dto.getActType() != null) {
            activityType.setActType(dto.getActType());
        }

        return toResponse(activityTypeRepository.save(activityType));
    }

    @Transactional
    public void delete(Long id) {
        if (!activityTypeRepository.existsById(id)) {
            throw new NoSuchElementException("Activity type not found");
        }
        activityTypeRepository.deleteById(id);
    }

    private ActivityTypeResponseDto toResponse(ActivityType activityType) {
        return ActivityTypeResponseDto.builder()
                .id(activityType.getId() == null ? Long.valueOf(0) : activityType.getId().intValue())
                .actType(activityType.getActType())
                .build();
    }
}
