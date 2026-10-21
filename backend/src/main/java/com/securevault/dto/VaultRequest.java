package com.securevault.dto;

import jakarta.validation.constraints.NotBlank;

public class VaultRequest {

    @NotBlank(message = "Vault name is required")
    private String name;

    public VaultRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}