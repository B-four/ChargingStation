package com.example.chargingstation.usercontrol.service;

import com.example.chargingstation.usercontrol.entity.User;
import com.example.chargingstation.usercontrol.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User findByUsernameAndPassword(String username, String password) {
        User user = userRepository.findByUsernameAndPassword(username, password);
        return user;
    }
    
    public User findByUsername(String username) {
        User user = userRepository.findByUsername(username);
        return user;
    }
}