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
    public String rmvProduct(Long id) {
        ProductEntity pre = productRepository.findById(id).get();
        productRepository.delete(pre);
        return "Deleted successfully";
    }

    @Override
    public Optional<ProductEntity> getsinpro(Long id) {
        Optional<ProductEntity> product = productRepository.findById(id);
        return product;
    }

    @Override
    public String updPro(Long id, ProductDTO productDTO) {
        ProductEntity pro = productRepository.findById(id).orElseThrow(() -> new RuntimeException("not found"+id));
        if (productDTO.getName() != null) {
        pro.setName(productDTO.getName());
        }
        if (productDTO.getPrice() != null) {
            pro.setPrice(productDTO.getPrice());
        }
        if (productDTO.getUserid() != null) {
            pro.setUserid(productDTO.getUserid());
        }
        if (productDTO.getDate() != null) {
            pro.setDate(productDTO.getDate());
        }
        productRepository.save(pro);
        return "product updated successfully";
    }
}