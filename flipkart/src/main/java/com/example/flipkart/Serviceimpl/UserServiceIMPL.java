package com.example.flipkart.Serviceimpl;

import com.example.flipkart.DTO.UserDTO;
import com.example.flipkart.Entity.UserEntity;
import com.example.flipkart.ServiceInterface.UserService;
import com.example.flipkart.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Transactional
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
    public String rmvusr(Long id) {

        UserEntity user = userRepository.findById(id).get();
        userRepository.delete(user);
        return "delted successfully";
    }

    @Override
    public String updateusr(Long id, UserDTO userDTO) {
        UserEntity usr = userRepository.findById(id).orElseThrow(() -> new RuntimeException("not found"+id));
        if (userDTO.getFirstname() != null) {
            usr.setFirstname(userDTO.getFirstname());
        }
        if (userDTO.getLastname() != null) {
            usr.setLastname(userDTO.getLastname());
        }
        if (userDTO.getEmail() != null) {
            usr.setEmail(userDTO.getEmail());
        }
        if (userDTO.getPasskey() != null) {
            usr.setPasskey(userDTO.getPasskey());
        }
        if (userDTO.getPhone() != null) {
            usr.setPhone(userDTO.getPhone());
        }
        userRepository.save(usr);
        return "updated successfully";
    }

    @Override
    public UserEntity getUsrById(Long id) {
        UserEntity usr = userRepository.findById(id).get();
        return usr;
    }
}