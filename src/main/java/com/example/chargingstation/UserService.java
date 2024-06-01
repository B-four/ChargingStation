package com.example.chargingstation;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserDAO userDAO;
    
    public UserService(UserDAO userDAO)
    {
        this.userDAO = userDAO;
    }
    
    public boolean login(String username, String password)
    {
        UserDTO user = userDAO.getUserByUsername(username);
        if (user == null) {
            return false;
        }
        return user.getPassword().equals(password);
    }
}