package com.securevault.dto;

import java.util.List;

public class AnalyticsResponse {

    private long totalCredentials;
    private long totalVaults;
    private long activeAlerts;
    private long resolvedAlerts;
    private int passwordHealthScore;
    private long strongPasswords;
    private long mediumPasswords;
    private long weakPasswords;
    private long successfulLogins;
    private long failedLogins;
    private List<AnalyticsActivityResponse> recentActivity;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(long totalCredentials, long totalVaults, long activeAlerts,
                             long resolvedAlerts, int passwordHealthScore, long strongPasswords,
                             long mediumPasswords, long weakPasswords, long successfulLogins,
                             long failedLogins, List<AnalyticsActivityResponse> recentActivity) {
        this.totalCredentials = totalCredentials;
        this.totalVaults = totalVaults;
        this.activeAlerts = activeAlerts;
        this.resolvedAlerts = resolvedAlerts;
        this.passwordHealthScore = passwordHealthScore;
        this.strongPasswords = strongPasswords;
        this.mediumPasswords = mediumPasswords;
        this.weakPasswords = weakPasswords;
        this.successfulLogins = successfulLogins;
        this.failedLogins = failedLogins;
        this.recentActivity = recentActivity;
    }

    public long getTotalCredentials() {
        return totalCredentials;
    }

    public void setTotalCredentials(long totalCredentials) {
        this.totalCredentials = totalCredentials;
    }

    public long getTotalVaults() {
        return totalVaults;
    }

    public void setTotalVaults(long totalVaults) {
        this.totalVaults = totalVaults;
    }

    public long getActiveAlerts() {
        return activeAlerts;
    }

    public void setActiveAlerts(long activeAlerts) {
        this.activeAlerts = activeAlerts;
    }

    public long getResolvedAlerts() {
        return resolvedAlerts;
    }

    public void setResolvedAlerts(long resolvedAlerts) {
        this.resolvedAlerts = resolvedAlerts;
    }

    public int getPasswordHealthScore() {
        return passwordHealthScore;
    }

    public void setPasswordHealthScore(int passwordHealthScore) {
        this.passwordHealthScore = passwordHealthScore;
    }

    public long getStrongPasswords() {
        return strongPasswords;
    }

    public void setStrongPasswords(long strongPasswords) {
        this.strongPasswords = strongPasswords;
    }

    public long getMediumPasswords() {
        return mediumPasswords;
    }

    public void setMediumPasswords(long mediumPasswords) {
        this.mediumPasswords = mediumPasswords;
    }

    public long getWeakPasswords() {
        return weakPasswords;
    }

    public void setWeakPasswords(long weakPasswords) {
        this.weakPasswords = weakPasswords;
    }

    public long getSuccessfulLogins() {
        return successfulLogins;
    }

    public void setSuccessfulLogins(long successfulLogins) {
        this.successfulLogins = successfulLogins;
    }

    public long getFailedLogins() {
        return failedLogins;
    }

    public void setFailedLogins(long failedLogins) {
        this.failedLogins = failedLogins;
    }

    public List<AnalyticsActivityResponse> getRecentActivity() {
        return recentActivity;
    }

    public void setRecentActivity(List<AnalyticsActivityResponse> recentActivity) {
        this.recentActivity = recentActivity;
    }
}

