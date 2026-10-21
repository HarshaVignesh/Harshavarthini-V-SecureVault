package com.securevault.respository;

import com.securevault.entity.Credential;
import com.securevault.entity.CredentialShare;
import com.securevault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CredentialShareRepository extends JpaRepository<CredentialShare, Long> {

    List<CredentialShare> findByCredential(Credential credential);

    Optional<CredentialShare> findByCredentialAndSharedWithUser(
            Credential credential,
            User sharedWithUser
    );

    List<CredentialShare> findBySharedWithUser(User sharedWithUser);
}