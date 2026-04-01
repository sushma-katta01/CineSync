package com.cinesync.booking_service.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "show_times")
public class ShowTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long movieId;
    private String movieTitle;
    private int movieDuration;
    private Long screenId;
    private String screenName;
    private String screenType;
    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int totalSeats;
    private int availableSeats;
    private double basePrice;
    private boolean active;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }
    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }
    public int getMovieDuration() { return movieDuration; }
    public void setMovieDuration(int movieDuration) { this.movieDuration = movieDuration; }
    public Long getScreenId() { return screenId; }
    public void setScreenId(Long screenId) { this.screenId = screenId; }
    public String getScreenName() { return screenName; }
    public void setScreenName(String screenName) { this.screenName = screenName; }
    public String getScreenType() { return screenType; }
    public void setScreenType(String screenType) { this.screenType = screenType; }
    public LocalDate getShowDate() { return showDate; }
    public void setShowDate(LocalDate showDate) { this.showDate = showDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }
    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}