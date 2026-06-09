package com.tab.dra2.service;

import com.tab.dra2.dto.CreatePersonelRequest;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.dto.PersonelResponse;
import com.tab.dra2.dto.UpdatePersonelRequest;
import com.tab.dra2.dto.ListResponseMeta;
import com.tab.dra2.dto.PersonelLookupResponse;
import com.tab.dra2.entity.Personel;
import com.tab.dra2.enums.Role;
import com.tab.dra2.repository.PersonelRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PersonelService {

    private static final Map<String, String> ORDER_BY_FIELDS = Map.of(
            "id", "id",
            "firstName", "firstName",
            "surname", "surname",
            "username", "username",
            "role", "role",
            "active", "active");

    private final PersonelRepository personelRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public ListResponse<PersonelResponse> getList(String q, String orderBy, String sort, int page, int limit,
            Boolean active) {
        String normalizedOrderBy = resolveOrderBy(orderBy);
        Sort.Direction direction = resolveSortDirection(sort);

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, normalizedOrderBy));
        Page<Personel> result = personelRepository.findAll(buildListSpecification(q, active), pageable);

        return ListResponse.<PersonelResponse>builder()
                .data(result.getContent().stream().map(this::toResponse).toList())
                .meta(ListResponseMeta.builder()
                        .page(page)
                        .limit(limit)
                        .totalItems(result.getTotalElements())
                        .totalPages(result.getTotalPages())
                        .orderBy(normalizedOrderBy)
                        .sort(direction.name().toLowerCase())
                        .q(q)
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public PersonelResponse getById(Long id) {
        Personel personel = personelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Personnel with id %d not found".formatted(id)));
        return toResponse(personel);
    }

    @Transactional
    public PersonelResponse create(CreatePersonelRequest request) {
        if (personelRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        Personel personel = Personel.builder()
                .firstName(request.getFirstName().trim())
                .surname(request.getSurname().trim())
                .username(request.getUsername().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(Boolean.TRUE.equals(request.getActive()))
                .build();

        return toResponse(personelRepository.save(personel));
    }

    @Transactional
    public PersonelResponse update(Long id, UpdatePersonelRequest request) {
        Personel personel = personelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Personnel with id %d not found".formatted(id)));

        String normalizedUsername = request.getUsername().trim();
        if (!personel.getUsername().equals(normalizedUsername)
                && personelRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException("Username already exists");
        }

        personel.setFirstName(request.getFirstName().trim());
        personel.setSurname(request.getSurname().trim());
        personel.setUsername(normalizedUsername);
        personel.setRole(request.getRole());
        personel.setActive(Boolean.TRUE.equals(request.getActive()));

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            personel.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return toResponse(personelRepository.save(personel));
    }

    private Specification<Personel> buildListSpecification(String q, Boolean active) {
        Specification<Personel> specification = (root, query, cb) -> cb.notEqual(root.get("role"), Role.ADMIN);

        if (active != null) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("active"), active));
        }

        if (q == null || q.isBlank()) {
            return specification;
        }

        String pattern = "%%%s%%".formatted(q.toLowerCase(Locale.ROOT).trim());
        Specification<Personel> searchSpecification = (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("firstName")), pattern),
                cb.like(cb.lower(root.get("surname")), pattern),
                cb.like(cb.lower(root.get("username")), pattern));

        return specification.and(searchSpecification);
    }

    private String resolveOrderBy(String orderBy) {
        if (orderBy == null || orderBy.isBlank()) {
            return "id";
        }

        String resolved = ORDER_BY_FIELDS.get(orderBy.trim());
        if (resolved == null) {
            throw new IllegalArgumentException("Invalid orderBy value. Allowed: " + ORDER_BY_FIELDS.keySet());
        }
        return resolved;
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

    private PersonelResponse toResponse(Personel personel) {
        return PersonelResponse.builder()
                .id(personel.getId())
                .firstName(personel.getFirstName())
                .surname(personel.getSurname())
                .username(personel.getUsername())
                .role(personel.getRole())
                .active(personel.isActive())
                .build();
    }

    public List<PersonelLookupResponse> lookup() {

        return personelRepository.getActiveNonAdminPersonelLookup();

    }

}
