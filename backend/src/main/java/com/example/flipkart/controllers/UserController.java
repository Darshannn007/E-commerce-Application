package com.example.flipkart.controllers;

import com.example.flipkart.DTO.UserDTO;
import com.example.flipkart.Entity.UserEntity;
import com.example.flipkart.ServiceInterface.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class UserController {

    @Autowired
    UserService userService;
    @GetMapping("/user")
    public List<UserDTO> getUser(){
        return userService.seeUser();
    }

    @PostMapping("/user")
    public String postUser(@RequestBody UserDTO userDTO){
        return userService.createUser(userDTO);
    }
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable  Long id){
        return userService.rmvusr(id);
    }
    @PutMapping("/user/{id}")
    public String putuser(@PathVariable Long id,@RequestBody UserDTO userDTO){
        return userService.updateusr(id,userDTO);
    }
    @GetMapping("/user/{id}")
    public UserEntity gtUsrById(@PathVariable Long id){
        return userService.getUsrById(id);
    }
}