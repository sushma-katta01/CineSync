package com.cinesync.booking_service.repository;

import com.cinesync.booking_service.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {
    List<Screen> findByActive(boolean active);
    List<Screen> findByType(String type);
}