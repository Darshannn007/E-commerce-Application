package com.example.flipkart.repository;

import com.example.flipkart.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository <UserEntity,Long>{

}
