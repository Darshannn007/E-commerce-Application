package com.example.flipkart.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ProductDTO {
    private Long id;
    private Long userid;
    private String name;
    private Long date;
    private Long price;

}