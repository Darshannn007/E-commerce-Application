package com.example.flipkart.ServiceInterface;

import com.example.flipkart.DTO.UserDTO;
import com.example.flipkart.Entity.UserEntity;
import org.apache.catalina.User;

import java.util.List;


public interface UserService {
    public List<UserDTO> seeUser();
    public String createUser(UserDTO userDTO);
    public String rmvusr(Long id);
    public String updateusr(Long id, UserDTO userDTO);
    public UserEntity getUsrById(Long id);
}