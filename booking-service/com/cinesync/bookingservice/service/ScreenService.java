package com.cinesync.booking_service.service;

import com.cinesync.booking_service.entity.Screen;
import com.cinesync.booking_service.entity.ShowTime;
import com.cinesync.booking_service.repository.ScreenRepository;
import com.cinesync.booking_service.repository.ShowTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ScreenService {

    @Autowired
    private ScreenRepository screenRepository;

    @Autowired
    private ShowTimeRepository showTimeRepository;

    // Screen CRUD
    public Screen addScreen(Screen screen) {
        screen.setActive(true);
        return screenRepository.save(screen);
    }

    public List<Screen> getAllScreens() {
        return screenRepository.findAll();
    }

    public List<Screen> getActiveScreens() {
        return screenRepository.findByActive(true);
    }

    public Screen updateScreen(Long id, Screen screen) {
        Screen existing = screenRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Screen not found!"));
        existing.setName(screen.getName());
        existing.setType(screen.getType());
        existing.setTotalSeats(screen.getTotalSeats());
        existing.setPriceMultiplier(screen.getPriceMultiplier());
        existing.setFacilities(screen.getFacilities());
        return screenRepository.save(existing);
    }

    public void deleteScreen(Long id) {
        screenRepository.deleteById(id);
    }

    // ShowTime CRUD
    public ShowTime addShowTime(ShowTime showTime) {
        // Auto calculate end time based on movie duration
        if (showTime.getStartTime() != null && showTime.getMovieDuration() > 0) {
            LocalTime endTime = showTime.getStartTime()
                .plusMinutes(showTime.getMovieDuration())
                .plusMinutes(15); // 15 min interval
            showTime.setEndTime(endTime);
        }

        // Set available seats from screen
        Screen screen = screenRepository.findById(showTime.getScreenId())
            .orElseThrow(() -> new RuntimeException("Screen not found!"));
        showTime.setTotalSeats(screen.getTotalSeats());
        showTime.setAvailableSeats(screen.getTotalSeats());

        // Set base price with screen multiplier
        double basePrice = 250.0 * screen.getPriceMultiplier();
        showTime.setBasePrice(basePrice);
        showTime.setScreenName(screen.getName());
        showTime.setScreenType(screen.getType());
        showTime.setActive(true);

        return showTimeRepository.save(showTime);
    }

    public List<ShowTime> getAllShowTimes() {
        return showTimeRepository.findAll();
    }

    public List<ShowTime> getShowTimesByMovie(Long movieId) {
        return showTimeRepository.findByMovieId(movieId);
    }

    public List<ShowTime> getShowTimesByDate(String date) {
        return showTimeRepository.findByShowDate(LocalDate.parse(date));
    }

    public List<ShowTime> getShowTimesByMovieAndDate(Long movieId, String date) {
        return showTimeRepository.findByMovieIdAndShowDate(movieId, LocalDate.parse(date));
    }

    public ShowTime updateShowTime(Long id, ShowTime showTime) {
        ShowTime existing = showTimeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("ShowTime not found!"));
        existing.setStartTime(showTime.getStartTime());
        if (showTime.getMovieDuration() > 0) {
            existing.setEndTime(showTime.getStartTime()
                .plusMinutes(showTime.getMovieDuration()).plusMinutes(15));
        }
        existing.setShowDate(showTime.getShowDate());
        existing.setActive(showTime.isActive());
        return showTimeRepository.save(existing);
    }

    public void deleteShowTime(Long id) {
        showTimeRepository.deleteById(id);
    }

    public ShowTime updateAvailableSeats(Long id, int seatsBooked) {
        ShowTime showTime = showTimeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("ShowTime not found!"));
        showTime.setAvailableSeats(showTime.getAvailableSeats() - seatsBooked);
        return showTimeRepository.save(showTime);
    }
}