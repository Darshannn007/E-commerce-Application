package com.example.flipkart.controllers;


import com.example.flipkart.DTO.ProductDTO;
import com.example.flipkart.Entity.ProductEntity;
import com.example.flipkart.ServiceInterface.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class ProductController {

    @Autowired
    ProductService productService;

    @GetMapping("/get/product")
    public List<ProductDTO> getProduct(){
        return productService.seeProduct();
    }

    @PostMapping("/post/product")
    public String postProduct(@RequestBody ProductDTO productDto){
    return productService.createProduct(productDto);
    }

    @DeleteMapping("/delete/product/{id}")
    public boolean deleteProduct(@PathVariable Long id){
        return productService.rmvProduct(id);
    }
    @GetMapping("/get/productid/{id}")
    public Optional<ProductEntity> getpProduct(@PathVariable Long id){
        return productService.getsinpro(id);
    }
}