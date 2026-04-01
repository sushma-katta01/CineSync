package com.cinesync.booking_service.service;

import com.cinesync.booking_service.entity.Booking;
import com.cinesync.booking_service.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

    public Booking createBooking(Booking booking) {
        Booking saved = bookingRepository.save(booking);
        try {
            emailService.sendBookingConfirmation(
                booking.getUserEmail(),
                booking.getMovieName(),
                booking.getSeatsBooked(),
                booking.getTotalAmount(),
                saved.getId()
            );
        } catch (Exception e) {
            System.err.println("Email error: " + e.getMessage());
        }
        return saved;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public void cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        booking.setStatus(Booking.Status.CANCELLED);
        bookingRepository.save(booking);
        try {
            emailService.sendCancellationEmail(
                booking.getUserEmail(),
                booking.getMovieName(),
                booking.getSeatsBooked(),
                booking.getTotalAmount(),
                booking.getId()
            );
        } catch (Exception e) {
            System.err.println("Email error: " + e.getMessage());
        }
    }
}