package com.securevault.exception;

public class AccountLockedException extends RuntimeException {

    public AccountLockedException() {
        super("Account temporarily locked due to multiple failed login attempts. Please try again after 5 minutes.");
    }
}
