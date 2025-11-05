package com.example.secretweapon.repository;


import com.example.secretweapon.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //EPIC 01
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);
}