package com.eeccare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalComplaints;
    private long pending;
    private long inReview;
    private long inProgress;
    private long resolved;
    private long rejected;
    private Map<String, Long> categoryBreakdown;
}
