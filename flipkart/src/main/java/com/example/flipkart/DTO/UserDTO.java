package com.example.flipkart.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private long id;
    private String firstname;
    private String lastname;
    private String email;
    private int passkey;
    private String phone;
}
