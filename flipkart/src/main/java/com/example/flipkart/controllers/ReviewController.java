package com.example.flipkart.controllers;

import com.example.flipkart.DTO.ReviewDTO;
import com.example.flipkart.Entity.ReviewEntity;
import com.example.flipkart.ServiceInterface.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReviewController {
    @Autowired
    public ReviewService reviewService;

    @GetMapping("/review")
    public List<ReviewDTO> getReview(){
        return reviewService.seeReview();
    }
    @PostMapping("/review")
    public String postReview(@RequestBody ReviewDTO reviewDTO){
        return reviewService.sendReview(reviewDTO);
    }
    @DeleteMapping("/review/{id}")
    public String deleteReviews(@PathVariable Long id){
        return reviewService.deleteReview(id);
    }
    @PutMapping("/review/{id}")
    public String updtReview(@PathVariable Long id,@RequestBody ReviewDTO reviewDTO){
        return reviewService.updateReview(id,reviewDTO);
    }
    @GetMapping("/review/{id}")
    public ReviewEntity getbyid(@PathVariable Long id){
        return reviewService.getbyid(id);
    }
}
