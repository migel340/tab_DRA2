package com.tab.dra2.service;

import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.dto.ClientAddressDto;
import com.tab.dra2.dto.ClientListResponse;
import com.tab.dra2.dto.ClientResponse;
import com.tab.dra2.dto.CreateClientDto;
import com.tab.dra2.dto.ListResponseMeta;
import com.tab.dra2.entity.Address;
import com.tab.dra2.entity.Client;
import com.tab.dra2.repository.AddressRepository;
import com.tab.dra2.repository.ClientRepository;
import com.tab.dra2.util.PaginationValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ClientService {
    private static final List<String> ORDER_BY_FIELDS = List.of(
            "id",
            "firstName",
            "secondName",
            "surname",
            "phoneNumber",
            "birthDate");

    private final ClientRepository clientRepository;
    private final AddressRepository addressRepository;

    @Transactional
    public ClientResponse create(CreateClientDto dto) {
        Address address = resolveAddress(dto, true);

        Client client = new Client();
        client.setAddress(address);
        client.setSurname(dto.getSurname());
        client.setFirstName(dto.getFirstName());
        client.setSecondName(dto.getSecondName());
        client.setPhoneNumber(dto.getPhoneNumber());
        client.setBirthDate(dto.getBirthDate());

        Client savedClient = clientRepository.save(client);

        return toResponse(savedClient);
    }

    @Transactional(readOnly = true)
    public ListResponse<ClientListResponse> list(String q, int page, int limit, String orderBy, String sort) {
        int validatedPage = PaginationValidator.validatePage(page);
        int validatedLimit = PaginationValidator.validateLimit(limit);
        String validatedOrderBy = PaginationValidator.validateOrderBy(orderBy, ORDER_BY_FIELDS);
        Sort.Direction direction = PaginationValidator.validateSort(sort);

        Pageable pageable = PageRequest.of(validatedPage - 1, validatedLimit, Sort.by(direction, validatedOrderBy));
        Page<ClientListResponse> pageData = clientRepository.findAll(buildListSpecification(q), pageable)
                .map(this::toListResponse);

        return ListResponse.<ClientListResponse>builder()
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
    public ClientResponse getById(Integer id) {
        return clientRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Client not found"));
    }

    @Transactional
    public ClientResponse update(Integer id, CreateClientDto dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Client not found"));

        if (dto.getAddress() != null || dto.getAddressId() != null) {
            Address address = resolveAddress(dto, false);
            client.setAddress(address);
        }
        if (dto.getSurname() != null)
            client.setSurname(dto.getSurname());
        if (dto.getFirstName() != null)
            client.setFirstName(dto.getFirstName());
        if (dto.getSecondName() != null)
            client.setSecondName(dto.getSecondName());
        if (dto.getPhoneNumber() != null)
            client.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getBirthDate() != null)
            client.setBirthDate(dto.getBirthDate());

        return toResponse(clientRepository.save(client));
    }

    private Specification<Client> buildListSpecification(String q) {
        if (q == null || q.isBlank()) {
            return Specification.unrestricted();
        }

        String pattern = "%%%s%%".formatted(q.toLowerCase(Locale.ROOT).trim());
        Specification<Client> searchSpecification = (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("firstName")), pattern),
                cb.like(cb.lower(root.get("surname")), pattern),
                cb.like(cb.lower(root.get("secondName")), pattern));

        return searchSpecification;
    }

    private ClientResponse toResponse(Client client) {
        Address address = client.getAddress();
        ClientAddressDto addressDto = address == null ? null
                : ClientAddressDto.builder()
                        .city(address.getCity())
                        .state(address.getState())
                        .postalCode(address.getPostal_code())
                        .country(address.getCountry())
                        .build();

        return ClientResponse.builder()
                .id(client.getId() == null ? 0 : client.getId())
                .device_count(client.getDevices() == null ? 0 : client.getDevices().size())
                .surname(client.getSurname())
                .firstName(client.getFirstName())
                .secondName(client.getSecondName())
                .phoneNumber(client.getPhoneNumber())
                .address(addressDto)
                .birthDate(client.getBirthDate())
                .build();
    }

    private ClientListResponse toListResponse(Client client) {
        return ClientListResponse.builder()
                .id(client.getId() == null ? 0 : client.getId())
                .firstName(client.getFirstName())
                .surname(client.getSurname())
                .device_count(client.getDevices() == null ? 0 : client.getDevices().size())
                .phoneNumber(client.getPhoneNumber())
                .birthDate(client.getBirthDate())
                .build();
    }

    private Address resolveAddress(CreateClientDto dto, boolean required) {
        if (dto.getAddress() != null) {
            String city = normalize(dto.getAddress().getCity());
            String state = normalize(dto.getAddress().getState());
            String postalCode = normalize(dto.getAddress().getPostalCode());
            String country = normalize(dto.getAddress().getCountry());

            return addressRepository.findExisting(city, state, postalCode, country)
                    .orElseGet(() -> {
                        Address address = new Address();
                        address.setCity(city);
                        address.setState(state);
                        address.setPostal_code(postalCode);
                        address.setCountry(country);
                        return addressRepository.save(address);
                    });
        }

        if (dto.getAddressId() != null) {
            return addressRepository.findById(dto.getAddressId())
                    .orElseThrow(() -> new NoSuchElementException("Address not found"));
        }

        if (required) {
            throw new IllegalArgumentException("Address is required");
        }

        return null;
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }
}
