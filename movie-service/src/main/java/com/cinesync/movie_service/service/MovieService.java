package com.cinesync.movie_service.service;

import com.cinesync.movie_service.entity.Movie;
import com.cinesync.movie_service.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public Movie addMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found!"));
    }

    public Movie updateMovie(Long id, Movie movie) {
        Movie existing = getMovieById(id);
        existing.setTitle(movie.getTitle());
        existing.setDescription(movie.getDescription());
        existing.setGenre(movie.getGenre());
        existing.setLanguage(movie.getLanguage());
        existing.setDuration(movie.getDuration());
        existing.setRating(movie.getRating());
        existing.setReleaseDate(movie.getReleaseDate());
        existing.setStatus(movie.getStatus());
        existing.setImageUrl(movie.getImageUrl());
        existing.setTrailerUrl(movie.getTrailerUrl());
        existing.setFeatured(movie.isFeatured());
        return movieRepository.save(existing);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    public List<Movie> getNowShowing() {
        return movieRepository.findByStatus(Movie.Status.ACTIVE);
    }

    public List<Movie> getUpcoming() {
        return movieRepository.findByStatus(Movie.Status.UPCOMING);
    }

    public List<Movie> getFeatured() {
        return movieRepository.findByFeatured(true);
    }
}