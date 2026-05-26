package com.tab.dra2.service;

import com.tab.dra2.dto.DeviceTypeResponseDto;
import com.tab.dra2.dto.DeviceTypeSaveDto;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.dto.ListResponseMeta;
import com.tab.dra2.entity.DeviceType;
import com.tab.dra2.repository.DeviceTypeRepository;
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
public class DeviceTypeService {

    private static final List<String> ORDER_BY_FIELDS = List.of("id", "deviceTypeName");

    private final DeviceTypeRepository deviceTypeRepository;

    @Transactional
    public DeviceTypeResponseDto create(DeviceTypeSaveDto dto) {
        DeviceType deviceType = new DeviceType();
        deviceType.setDeviceTypeName(dto.getDeviceTypeName());
        return toResponse(deviceTypeRepository.save(deviceType));
    }

    @Transactional(readOnly = true)
    public ListResponse<DeviceTypeResponseDto> list(int page, int limit, String orderBy, String sort) {
        int validatedPage = PaginationValidator.validatePage(page);
        int validatedLimit = PaginationValidator.validateLimit(limit);
        String validatedOrderBy = PaginationValidator.validateOrderBy(orderBy, ORDER_BY_FIELDS);
        Sort.Direction direction = PaginationValidator.validateSort(sort);

        Pageable pageable = PageRequest.of(validatedPage - 1, validatedLimit, Sort.by(direction, validatedOrderBy));
        Page<DeviceTypeResponseDto> pageData = deviceTypeRepository.findAll(pageable).map(this::toResponse);

        return ListResponse.<DeviceTypeResponseDto>builder()
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
    public DeviceTypeResponseDto getById(Integer id) {
        return deviceTypeRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Device type not found"));
    }

    @Transactional
    public DeviceTypeResponseDto update(Integer id, DeviceTypeSaveDto dto) {
        DeviceType deviceType = deviceTypeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Device type not found"));

        if (dto.getDeviceTypeName() != null) {
            deviceType.setDeviceTypeName(dto.getDeviceTypeName());
        }

        return toResponse(deviceTypeRepository.save(deviceType));
    }

    private DeviceTypeResponseDto toResponse(DeviceType deviceType) {
        return DeviceTypeResponseDto.builder()
                .id(deviceType.getId() == null ? 0 : deviceType.getId())
                .deviceTypeName(deviceType.getDeviceTypeName())
                .build();
    }
}
