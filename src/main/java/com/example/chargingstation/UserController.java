package com.example.chargingstation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class UserController
{
    private final UserService userService;
    
    public UserController(UserService userService)
    {
        this.userService = userService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDTO user)
    {
        boolean success = userService.login(user.getUsername(), user.getPassword());
        if (success) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }
}
