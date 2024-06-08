package com.example.chargingstation.usercontrol.control;

import com.example.chargingstation.usercontrol.entity.User;
import com.example.chargingstation.usercontrol.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserControl {
    
    private final UserService userService;
    
    @Autowired
    public UserControl(UserService userService) {
        this.userService = userService;
    }
    
    // 로그인 기능
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginUser) {
        User user = userService.findByUsernameAndPassword(loginUser.getUsername(), loginUser.getPassword());
        if (user != null) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
}