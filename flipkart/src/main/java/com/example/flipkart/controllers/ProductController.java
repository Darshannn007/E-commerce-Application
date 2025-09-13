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

    @GetMapping("/product")
    public List<ProductDTO> getProduct(){
        return productService.seeProduct();
    }

    @PostMapping("/product")
    public String postProduct(@RequestBody ProductDTO productDto){
        return productService.createProduct(productDto);
    }

    @DeleteMapping("/product/{id}")
    public String deleteProduct(@PathVariable Long id){
        return productService.rmvProduct(id);
    }
    @GetMapping("/product/{id}")
    public Optional<ProductEntity> getpProduct(@PathVariable Long id){
        return productService.getsinpro(id);
    }
    @PutMapping("/product/{id}")
    public String putPro(@PathVariable Long id,@RequestBody ProductDTO productDTO){
        return productService.updPro(id,productDTO);
    }
}