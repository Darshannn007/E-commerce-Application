package com.example.flipkart.controllers;

import com.example.flipkart.DTO.ReviewDTO;
import com.example.flipkart.Entity.ReviewEntity;
import com.example.flipkart.ServiceInterface.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
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
