package com.tab.dra2.service;

import com.tab.dra2.dto.ClientListResponse;
import com.tab.dra2.dto.ClientResponse;
import com.tab.dra2.dto.CreateClientDto;
import com.tab.dra2.entity.Address;
import com.tab.dra2.entity.Client;
import com.tab.dra2.entity.Device;
import com.tab.dra2.repository.AddressRepository;
import com.tab.dra2.repository.ClientRepository;
import com.tab.dra2.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ClientService {
    private static final int MIN_PAGE = 1;
    private static final int MIN_LIMIT = 1;
    private static final int MAX_LIMIT = 100;
    private static final String DEFAULT_ORDER_BY = "id";
    private static final Set<String> ORDER_BY_FIELDS = Set.of(
            "id",
            "firstName",
            "secondName",
            "surname",
            "phoneNumber",
            "birthDate"
    );

    private final ClientRepository clientRepository;
    private final DeviceRepository deviceRepository;
    private final AddressRepository addressRepository;

    @Transactional
    public ClientResponse create(CreateClientDto dto) {
        Device device = deviceRepository.findById(dto.getDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Device not found"));
        Address address = addressRepository.findById(dto.getAddressId())
                .orElseThrow(() -> new NoSuchElementException("Address not found"));

        Client client = new Client();
        client.setDevice(device);
        client.setAddress(address);
        client.setSurname(dto.getSurname());
        client.setFirstName(dto.getFirstName());
        client.setSecondName(dto.getSecondName());
        client.setPhoneNumber(dto.getPhoneNumber());
        client.setBirthDate(dto.getBirthDate());

        return toResponse(clientRepository.save(client));
    }

    @Transactional(readOnly = true)
    public ClientListResponse list(int page, int limit, String orderBy, String sort) {
        int resolvedPage = resolvePage(page);
        int resolvedLimit = resolveLimit(limit);
        String resolvedOrderBy = resolveOrderBy(orderBy);
        Sort.Direction direction = resolveSortDirection(sort);
        Pageable pageable = PageRequest.of(resolvedPage - 1, resolvedLimit, Sort.by(direction, resolvedOrderBy));
        Page<ClientResponse> pageData = clientRepository.findAll(pageable).map(this::toResponse);

        return ClientListResponse.builder()
                .data(pageData.getContent())
                .meta(ClientListResponse.Meta.builder()
                        .page(resolvedPage)
                        .limit(resolvedLimit)
                        .orderBy(resolvedOrderBy)
                        .sort(direction.name())
                        .totalItems(pageData.getTotalElements())
                        .totalPages(pageData.getTotalPages())
                        .build())
                .build();
    }

    private int resolvePage(int page) {
        if (page < MIN_PAGE) {
            throw new IllegalArgumentException("Invalid page value. Allowed: page >= 1");
        }
        return page;
    }

    private int resolveLimit(int limit) {
        if (limit < MIN_LIMIT || limit > MAX_LIMIT) {
            throw new IllegalArgumentException("Invalid limit value. Allowed: 1..100");
        }
        return limit;
    }

    private String resolveOrderBy(String orderBy) {
        if (orderBy == null || orderBy.isBlank()) {
            return DEFAULT_ORDER_BY;
        }

        String resolvedOrderBy = orderBy.trim();
        if (!ORDER_BY_FIELDS.contains(resolvedOrderBy)) {
            throw new IllegalArgumentException("Invalid orderBy value. Allowed: " + ORDER_BY_FIELDS);
        }
        return resolvedOrderBy;
    }

    private Sort.Direction resolveSortDirection(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.Direction.ASC;
        }

        try {
            return Sort.Direction.valueOf(sort.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid sort value. Allowed: ASC or DESC");
        }
    }

    @Transactional(readOnly = true)
    public ClientResponse getById(Integer id) {
        return clientRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Client not found"));
    }

    @Transactional
    public ClientResponse update(Integer id, CreateClientDto dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Client not found"));

        if (dto.getDeviceId() != null) {
            Device device = deviceRepository.findById(dto.getDeviceId())
                    .orElseThrow(() -> new NoSuchElementException("Device not found"));
            client.setDevice(device);
        }
        if (dto.getAddressId() != null) {
            Address address = addressRepository.findById(dto.getAddressId())
                    .orElseThrow(() -> new NoSuchElementException("Address not found"));
            client.setAddress(address);
        }
        if (dto.getSurname() != null) client.setSurname(dto.getSurname());
        if (dto.getFirstName() != null) client.setFirstName(dto.getFirstName());
        if (dto.getSecondName() != null) client.setSecondName(dto.getSecondName());
        if (dto.getPhoneNumber() != null) client.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getBirthDate() != null) client.setBirthDate(dto.getBirthDate());

        return toResponse(clientRepository.save(client));
    }

    private ClientResponse toResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId() == null ? 0 : client.getId())
                .deviceId(client.getDevice() != null && client.getDevice().getId() != null ? client.getDevice().getId() : 0)
                .addressId(client.getAddress() != null && client.getAddress().getId() != null ? client.getAddress().getId() : null)
                .surname(client.getSurname())
                .firstName(client.getFirstName())
                .secondName(client.getSecondName())
                .phoneNumber(client.getPhoneNumber())
                .birthDate(client.getBirthDate())
                .build();
    }
}
