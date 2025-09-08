package com.example.flipkart.controllers;

import com.example.flipkart.DTO.UserDTO;
import com.example.flipkart.ServiceInterface.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    UserService userService;
@GetMapping("/get/user")
    public List<UserDTO> getUser(){
    return userService.seeUser();
}

@PostMapping("/post/user")
    public String postUser(@RequestBody UserDTO userDTO){
    return userService.createUser(userDTO);
}
@DeleteMapping("/delete/user/{id}")
    public boolean deleteUser(@PathVariable  Long id){
    return userService.rmvusr(id);
}
}
