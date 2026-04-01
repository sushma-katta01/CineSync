package com.cinesync.user_service.service;

import com.cinesync.user_service.dto.LoginResponse;
import com.cinesync.user_service.entity.User;
import com.cinesync.user_service.repository.UserRepository;
import com.cinesync.user_service.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) user.setRole(User.Role.CUSTOMER);
        user.setActive(true);
        return userRepository.save(user);
    }

    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid email or password!"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password!");
        }
        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated!");
        }
String token = jwtUtil.generateToken(email, user.getRole().toString());
        return new LoginResponse(token, user.getId(), user.getEmail(),
            user.getName(), user.getRole().toString());
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(User.Role.valueOf(role));
    }

    public List<User> getStaff() {
        return userRepository.findByRoleIn(
            List.of(User.Role.MANAGER, User.Role.TICKET_AGENT));
    }

    public User addStaff(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);
        return userRepository.save(user);
    }

    public User updateUser(Long id, User user) {
        User existing = getUserById(id);
        existing.setName(user.getName());
        existing.setPhone(user.getPhone());
        existing.setRole(user.getRole());
        existing.setDepartment(user.getDepartment());
        existing.setSalary(user.getSalary());
        return userRepository.save(existing);
    }

    public User updateSalary(Long id, double salary) {
        User existing = getUserById(id);
        existing.setSalary(salary);
        return userRepository.save(existing);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User toggleActive(Long id) {
        User existing = getUserById(id);
        existing.setActive(!existing.isActive());
        return userRepository.save(existing);
    }
}