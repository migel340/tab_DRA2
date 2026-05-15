package com.tab.dra2.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
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
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String q;
}
