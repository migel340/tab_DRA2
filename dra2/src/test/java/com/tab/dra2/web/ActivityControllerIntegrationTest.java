package com.tab.dra2.web;

import com.tab.dra2.entity.Activity;
import com.tab.dra2.entity.ActivityType;
import com.tab.dra2.entity.Address;
import com.tab.dra2.entity.Client;
import com.tab.dra2.entity.Device;
import com.tab.dra2.entity.DeviceType;
import com.tab.dra2.entity.Personel;
import com.tab.dra2.entity.Request;
import com.tab.dra2.enums.Role;
import com.tab.dra2.repository.ActivityRepository;
import com.tab.dra2.repository.ActivityTypeRepository;
import com.tab.dra2.repository.AddressRepository;
import com.tab.dra2.repository.ClientRepository;
import com.tab.dra2.repository.DeviceRepository;
import com.tab.dra2.repository.DeviceTypeRepository;
import com.tab.dra2.repository.PersonelRepository;
import com.tab.dra2.repository.RequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ActivityControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityTypeRepository activityTypeRepository;

    @Autowired
    private PersonelRepository personelRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private DeviceTypeRepository deviceTypeRepository;

    private Long executorId;

    @BeforeEach
    void setUp() {
        Address address = new Address();
        address.setCity("Warsaw");
        address.setState("Mazowieckie");
        address.setPostal_code("00-001");
        address.setCountry("Poland");
        address = addressRepository.save(address);

        Client client = Client.builder()
                .firstName("Jan")
                .surname("Klient")
                .phoneNumber("123456789")
                .address(address)
                .build();
        client = clientRepository.save(client);

        DeviceType deviceType = new DeviceType();
        deviceType.setDeviceTypeName("Laptop");
        deviceType = deviceTypeRepository.save(deviceType);

        Device device = new Device();
        device.setClient(client);
        device.setDeviceType(deviceType);
        device.setDeviceName("ThinkPad");
        device = deviceRepository.save(device);

        Personel manager = Personel.builder()
                .firstName("Marta")
                .surname("Manager")
                .username("manager1")
                .password("secret")
                .role(Role.MANAGER)
                .active(true)
                .build();
        manager = personelRepository.save(manager);

        Personel executor = Personel.builder()
                .firstName("Jan")
                .surname("Kowalski")
                .username("staff1")
                .password("secret")
                .role(Role.STAFF)
                .active(true)
                .build();
        executor = personelRepository.save(executor);
        executorId = executor.getId();

        Personel otherExecutor = Personel.builder()
                .firstName("Kamil")
                .surname("Bernar")
                .username("staff2")
                .password("secret")
                .role(Role.STAFF)
                .active(true)
                .build();
        otherExecutor = personelRepository.save(otherExecutor);

        Request request = Request.builder()
                .device(device)
                .manager(manager)
                .description("Naprawa urzadzenia")
                .status("IN_PROGRESS")
                .dateRegistered(Date.valueOf("2026-06-14"))
                .build();
        request = requestRepository.save(request);

        ActivityType activityType = new ActivityType();
        activityType.setActType("REPAIR");
        activityType = activityTypeRepository.save(activityType);

        activityRepository.save(Activity.builder()
                .request(request)
                .activityType(activityType)
                .personel(executor)
                .seqNo("1")
                .description("Rozebrac na czesci")
                .result("Gotowe")
                .status("DONE")
                .dateRegistered(LocalDateTime.of(2026, 6, 15, 10, 0))
                .dateFinishedCanceled(LocalDateTime.of(2026, 6, 16, 12, 0))
                .build());

        activityRepository.save(Activity.builder()
                .request(request)
                .activityType(activityType)
                .personel(otherExecutor)
                .seqNo("2")
                .description("Zmiana obudowy")
                .result("W toku")
                .status("REGISTERED")
                .dateRegistered(LocalDateTime.of(2026, 6, 10, 10, 0))
                .build());
    }

    @Test
    @WithMockUser(username = "manager1", roles = "MANAGER")
    void listFiltersActivitiesByExecutorStatusQueryAndDateRange() throws Exception {
        mockMvc.perform(get("/api/activities")
                        .param("executor", executorId.toString())
                        .param("status", "DONE")
                        .param("q", "rozebrac")
                        .param("dateFrom", "2026-06-14")
                        .param("dateTo", "2026-06-23"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.data.length()").value(1))
                .andExpect(jsonPath("$.data.data[0].description").value("Rozebrac na czesci"))
                .andExpect(jsonPath("$.data.data[0].status").value("DONE"))
                .andExpect(jsonPath("$.data.data[0].executor.name").value("Jan Kowalski"))
                .andExpect(jsonPath("$.data.meta.totalItems").value(1));
    }
}
