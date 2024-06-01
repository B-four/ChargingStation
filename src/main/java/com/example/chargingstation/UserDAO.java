package com.example.chargingstation;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserDAO
{
    private final JdbcTemplate jdbcTemplate;
    
    public UserDAO(JdbcTemplate jdbcTemplate)
    {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public UserDTO getUserByUsername(String username)
    {
        String sql = "SELECT * FROM users WHERE username = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{username}, (rs, rowNum) ->
                new UserDTO(rs.getString("username"), rs.getString("password")));
    }
}