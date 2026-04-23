package com.tab.dra2.repository;

import com.tab.dra2.entity.Personel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonelRepository extends JpaRepository<Personel, Long> {
    Optional<Personel> findByUsername(String username);

    boolean existsByUsername(String username);
}