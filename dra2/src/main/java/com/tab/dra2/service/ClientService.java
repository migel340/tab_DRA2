package com.tab.dra2.service;

import com.tab.dra2.dto.ClientResponse;
import com.tab.dra2.dto.ClientListResponse;
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

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ClientService {

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
        Sort.Direction direction = Sort.Direction.fromString(sort == null ? "ASC" : sort);
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit, Sort.by(direction, orderBy == null ? "id" : orderBy));
        Page<ClientResponse> pageData = clientRepository.findAll(pageable).map(this::toResponse);
        
        return ClientListResponse.builder()
                .data(pageData.getContent())
                .meta(ClientListResponse.Meta.builder()
                        .page(page)
                        .limit(limit)
                        .orderBy(orderBy == null ? "id" : orderBy)
                        .sort(sort == null ? "asc" : sort.toLowerCase())
                        .totalItems(pageData.getTotalElements())
                        .totalPages(pageData.getTotalPages())
                        .q(null)
                        .build())
                .build();
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
