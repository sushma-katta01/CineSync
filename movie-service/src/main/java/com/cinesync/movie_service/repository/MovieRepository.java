package com.cinesync.movie_service.repository;

import com.cinesync.movie_service.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByStatus(Movie.Status status);
    List<Movie> findByFeatured(boolean featured);
}
