package com.cinesync.booking_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "screens")
public class Screen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type; // IMAX, XD, SONY, STANDARD, DOLBY
    private int totalSeats;
    private double priceMultiplier; // IMAX=2.0, XD=1.8, SONY=1.5, STANDARD=1.0, DOLBY=1.6
    private String facilities;
    private boolean active;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
    public double getPriceMultiplier() { return priceMultiplier; }
    public void setPriceMultiplier(double priceMultiplier) { this.priceMultiplier = priceMultiplier; }
    public String getFacilities() { return facilities; }
    public void setFacilities(String facilities) { this.facilities = facilities; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}