import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8083';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API}/api/bookings`);
      if (res.ok) { const data = await res.json(); setBookings(data); }
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <nav className="navbar navbar-dark" style={{backgroundColor:'#e50914'}}>
        <div className="container">
          <span className="navbar-brand">🎟️ Booking Management</span>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/admin')}>Back</button>
        </div>
      </nav>
      <div className="container mt-4">
        <h5>All Bookings ({bookings.length})</h5>
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Booking ID</th>
              <th>User ID</th>
              <th>Movie ID</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="8" className="text-center">No bookings yet!</td></tr>
            ) : bookings.map((b, i) => (
              <tr key={b.id}>
                <td>{i+1}</td>
                <td>{b.id}</td>
                <td>{b.userId}</td>
                <td>{b.movieId}</td>
                <td>{b.seatsBooked}</td>
                <td>₹{b.totalAmount}</td>
                <td><span className={`badge ${b.status === 'CONFIRMED' ? 'bg-success' : 'bg-warning'}`}>{b.status}</span></td>
                <td>{b.bookingDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingManagement;