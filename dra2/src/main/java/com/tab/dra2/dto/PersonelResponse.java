package com.tab.dra2.dto;

import com.tab.dra2.entity.Personel;
import com.tab.dra2.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PersonelResponse {
    private Long id;
    private String firstName;
    private String surname;
    private String username;
    private Role role;
    private boolean active;

    public static PersonelResponse toResponse(Personel personel) {
        if (personel == null)
            return null;
        return PersonelResponse.builder()
                .id(personel.getId())
                .firstName(personel.getFirstName())
                .surname(personel.getSurname())
                .username(personel.getUsername())
                .role(personel.getRole())
                .active(personel.isActive())
                .build();
    }
}
