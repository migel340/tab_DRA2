package com.tab.dra2.service;

import com.tab.dra2.dto.ActivityResponse;
import com.tab.dra2.dto.ActivityTypeResponseDto;
import com.tab.dra2.dto.CreateActivityDto;
import com.tab.dra2.dto.ListResponse;
import com.tab.dra2.dto.ListResponseMeta;
import com.tab.dra2.dto.PersonelLookupResponse;
import com.tab.dra2.dto.UpdateActivityDto;
import com.tab.dra2.dto.UpdateActivityStatusDto;
import com.tab.dra2.entity.Activity;
import com.tab.dra2.entity.ActivityType;
import com.tab.dra2.entity.Personel;
import com.tab.dra2.entity.Request;
import com.tab.dra2.repository.ActivityRepository;
import com.tab.dra2.repository.ActivityTypeRepository;
import com.tab.dra2.repository.PersonelRepository;
import com.tab.dra2.repository.RequestRepository;
import com.tab.dra2.util.PaginationValidator;
import lombok.RequiredArgsConstructor;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {

        private static final String STATUS_REGISTERED = "REGISTERED";
        private static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
        private static final String STATUS_DONE = "DONE";
        private static final String STATUS_CANCELLED = "CANCELLED";
        private static final List<String> ORDER_BY_FIELDS = List.of(
                        "id",
                        "seqNo",
                        "description",
                        "status",
                        "dateRegistered",
                        "dateFinishedCanceled");

        private final ActivityRepository activityRepository;
        private final RequestRepository requestRepository;
        private final ActivityTypeRepository activityTypeRepository;
        private final PersonelRepository personelRepository;

        public ListResponse<ActivityResponse> list(String q, String status, String executor, String dateFrom,
                        String dateTo, int page, int limit, String orderBy, String sort,
                        Integer requestId) {
                int validatedPage = PaginationValidator.validatePage(page);
                int validatedLimit = PaginationValidator.validateLimit(limit);
                String validatedOrderBy = PaginationValidator.validateOrderBy(orderBy, ORDER_BY_FIELDS);
                Sort.Direction direction = PaginationValidator.validateSort(sort);
                Pageable pageable = PageRequest.of(validatedPage - 1, validatedLimit, Sort.by(direction, validatedOrderBy));

                Page<Activity> activities = activityRepository.findAll(
                                buildListSpecification(q, status, executor, dateFrom, dateTo, requestId),
                                pageable);

                return ListResponse.<ActivityResponse>builder()
                                .data(activities.getContent().stream().map(this::toResponse)
                                                .collect(Collectors.toList()))
                                .meta(ListResponseMeta.builder()
                                                .page(validatedPage)
                                                .limit(validatedLimit)
                                                .totalItems(activities.getTotalElements())
                                                .totalPages(activities.getTotalPages())
                                                .orderBy(validatedOrderBy)
                                                .sort(direction.name().toLowerCase())
                                                .build())
                                .build();
        }

        private Specification<Activity> buildListSpecification(String q, String status, String executor, String dateFrom,
                        String dateTo, Integer requestId) {
                return (root, query, cb) -> {
                        List<Predicate> predicates = new ArrayList<>();

                        if (requestId != null) {
                                predicates.add(cb.equal(root.get("request").get("id"), requestId));
                        }

                        if (q != null && !q.isBlank()) {
                                String searchPattern = "%" + q.trim().toLowerCase() + "%";
                                predicates.add(cb.or(
                                                cb.like(cb.lower(root.get("description")), searchPattern),
                                                cb.like(cb.lower(cb.coalesce(root.get("result"), "")), searchPattern)));
                        }

                        if (status != null && !status.isBlank() && !"all".equalsIgnoreCase(status)) {
                                predicates.add(cb.equal(root.get("status"), status.trim().toUpperCase()));
                        }

                        if (executor != null && !executor.isBlank() && !"all".equalsIgnoreCase(executor)) {
                                try {
                                        Long executorId = Long.valueOf(executor);
                                        predicates.add(cb.equal(root.get("personel").get("id"), executorId));
                                } catch (NumberFormatException e) {
                                }
                        }

                        if (dateFrom != null && !dateFrom.isBlank()) {
                                try {
                                        LocalDateTime from = LocalDate.parse(dateFrom).atStartOfDay();
                                        predicates.add(cb.greaterThanOrEqualTo(root.get("dateRegistered"), from));
                                } catch (RuntimeException e) {
                                }
                        }

                        if (dateTo != null && !dateTo.isBlank()) {
                                try {
                                        LocalDateTime to = LocalDate.parse(dateTo).atTime(LocalTime.MAX);
                                        predicates.add(cb.lessThanOrEqualTo(root.get("dateRegistered"), to));
                                } catch (RuntimeException e) {
                                }
                        }

                        return cb.and(predicates.toArray(new Predicate[0]));
                };
        }

        public ActivityResponse get(Long id) {
                Activity activity = activityRepository.findById(id)
                                .orElseThrow(() -> new NoSuchElementException("Activity not found"));
                return toResponse(activity);
        }

        @Transactional
        public ActivityResponse create(CreateActivityDto dto) {
                Request request = requestRepository.findById(dto.getRequestId())
                                .orElseThrow(() -> new NoSuchElementException("Request not found"));

                // requireCurrentManagerOwnership(request);
                // ensureRequestAcceptsActivities(request);

                ActivityType type = activityTypeRepository.findById(dto.getActTypeId().longValue())
                                .orElseThrow(() -> new NoSuchElementException("Activity type not found"));

                Personel personel = null;
                if (dto.getPersonelId() != null) {
                        personel = personelRepository.findById(dto.getPersonelId().longValue())
                                        .orElseThrow(() -> new NoSuchElementException("Personel not found"));
                        // requireCurrentManagerOwnership(personel);
                }

                validateInitialStatus(dto.getStatus());

                Activity a = Activity.builder()
                                .request(request)
                                .activityType(type)
                                .personel(personel)
                                .seqNo(dto.getSeqNo())
                                .description(dto.getDescription())
                                .result(dto.getResult())
                                .status(STATUS_REGISTERED)
                                .dateRegistered(LocalDateTime.now())
                                .build();

                Activity saved = activityRepository.save(a);
                if (STATUS_REGISTERED.equals(request.getStatus())) {
                        request.setStatus(STATUS_IN_PROGRESS);
                        requestRepository.save(request);
                }
                return toResponse(saved);
        }

        @Transactional
        public ActivityResponse update(Long id, UpdateActivityDto dto) {
                Activity a = activityRepository.findById(id)
                                .orElseThrow(() -> new NoSuchElementException("Activity not found"));

                // requireCurrentManagerOwnership(a.getRequest());
                // ensureEditable(a);

                if (dto.getDescription() != null)
                        a.setDescription(dto.getDescription());
                if (dto.getResult() != null)
                        a.setResult(dto.getResult());
                if (dto.getStatus() != null) {
                        String nextStatus = normalizeActivityStatus(dto.getStatus());
                        // validateTransition(a.getStatus(), nextStatus);
                        a.setStatus(nextStatus);
                        if (isTerminal(nextStatus)) {
                                a.setDateFinishedCanceled(LocalDateTime.now());
                        }
                }
                if (dto.getSeqNo() != null)
                        a.setSeqNo(dto.getSeqNo());

                if (dto.getPersonelId() != null) {
                        Personel p = personelRepository.findById(dto.getPersonelId().longValue())
                                        .orElseThrow(() -> new NoSuchElementException("Personel not found"));
                        // requireCurrentManagerOwnership(p);
                        a.setPersonel(p);
                }

                Activity saved = activityRepository.save(a);
                if (isTerminal(saved.getStatus()) && !activityRepository.existsByRequest_IdAndStatusNotIn(
                                a.getRequest().getId(),
                                Set.of(STATUS_DONE, STATUS_CANCELLED))) {
                        Request request = a.getRequest();
                        request.setStatus("FINISHED");
                        request.setDateFinishedCancelled(java.sql.Date.valueOf(java.time.LocalDate.now()));
                        requestRepository.save(request);
                }
                return toResponse(saved);
        }

        @Transactional
        public ActivityResponse updateAssignedStatus(Long id, UpdateActivityStatusDto dto) {
                Activity activity = activityRepository.findById(id)
                                .orElseThrow(() -> new NoSuchElementException("Activity not found"));

                Personel current = currentPersonel();
                if (activity.getPersonel() == null || activity.getPersonel().getId() == null
                                || !activity.getPersonel().getId().equals(current.getId())) {
                        throw new AccessDeniedException("You can change status only for activities assigned to you");
                }

                // ensureEditable(activity);

                String nextStatus = normalizeActivityStatus(dto.getStatus());
                // validateTransition(activity.getStatus(), nextStatus);
                activity.setStatus(nextStatus);
                if (isTerminal(nextStatus)) {
                        activity.setDateFinishedCanceled(LocalDateTime.now());
                }

                activity.setResult(dto.getResult());

                Activity saved = activityRepository.save(activity);

                if (STATUS_REGISTERED.equals(saved.getRequest().getStatus()) && STATUS_IN_PROGRESS.equals(nextStatus)) {
                        Request request = saved.getRequest();
                        request.setStatus(STATUS_IN_PROGRESS);
                        requestRepository.save(request);
                }

                if (isTerminal(saved.getStatus()) && !activityRepository.existsByRequest_IdAndStatusNotIn(
                                saved.getRequest().getId(),
                                Set.of(STATUS_DONE, STATUS_CANCELLED))) {
                        Request request = saved.getRequest();
                        request.setStatus(STATUS_DONE.equals(saved.getStatus()) ? "FINISHED" : "CANCELLED");
                        request.setDateFinishedCancelled(java.sql.Date.valueOf(java.time.LocalDate.now()));
                        requestRepository.save(request);
                }

                return toResponse(saved);
        }

        private ActivityResponse toResponse(Activity a) {
                return ActivityResponse.builder()
                                .id(a.getId().intValue())
                                .requestId(a.getRequest() != null && a.getRequest().getId() != null
                                                ? a.getRequest().getId()
                                                : 0)
                                .type(ActivityTypeResponseDto.builder()
                                                .actType(a.getActivityType().getActType())
                                                .id(a.getActivityType().getId()).build())
                                .executor(a.getPersonel() != null ? new PersonelLookupResponse(a.getPersonel().getId(),
                                                a.getPersonel().getFirstName() + " " + a.getPersonel().getSurname())
                                                : null)
                                .seqNo(a.getSeqNo())
                                .description(a.getDescription())
                                .result(a.getResult())
                                .status(a.getStatus())
                                .dateRegistration(a.getDateRegistered())
                                .dateFinishedCancelled(a.getDateFinishedCanceled())
                                .build();
        }

        private void requireCurrentManagerOwnership(Request request) {
                if (request == null || request.getManager() == null || request.getManager().getId() == null) {
                        throw new AccessDeniedException("Request manager is required");
                }
                requireCurrentManagerOwnership(request.getManager());
        }

        private void requireCurrentManagerOwnership(Personel owner) {
                Personel current = currentPersonel();
                if (owner == null || owner.getId() == null || !current.getId().equals(owner.getId())) {
                        throw new AccessDeniedException("Managers can manage only their own requests and activities");
                }
        }

        private Personel currentPersonel() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || authentication.getName() == null) {
                        throw new AccessDeniedException("Authentication required");
                }

                return personelRepository.findByUsername(authentication.getName())
                                .orElseThrow(() -> new AccessDeniedException("Current user not found"));
        }

        private void ensureRequestAcceptsActivities(Request request) {
                String status = request.getStatus() == null ? null : request.getStatus().trim().toUpperCase();
                if ("FINISHED".equals(status) || "CANCELLED".equals(status)) {
                        throw new IllegalStateException("Activities cannot be added to closed requests");
                }
        }

        private void validateInitialStatus(String status) {
                String normalized = normalizeActivityStatus(status);
                if (!STATUS_REGISTERED.equals(normalized)) {
                        throw new IllegalArgumentException("Activity status on create must be REGISTERED");
                }
        }

        private String normalizeActivityStatus(String status) {
                if (status == null) {
                        throw new IllegalArgumentException("Status is required");
                }

                String normalized = status.trim().toUpperCase();
                if (!Set.of(STATUS_REGISTERED, STATUS_IN_PROGRESS, STATUS_DONE, STATUS_CANCELLED)
                                .contains(normalized)) {
                        throw new IllegalArgumentException("Invalid activity status: " + status);
                }
                return normalized;
        }

        private void ensureEditable(Activity activity) {
                String currentStatus = activity.getStatus() == null ? null : activity.getStatus().trim().toUpperCase();
                if (STATUS_DONE.equals(currentStatus) || STATUS_CANCELLED.equals(currentStatus)) {
                        throw new IllegalStateException("Closed activities cannot be updated");
                }
        }

        private void validateTransition(String currentStatus, String nextStatus) {
                String current = currentStatus == null ? STATUS_REGISTERED : currentStatus.trim().toUpperCase();

                boolean allowed = switch (current) {
                        case STATUS_REGISTERED ->
                                STATUS_IN_PROGRESS.equals(nextStatus) || STATUS_CANCELLED.equals(nextStatus);
                        case STATUS_IN_PROGRESS ->
                                STATUS_DONE.equals(nextStatus) || STATUS_CANCELLED.equals(nextStatus);
                        default -> false;
                };

                if (!allowed) {
                        throw new IllegalStateException(
                                        "Invalid activity status transition: %s -> %s".formatted(current, nextStatus));
                }
        }

        private boolean isTerminal(String status) {
                return STATUS_DONE.equals(status) || STATUS_CANCELLED.equals(status);
        }

}
