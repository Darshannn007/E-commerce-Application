package com.example.flipkart.ServiceInterface;

import com.example.flipkart.DTO.ProductDTO;
import com.example.flipkart.Entity.ProductEntity;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    public List<ProductDTO> seeProduct();
    public String createProduct(ProductDTO productDto);
    public boolean rmvProduct(Long id);
    public Optional<ProductEntity> getsinpro(Long id);
}
