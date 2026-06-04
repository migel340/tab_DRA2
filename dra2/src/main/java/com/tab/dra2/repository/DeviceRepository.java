package com.tab.dra2.repository;

import com.tab.dra2.entity.Device;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DeviceRepository extends JpaRepository<Device, Integer> {

    @Query("SELECT d FROM Device d WHERE (:clientId IS NULL OR d.client.id = :clientId)")
    Page<Device> findByClientIdOptional(@Param("clientId") Integer clientId, Pageable pageable);
}
