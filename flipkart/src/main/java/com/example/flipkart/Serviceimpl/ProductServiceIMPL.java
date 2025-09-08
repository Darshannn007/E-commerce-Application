package com.example.flipkart.Serviceimpl;

import com.example.flipkart.DTO.ProductDTO;
import com.example.flipkart.Entity.ProductEntity;
import com.example.flipkart.ServiceInterface.ProductService;
import com.example.flipkart.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class ProductServiceIMPL implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<ProductDTO> seeProduct() {
        List<ProductEntity> productEntity = productRepository.findAll();
        List<ProductDTO> dto = new ArrayList<>();

        for (ProductEntity productlist : productEntity){
        ProductDTO dto1 = new ProductDTO();
        dto1.setId(productlist.getId());
        dto1.setName(productlist.getName());
        dto1.setUserid(productlist.getUserid());
        dto1.setPrice(productlist.getPrice());
        dto1.setDate(productlist.getDate());
        dto.add(dto1);
        }
        return dto;
    }

    @Override
    public String createProduct(ProductDTO productDto) {
        ProductEntity productEntity = new ProductEntity();
        BeanUtils.copyProperties(productDto,productEntity);
        productRepository.save(productEntity);
        return "posted product details";
    }

    @Override
    public boolean rmvProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        else {
            System.out.println("not found"+id);
            return false;
        }
    }

    @Override
    public Optional<ProductEntity> getsinpro(Long id) {
        Optional<ProductEntity> product = productRepository.findById(id);
        return product;
    }
}