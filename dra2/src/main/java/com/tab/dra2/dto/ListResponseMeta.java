package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ListResponseMeta {
    private int page;
    private int limit;
    private long totalItems;
    private int totalPages;
    private String orderBy;
    private String sort;
    private String q;
}
