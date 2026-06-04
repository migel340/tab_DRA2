package com.tab.dra2.repository;

import com.tab.dra2.entity.Activity;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

	boolean existsByRequest_IdAndStatusNotIn(Integer requestId, Collection<String> statuses);

	@Query("SELECT a FROM Activity a WHERE (:requestId IS NULL OR a.request.id = :requestId)")
	Page<Activity> findByRequestIdOptional(@Param("requestId") Integer requestId, Pageable pageable);
}