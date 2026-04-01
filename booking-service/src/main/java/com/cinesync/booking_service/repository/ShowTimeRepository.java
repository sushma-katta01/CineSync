package com.cinesync.booking_service.repository;

import com.cinesync.booking_service.entity.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowTimeRepository extends JpaRepository<ShowTime, Long> {
    List<ShowTime> findByMovieId(Long movieId);
    List<ShowTime> findByScreenId(Long screenId);
    List<ShowTime> findByShowDate(LocalDate showDate);
    List<ShowTime> findByMovieIdAndShowDate(Long movieId, LocalDate showDate);
    List<ShowTime> findByScreenIdAndShowDate(Long screenId, LocalDate showDate);
    List<ShowTime> findByActive(boolean active);
}