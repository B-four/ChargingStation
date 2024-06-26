package com.example.chargingstation.usercontrol.repository;

import com.example.chargingstation.usercontrol.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String>
{
    User findByUsernameAndPassword(String username, String password);
    User findByUsername(String username);
}