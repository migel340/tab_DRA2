package com.tab.dra2.repository;

import com.tab.dra2.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    @Query("""
						select a
						from Address a
						where lower(a.city) = lower(:city)
							and lower(a.state) = lower(:state)
							and a.postal_code = :postalCode
							and lower(a.country) = lower(:country)
						""")
    Optional<Address> findExisting(
						@Param("city") String city,
						@Param("state") String state,
						@Param("postalCode") String postalCode,
						@Param("country") String country
    );
}
