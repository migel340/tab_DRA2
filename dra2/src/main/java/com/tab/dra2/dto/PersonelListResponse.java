package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PersonelListResponse {
    private List<PersonelResponse> data;
    private Meta meta;

    @Data
    @Builder
    public static class Meta {
        private int page;
        private int limit;
        private long totalItems;
        private int totalPages;
        private String orderBy;
        private String sort;
        private String q;
    }
}
