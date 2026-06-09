package com.example.flipkart.Serviceimpl;

import com.example.flipkart.DTO.ReviewDTO;
import com.example.flipkart.Entity.ReviewEntity;
import com.example.flipkart.ServiceInterface.ReviewService;
import com.example.flipkart.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional

public class ReviewServiceIMPL implements ReviewService {
    @Autowired
    public ReviewRepository reviewRepository;
    @Override
    public List<ReviewDTO> seeReview() {
        List<ReviewEntity> rvwlist = reviewRepository.findAll();
        List<ReviewDTO> dto = new ArrayList<>();

        for (ReviewEntity rvli : rvwlist){
            ReviewDTO dto1 = new ReviewDTO();
            dto1.setId(rvli.getId());
            dto1.setUserid(rvli.getUserid());
            dto1.setReview(rvli.getReview());
            dto1.setProductid(rvli.getProductid());
            dto.add(dto1);
        }
        return dto;
    }

    @Override
    public String sendReview(ReviewDTO reviewDTO) {
        ReviewEntity reviewEntity = new ReviewEntity();
        BeanUtils.copyProperties(reviewDTO,reviewEntity);
        reviewRepository.save(reviewEntity);
        return "Review Posted Successfully";
    }

    @Override
    public String deleteReview(Long id) {
        ReviewEntity rvw = reviewRepository.findById(id).get();
        reviewRepository.delete(rvw);
        return "Deleted Successfully";
    }

    @Override
    public String updateReview(Long id, ReviewDTO reviewDTO) {
        ReviewEntity reviewEntity = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        // Update only if provided in DTO (avoid overwriting with null)
        if (reviewDTO.getProductid() != null) {
            reviewEntity.setProductid(reviewDTO.getProductid());
        }

        if (reviewDTO.getUserid() != null) {
            reviewEntity.setUserid(reviewDTO.getUserid());
        }

        if (reviewDTO.getReview() != null && !reviewDTO.getReview().isEmpty()) {
            reviewEntity.setReview(reviewDTO.getReview());
        }

        reviewRepository.save(reviewEntity);
        return "Updated successfully";
    }


    @Override
    public ReviewEntity getbyid(Long id) {
        ReviewEntity rvw = reviewRepository.findById(id).get();
        return rvw;
    }

}