package com.tab.dra2.repository;

import com.tab.dra2.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ClientRepository extends JpaRepository<Client, Integer>, JpaSpecificationExecutor<Client> {
}
