package com.cinesync.booking_service.controller;

import com.cinesync.booking_service.entity.Screen;
import com.cinesync.booking_service.entity.ShowTime;
import com.cinesync.booking_service.service.ScreenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ScreenController {

    @Autowired
    private ScreenService screenService;

    @PostMapping("/api/screens")
    public ResponseEntity<Screen> addScreen(@RequestBody Screen screen) {
        return ResponseEntity.ok(screenService.addScreen(screen));
    }

    @GetMapping("/api/screens")
    public ResponseEntity<List<Screen>> getAllScreens() {
        return ResponseEntity.ok(screenService.getAllScreens());
    }

    @GetMapping("/api/screens/active")
    public ResponseEntity<List<Screen>> getActiveScreens() {
        return ResponseEntity.ok(screenService.getActiveScreens());
    }

    @PutMapping("/api/screens/{id}")
    public ResponseEntity<Screen> updateScreen(@PathVariable Long id, @RequestBody Screen screen) {
        return ResponseEntity.ok(screenService.updateScreen(id, screen));
    }

    @DeleteMapping("/api/screens/{id}")
    public ResponseEntity<String> deleteScreen(@PathVariable Long id) {
        screenService.deleteScreen(id);
        return ResponseEntity.ok("Screen deleted!");
    }

    @PostMapping("/api/showtimes")
    public ResponseEntity<ShowTime> addShowTime(@RequestBody ShowTime showTime) {
        return ResponseEntity.ok(screenService.addShowTime(showTime));
    }

    @GetMapping("/api/showtimes")
    public ResponseEntity<List<ShowTime>> getAllShowTimes() {
        return ResponseEntity.ok(screenService.getAllShowTimes());
    }

    @GetMapping("/api/showtimes/movie/{movieId}")
    public ResponseEntity<List<ShowTime>> getShowTimesByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(screenService.getShowTimesByMovie(movieId));
    }

    @GetMapping("/api/showtimes/date/{date}")
    public ResponseEntity<List<ShowTime>> getShowTimesByDate(@PathVariable String date) {
        return ResponseEntity.ok(screenService.getShowTimesByDate(date));
    }

    @GetMapping("/api/showtimes/movie/{movieId}/date/{date}")
    public ResponseEntity<List<ShowTime>> getShowTimesByMovieAndDate(
            @PathVariable Long movieId, @PathVariable String date) {
        return ResponseEntity.ok(screenService.getShowTimesByMovieAndDate(movieId, date));
    }

    @PutMapping("/api/showtimes/{id}")
    public ResponseEntity<ShowTime> updateShowTime(@PathVariable Long id, @RequestBody ShowTime showTime) {
        return ResponseEntity.ok(screenService.updateShowTime(id, showTime));
    }

    @DeleteMapping("/api/showtimes/{id}")
    public ResponseEntity<String> deleteShowTime(@PathVariable Long id) {
        screenService.deleteShowTime(id);
        return ResponseEntity.ok("ShowTime deleted!");
    }
}
