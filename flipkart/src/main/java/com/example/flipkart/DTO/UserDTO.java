package com.example.flipkart.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private Long passkey;
    private String phone;
}