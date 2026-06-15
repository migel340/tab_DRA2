package com.tab.dra2.repository;

import com.tab.dra2.dto.PersonelLookupResponse;
import com.tab.dra2.entity.Personel;
import com.tab.dra2.enums.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PersonelRepository extends JpaRepository<Personel, Long>, JpaSpecificationExecutor<Personel> {
    Optional<Personel> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("SELECT p.id as id, CONCAT(p.firstName, ' ', p.surname) as name " +
            "FROM Personel p " +
            "WHERE p.active = true AND p.role <> 'ADMIN'" +
            "AND (:role IS NULL OR p.role = :role)")
    List<PersonelLookupResponse> getActiveNonAdminPersonelLookup(@Param("role") Role role);

}