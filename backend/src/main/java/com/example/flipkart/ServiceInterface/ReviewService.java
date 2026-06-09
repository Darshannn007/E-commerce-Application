package com.example.flipkart.ServiceInterface;

import com.example.flipkart.DTO.ReviewDTO;
import com.example.flipkart.Entity.ReviewEntity;

import java.util.List;

public interface ReviewService {
    public List<ReviewDTO> seeReview();
    public String sendReview(ReviewDTO reviewDTO);
    public String deleteReview(Long id);
    public String updateReview(Long id,ReviewDTO reviewDTO);
    public ReviewEntity getbyid(Long id);
}
