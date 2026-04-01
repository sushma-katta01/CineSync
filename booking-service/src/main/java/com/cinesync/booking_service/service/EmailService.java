package com.cinesync.booking_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, String movieName,
            int seats, double amount, Long bookingId) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("kattasushma38@gmail.com");
            message.setTo(toEmail);
            message.setSubject("🎬 CineSync - Booking Confirmed! #" + bookingId);
            message.setText(
                "Dear Customer,\n\n" +
                "🎉 Your booking is CONFIRMED!\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "🎬 Movie: " + movieName + "\n" +
                "🎟️ Seats Booked: " + seats + "\n" +
                "💰 Total Amount: ₹" + amount + "\n" +
                "🎫 Booking ID: #" + bookingId + "\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Enjoy your movie! 🍿\n\n" +
                "Thank you for choosing CineSync!\n" +
                "Team CineSync 🎬"
            );
            mailSender.send(message);
            System.out.println("✅ Booking confirmation email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }

    public void sendCancellationEmail(String toEmail, String movieName,
            int seats, double amount, Long bookingId) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("kattasushma38@gmail.com");
            message.setTo(toEmail);
            message.setSubject("❌ CineSync - Booking Cancelled #" + bookingId);
            message.setText(
                "Dear Customer,\n\n" +
                "Your booking has been CANCELLED.\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "🎬 Movie: " + movieName + "\n" +
                "🎟️ Seats: " + seats + "\n" +
                "💰 Refund Amount: ₹" + amount + "\n" +
                "🎫 Booking ID: #" + bookingId + "\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Your refund will be processed in 3-5 business days.\n\n" +
                "We hope to see you again!\n" +
                "Team CineSync 🎬"
            );
            mailSender.send(message);
            System.out.println("✅ Cancellation email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }
}