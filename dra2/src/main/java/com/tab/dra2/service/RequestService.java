package com.tab.dra2.service;

import com.tab.dra2.dto.CreateRequestDto;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.dto.ListResponseMeta;
import com.tab.dra2.dto.PersonelResponse;
import com.tab.dra2.dto.RequestResponse;
import com.tab.dra2.entity.Device;
import com.tab.dra2.entity.Personel;
import com.tab.dra2.entity.Request;
import com.tab.dra2.repository.DeviceRepository;
import com.tab.dra2.repository.PersonelRepository;
import com.tab.dra2.repository.RequestRepository;
import com.tab.dra2.util.PaginationValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;
import java.util.Objects;
import java.util.NoSuchElementException;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RequestService {

    private static final String STATUS_REGISTERED = "REGISTERED";
    private static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    private static final String STATUS_FINISHED = "FINISHED";
    private static final String STATUS_CANCELLED = "CANCELLED";
    private static final List<String> ORDER_BY_FIELDS = List.of("id", "status", "dateRegistered", "description");

    private final RequestRepository requestRepository;
    private final DeviceRepository deviceRepository;
    private final PersonelRepository personelRepository;

    @Transactional
    public RequestResponse create(CreateRequestDto dto) {
        Device device = deviceRepository.findById(dto.getDeviceId())
                .orElseThrow(() -> new NoSuchElementException("Device not found"));

        Personel manager = personelRepository.findById(dto.getManagerId().longValue())
                .orElseThrow(() -> new NoSuchElementException("Manager not found"));

        requireCurrentManagerOwnership(manager.getId());
        validateInitialStatus(dto.getStatus());

        Request r = Request.builder()
                .device(device)
                .manager(manager)
                .description(dto.getDescription().trim())
                .status(STATUS_REGISTERED)
                .dateRegistered(new Date(System.currentTimeMillis()))
                .build();

        Request saved = requestRepository.save(r);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public ListResponse<RequestResponse> list(String status, String manager, String dateFrom, String dateTo, int page,
            int limit, String orderBy, String sort) {
        int validatedPage = PaginationValidator.validatePage(page);
        int validatedLimit = PaginationValidator.validateLimit(limit);
        String validatedOrderBy = PaginationValidator.validateOrderBy(orderBy, ORDER_BY_FIELDS);
        Sort.Direction direction = PaginationValidator.validateSort(sort);

        Pageable pageable = PageRequest.of(validatedPage - 1, validatedLimit, Sort.by(direction, validatedOrderBy));
<<<<<<< HEAD
        Page<RequestResponse> pageData = requestRepository.findAll(pageable).map(this::toResponse);
=======
        Page<RequestResponse> pageData = requestRepository
<<<<<<< HEAD
                .findAll(buildListSpecification(status, manager, dateRange), pageable).map(this::toResponse);
>>>>>>> 2476a20 (filtering requests)
=======
                .findAll(buildListSpecification(status, manager, dateFrom, dateTo), pageable).map(this::toResponse);
>>>>>>> 43133fb (changed to datepicker instead of select)

        return ListResponse.<RequestResponse>builder()
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
    public RequestResponse getById(Integer id) {
        Request r = requestRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Request not found"));
        return toResponse(r);
    }

    private Specification<Request> buildListSpecification(String status, String manager, String dateFrom,
            String dateTo) {
        return (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();

            if (status != null && !status.isBlank() && !status.equals("all")) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (manager != null && !manager.isBlank() && !manager.equals("all")) {
                try {
                    Integer managerId = Integer.valueOf(manager);
                    predicates.add(cb.equal(root.get("manager").get("id"), managerId));
                } catch (NumberFormatException e) {
                }
            }

            if (dateFrom != null && !dateFrom.isBlank()) {
                try {
                    java.sql.Date sqlFrom = java.sql.Date.valueOf(dateFrom);
                    predicates.add(cb.greaterThanOrEqualTo(root.get("dateRegistered"), sqlFrom));
                } catch (IllegalArgumentException e) {
                }
            }

            if (dateTo != null && !dateTo.isBlank()) {
                try {
                    java.sql.Date sqlTo = java.sql.Date.valueOf(dateTo);
                    predicates.add(cb.lessThanOrEqualTo(root.get("dateRegistered"), sqlTo));
                } catch (IllegalArgumentException e) {
                }
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    @Transactional
    public RequestResponse update(Integer id, CreateRequestDto dto) {
        Request r = requestRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Request not found"));

        ensureEditable(r);
        requireCurrentManagerOwnership(r.getManager() != null ? r.getManager().getId() : null);

        if (dto.getDeviceId() != null) {
            Device device = deviceRepository.findById(dto.getDeviceId())
                    .orElseThrow(() -> new NoSuchElementException("Device not found"));
            r.setDevice(device);
        }

        if (dto.getManagerId() != null) {
            Personel manager = personelRepository.findById(dto.getManagerId().longValue())
                    .orElseThrow(() -> new NoSuchElementException("Manager not found"));
            requireCurrentManagerOwnership(manager.getId());
            r.setManager(manager);
        }

        if (dto.getDescription() != null)
            r.setDescription(dto.getDescription().trim());
        if (dto.getStatus() != null) {
            String nextStatus = normalizeRequestStatus(dto.getStatus());
            validateTransition(r.getStatus(), nextStatus);
            r.setStatus(nextStatus);
            if (isTerminal(nextStatus)) {
                r.setDateFinishedCancelled(new Date(System.currentTimeMillis()));
            }
        }

        Request saved = requestRepository.save(r);
        return toResponse(saved);
    }

    private RequestResponse toResponse(Request r) {
        return RequestResponse.builder()
                .id(r.getId())
                .deviceId(r.getDevice() != null && r.getDevice().getId() != null ? r.getDevice().getId() : 0)
<<<<<<< HEAD
                .manager(PersonelResponse.toResponse(r.getManager()))
=======
                .managerId(r.getManager() != null && r.getManager().getId() != null ? r.getManager().getId().intValue()
                        : 0)
>>>>>>> 2476a20 (filtering requests)
                .description(r.getDescription())
                .status(r.getStatus())
                .dateRegistration(r.getDateRegistered())
                .dateFinishedCancelled(r.getDateFinishedCancelled())
                .build();
    }

    private void requireCurrentManagerOwnership(Long managerId) {
        if (managerId == null) {
            throw new AccessDeniedException("Manager ownership required");
        }

        Personel currentPersonel = currentPersonel();
        if (!Objects.equals(currentPersonel.getId(), managerId)) {
            throw new AccessDeniedException("Managers can manage only their own requests");
        }
    }

    private Personel currentPersonel() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new AccessDeniedException("Authentication required");
        }

        return personelRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Current user not found"));
    }

    private void validateInitialStatus(String status) {
        String normalized = normalizeRequestStatus(status);
        if (!STATUS_REGISTERED.equals(normalized)) {
            throw new IllegalArgumentException("Request status on create must be REGISTERED");
        }
    }

    private String normalizeRequestStatus(String status) {
        if (status == null) {
            throw new IllegalArgumentException("Status is required");
        }

        String normalized = status.trim().toUpperCase();
        if (!Set.of(STATUS_REGISTERED, STATUS_IN_PROGRESS, STATUS_FINISHED, STATUS_CANCELLED).contains(normalized)) {
            throw new IllegalArgumentException("Invalid request status: " + status);
        }
        return normalized;
    }

    private void ensureEditable(Request request) {
        String currentStatus = request.getStatus() == null ? null : request.getStatus().trim().toUpperCase();
        if (STATUS_FINISHED.equals(currentStatus) || STATUS_CANCELLED.equals(currentStatus)) {
            throw new IllegalStateException("Closed requests cannot be updated");
        }
    }

    private void validateTransition(String currentStatus, String nextStatus) {
        String current = currentStatus == null ? STATUS_REGISTERED : currentStatus.trim().toUpperCase();

        if (!Set.of(STATUS_REGISTERED, STATUS_IN_PROGRESS, STATUS_FINISHED, STATUS_CANCELLED).contains(current)) {
            throw new IllegalArgumentException("Invalid current request status: " + currentStatus);
        }

        if (current.equals(nextStatus)) {
            return;
        }

        boolean allowed = switch (current) {
            case STATUS_REGISTERED -> STATUS_IN_PROGRESS.equals(nextStatus) || STATUS_CANCELLED.equals(nextStatus);
            case STATUS_IN_PROGRESS -> STATUS_FINISHED.equals(nextStatus) || STATUS_CANCELLED.equals(nextStatus);
            default -> false;
        };

        if (!allowed) {
            throw new IllegalStateException(
                    "Invalid request status transition: %s -> %s".formatted(current, nextStatus));
        }
    }

    private boolean isTerminal(String status) {
        return STATUS_FINISHED.equals(status) || STATUS_CANCELLED.equals(status);
    }

}
