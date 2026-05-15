package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ListResponse<T> {
    private List<T> data;
    private ListResponseMeta meta;
}
