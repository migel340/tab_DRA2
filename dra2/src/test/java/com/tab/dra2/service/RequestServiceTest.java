package com.tab.dra2.service;

import com.tab.dra2.dto.CreateRequestDto;
import com.tab.dra2.dto.RequestResponse;
import com.tab.dra2.entity.Device;
import com.tab.dra2.entity.Personel;
import com.tab.dra2.entity.Request;
import com.tab.dra2.enums.Role;
import com.tab.dra2.repository.DeviceRepository;
import com.tab.dra2.repository.PersonelRepository;
import com.tab.dra2.repository.RequestRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestServiceTest {

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private PersonelRepository personelRepository;

    @InjectMocks
    private RequestService requestService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void updateRejectsInvalidStatusTransition() {
        setAuthenticatedUser("manager1");

        Request existing = Request.builder()
                .id(1)
                .device(device(10))
                .manager(personel(100L, "manager1"))
                .description("Test")
                .status("REGISTERED")
                .build();

        when(requestRepository.findById(1)).thenReturn(Optional.of(existing));
        when(personelRepository.findByUsername("manager1")).thenReturn(Optional.of(personel(100L, "manager1")));

        CreateRequestDto dto = CreateRequestDto.builder()
                .status("FINISHED")
                .build();

        assertThrows(IllegalStateException.class, () -> requestService.update(1, dto));
    }

    @Test
    void createForcesRegisteredStatus() {
        setAuthenticatedUser("manager1");

        when(deviceRepository.findById(10)).thenReturn(Optional.of(device(10)));
        when(personelRepository.findById(100L)).thenReturn(Optional.of(personel(100L, "manager1")));
        when(personelRepository.findByUsername("manager1")).thenReturn(Optional.of(personel(100L, "manager1")));
        AtomicInteger ids = new AtomicInteger(1);
        when(requestRepository.save(any(Request.class))).thenAnswer(invocation -> {
            Request request = invocation.getArgument(0);
            if (request.getId() == null) {
                request.setId(ids.getAndIncrement());
            }
            return request;
        });

        CreateRequestDto dto = CreateRequestDto.builder()
                .deviceId(10)
                .managerId(100)
                .description("Need repair")
                .status("REGISTERED")
                .build();

        RequestResponse response = requestService.create(dto);

        assertThat(response.getStatus()).isEqualTo("REGISTERED");
        assertThat(response.getManagerId()).isEqualTo(100);
    }

    private void setAuthenticatedUser(String username) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(username, "secret", List.of())
        );
    }

    private Personel personel(Long id, String username) {
        return Personel.builder()
                .id(id)
                .username(username)
                .password("x")
                .role(Role.MANAGER)
                .active(true)
                .build();
    }

    private Device device(Integer id) {
        Device device = new Device();
        device.setId(id);
        device.setDeviceName("Laptop");
        return device;
    }
}
