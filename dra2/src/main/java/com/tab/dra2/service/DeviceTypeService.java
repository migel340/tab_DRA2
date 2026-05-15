package com.tab.dra2.service;

import com.tab.dra2.dto.DeviceTypeDto;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.dto.ListResponseMeta;
import com.tab.dra2.entity.DeviceType;
import com.tab.dra2.repository.DeviceTypeRepository;
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
public class DeviceTypeService {

    private final DeviceTypeRepository deviceTypeRepository;

    @Transactional
    public DeviceTypeDto create(DeviceTypeDto dto) {
        DeviceType deviceType = new DeviceType();
        deviceType.setDeviceTypeName(dto.getDeviceTypeName());
        return toResponse(deviceTypeRepository.save(deviceType));
    }

    @Transactional(readOnly = true)
    public ListResponse<DeviceTypeDto> list(int page, int limit, String orderBy, String sort) {
        Sort.Direction direction = Sort.Direction.fromString(sort == null ? "ASC" : sort);
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit, Sort.by(direction, orderBy == null ? "id" : orderBy));
        Page<DeviceTypeDto> pageData = deviceTypeRepository.findAll(pageable).map(this::toResponse);
        
        return ListResponse.<DeviceTypeDto>builder()
                .data(pageData.getContent())
                .meta(ListResponseMeta.builder()
                        .page(Math.max(1, page))
                        .limit(limit)
                        .orderBy(orderBy == null ? "id" : orderBy)
                        .sort(direction.name().toLowerCase())
                        .totalItems(pageData.getTotalElements())
                        .totalPages(pageData.getTotalPages())
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public DeviceTypeDto getById(Integer id) {
        return deviceTypeRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Device type not found"));
    }

    @Transactional
    public DeviceTypeDto update(Integer id, DeviceTypeDto dto) {
        DeviceType deviceType = deviceTypeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Device type not found"));

        if (dto.getDeviceTypeName() != null) {
            deviceType.setDeviceTypeName(dto.getDeviceTypeName());
        }

        return toResponse(deviceTypeRepository.save(deviceType));
    }

    private DeviceTypeDto toResponse(DeviceType deviceType) {
        return DeviceTypeDto.builder()
                .id(deviceType.getId() == null ? 0 : deviceType.getId())
                .deviceTypeName(deviceType.getDeviceTypeName())
                .build();
    }
}
