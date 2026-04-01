package com.cinesync.movie_service.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String genre;
    private String language;
    private int duration;
    private double rating;
    private LocalDate releaseDate;
    private String imageUrl;
    private String trailerUrl;
    private boolean featured; // for popup on dashboard

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status { ACTIVE, INACTIVE, UPCOMING }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}