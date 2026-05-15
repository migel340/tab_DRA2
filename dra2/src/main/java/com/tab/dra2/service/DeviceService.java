package com.tab.dra2.service;

import com.tab.dra2.dto.CreateDeviceDto;
import com.tab.dra2.dto.DeviceResponse;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.dto.ListResponseMeta;
import com.tab.dra2.entity.Device;
import com.tab.dra2.entity.DeviceType;
import com.tab.dra2.repository.DeviceRepository;
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
public class DeviceService {
    
    private static final List<String> ORDER_BY_FIELDS = List.of("id", "deviceName", "deviceTypeId");

    private final DeviceRepository deviceRepository;
    private final DeviceTypeRepository deviceTypeRepository;

    @Transactional
    public DeviceResponse create(CreateDeviceDto dto) {
        DeviceType type = deviceTypeRepository.findById(dto.getDeviceTypeId())
                .orElseThrow(() -> new NoSuchElementException("Device type not found"));

        Device d = new Device();
        d.setDeviceType(type);
        d.setDeviceName(dto.getDeviceName());

        Device saved = deviceRepository.save(d);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public ListResponse<DeviceResponse> list(int page, int limit, String orderBy, String sort) {
        int validatedPage = PaginationValidator.validatePage(page);
        int validatedLimit = PaginationValidator.validateLimit(limit);
        String validatedOrderBy = PaginationValidator.validateOrderBy(orderBy, ORDER_BY_FIELDS);
        Sort.Direction direction = PaginationValidator.validateSort(sort);
        
        Pageable pageable = PageRequest.of(validatedPage - 1, validatedLimit, Sort.by(direction, validatedOrderBy));
        Page<DeviceResponse> pageData = deviceRepository.findAll(pageable).map(this::toResponse);
        
        return ListResponse.<DeviceResponse>builder()
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
    public DeviceResponse getById(Integer id) {
        Device d = deviceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Device not found"));
        return toResponse(d);
    }

    @Transactional
    public DeviceResponse update(Integer id, CreateDeviceDto dto) {
        Device d = deviceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Device not found"));

        if (dto.getDeviceTypeId() != null) {
            DeviceType type = deviceTypeRepository.findById(dto.getDeviceTypeId())
                    .orElseThrow(() -> new NoSuchElementException("Device type not found"));
            d.setDeviceType(type);
        }
        if (dto.getDeviceName() != null) d.setDeviceName(dto.getDeviceName());

        Device saved = deviceRepository.save(d);
        return toResponse(saved);
    }

    private DeviceResponse toResponse(Device d) {
        return DeviceResponse.builder()
                .id(d.getId() != null ? d.getId() : 0)
                .deviceTypeId(d.getDeviceType() != null && d.getDeviceType().getId() != null ? d.getDeviceType().getId() : 0)
                .deviceName(d.getDeviceName())
                .build();
    }
}
