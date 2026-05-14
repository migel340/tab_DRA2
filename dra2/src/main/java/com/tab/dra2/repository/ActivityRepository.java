package com.tab.dra2.repository;

import com.tab.dra2.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

	boolean existsByRequest_IdAndStatusNotIn(Integer requestId, Collection<String> statuses);
}
