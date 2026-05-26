package com.tab.dra2.util;

import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Locale;

public class PaginationValidator {
    
    private static final int MIN_PAGE = 1;
    private static final int MIN_LIMIT = 1;
    private static final int MAX_LIMIT = 100;
    private static final String DEFAULT_ORDER_BY = "id";

    public static int validatePage(int page) {
        if (page < MIN_PAGE) {
            throw new IllegalArgumentException("Invalid page value. Allowed: page >= 1");
        }
        return page;
    }

    public static int validateLimit(int limit) {
        if (limit < MIN_LIMIT || limit > MAX_LIMIT) {
            throw new IllegalArgumentException("Invalid limit value. Allowed: 1..100");
        }
        return limit;
    }

    public static String validateOrderBy(String orderBy, List<String> allowedFields) {
        if (orderBy == null || orderBy.isBlank()) {
            return DEFAULT_ORDER_BY;
        }

        String resolvedOrderBy = orderBy.trim();
        if (!allowedFields.contains(resolvedOrderBy)) {
            throw new IllegalArgumentException("Invalid orderBy value. Allowed fields: " + String.join(", ", allowedFields));
        }
        return resolvedOrderBy;
    }

    public static Sort.Direction validateSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.Direction.ASC;
        }

        try {
            return Sort.Direction.valueOf(sort.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid sort value. Allowed: ASC or DESC");
        }
    }
}
