package com.securevault.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateShareRequest {

    @NotBlank(message = "Permission is required")
    private String permission;

    public UpdateShareRequest() {
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }
}