package com.example.flipkart.ServiceInterface;

import com.example.flipkart.DTO.UserDTO;
import java.util.List;


public interface UserService {
    public List<UserDTO> seeUser();
    public String createUser(UserDTO userDTO);
    public boolean rmvusr(Long id);
}
