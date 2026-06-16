package com.tab.dra2.service;

import com.tab.dra2.dto.ActivityResponse;
import com.tab.dra2.dto.UpdateActivityStatusDto;
import com.tab.dra2.entity.Activity;
import com.tab.dra2.entity.ActivityType;
import com.tab.dra2.entity.Personel;
import com.tab.dra2.entity.Request;
import com.tab.dra2.enums.Role;
import com.tab.dra2.repository.ActivityRepository;
import com.tab.dra2.repository.ActivityTypeRepository;
import com.tab.dra2.repository.PersonelRepository;
import com.tab.dra2.repository.RequestRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

        @Mock
        private ActivityRepository activityRepository;

        @Mock
        private RequestRepository requestRepository;

        @Mock
        private ActivityTypeRepository activityTypeRepository;

        @Mock
        private PersonelRepository personelRepository;

        @InjectMocks
        private ActivityService activityService;

        @AfterEach
        void tearDown() {
                SecurityContextHolder.clearContext();
        }

        @Test
        void updateAssignedStatusAllowsOwnerToChangeStatus() {
                setAuthenticatedUser("tech1");

                Request request = Request.builder()
                                .id(11)
                                .manager(personel(100L, "manager1"))
                                .status("IN_PROGRESS")
                                .build();

                Activity activity = Activity.builder()
                                .id(1L)
                                .request(request)
                                .personel(personel(200L, "tech1"))
                                .activityType(activityType(5L))
                                .status("REGISTERED")
                                .dateRegistered(LocalDateTime.now())
                                .build();

                when(activityRepository.findById(1L)).thenReturn(Optional.of(activity));
                when(personelRepository.findByUsername("tech1")).thenReturn(Optional.of(personel(200L, "tech1")));
                when(activityRepository.save(any(Activity.class))).thenAnswer(invocation -> invocation.getArgument(0));

                UpdateActivityStatusDto dto = new UpdateActivityStatusDto();
                dto.setStatus("IN_PROGRESS");

                ActivityResponse response = activityService.updateAssignedStatus(1L, dto);

                assertThat(response.getStatus()).isEqualTo("IN_PROGRESS");
        }

        @Test
        void updateAssignedStatusRejectsNonAssignedUser() {
                setAuthenticatedUser("tech2");

                Request request = Request.builder()
                                .id(11)
                                .manager(personel(100L, "manager1"))
                                .status("IN_PROGRESS")
                                .build();

                Activity activity = Activity.builder()
                                .id(1L)
                                .request(request)
                                .personel(personel(200L, "tech1"))
                                .activityType(activityType(5L))
                                .status("REGISTERED")
                                .dateRegistered(LocalDateTime.now())
                                .build();

                when(activityRepository.findById(1L)).thenReturn(Optional.of(activity));
                when(personelRepository.findByUsername("tech2")).thenReturn(Optional.of(personel(201L, "tech2")));

                UpdateActivityStatusDto dto = new UpdateActivityStatusDto();
                dto.setStatus("DONE");

                assertThrows(org.springframework.security.access.AccessDeniedException.class,
                                () -> activityService.updateAssignedStatus(1L, dto));
        }

        @Test
        void listUsesSpecificationAndReturnsMappedResponse() {
                Request request = Request.builder().id(11).build();
                Personel personel = Personel.builder().id(200L).firstName("Jan").surname("Kowalski").build();
                Activity activity = Activity.builder()
                                .id(1L)
                                .request(request)
                                .personel(personel)
                                .activityType(activityType(5L))
                                .seqNo("12")
                                .description("Rozebrac na czesci")
                                .result("Gotowe")
                                .status("DONE")
                                .dateRegistered(LocalDateTime.of(2026, 6, 15, 10, 0))
                                .dateFinishedCanceled(LocalDateTime.of(2026, 6, 16, 12, 0))
                                .build();

                when(activityRepository.findAll(any(Specification.class), any(Pageable.class)))
                                .thenReturn(new PageImpl<>(List.of(activity)));

                var response = activityService.list(
                                "roz",
                                "DONE",
                                "200",
                                "2026-06-14",
                                "2026-06-23",
                                1,
                                10,
                                "seqNo",
                                "asc",
                                11);

                assertThat(response.getData()).hasSize(1);
                assertThat(response.getData().get(0).getDescription()).isEqualTo("Rozebrac na czesci");
                assertThat(response.getData().get(0).getExecutor().name()).isEqualTo("Jan Kowalski");
                assertThat(response.getMeta().getOrderBy()).isEqualTo("seqNo");
                assertThat(response.getMeta().getSort()).isEqualTo("asc");

                verify(activityRepository).findAll(any(Specification.class), any(Pageable.class));
        }

        private void setAuthenticatedUser(String username) {
                SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(username, "secret", List.of()));
        }

        private Personel personel(Long id, String username) {
                return Personel.builder()
                                .id(id)
                                .username(username)
                                .password("x")
                                .role(Role.STAFF)
                                .active(true)
                                .build();
        }

        private ActivityType activityType(Long id) {
                return ActivityType.builder()
                                .id(id)
                                .actType("REPAIR")
                                .build();
        }
}
