package com.example.flipkart.Serviceimpl;

import com.example.flipkart.DTO.UserDTO;
import com.example.flipkart.Entity.UserEntity;
import com.example.flipkart.ServiceInterface.UserService;
import com.example.flipkart.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceIMPL implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public List<UserDTO> seeUser() {
        List<UserEntity> usrentity = userRepository.findAll();
        List<UserDTO> dto = new ArrayList<>();
        for (UserEntity userlist : usrentity){
            UserDTO dto1 = new UserDTO();
            dto1.setId(userlist.getId());
            dto1.setFirstname(userlist.getFirstname());
            dto1.setLastname(userlist.getLastname());
            dto1.setPhone(userlist.getPhone());
            dto1.setEmail(userlist.getEmail());
            dto1.setPasskey(userlist.getPasskey());
            dto.add(dto1);
        }
        return dto;
    }


    @Override
    public String createUser(UserDTO userDTO) {
    UserEntity userEntity = new UserEntity();
    BeanUtils.copyProperties(userDTO,userEntity);
    userRepository.save(userEntity);
    return "user create successfully";
    }

    @Override
    public boolean rmvusr(Long id) {
        if (userRepository.existsById(id)){
            userRepository.deleteById(id);
            return true;
        }else {
            System.out.println("not found"+id);
            return false;
        }
    }
}
