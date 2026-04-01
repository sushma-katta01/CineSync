import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BOOKING_API = 'http://localhost:8083';
const MOVIE_API = 'http://localhost:8082';

function ManagerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [screens, setScreens] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookRes, movieRes, showRes, screenRes] = await Promise.all([
        axios.get(`${BOOKING_API}/api/bookings`),
        axios.get(`${MOVIE_API}/api/movies`),
        axios.get(`${BOOKING_API}/api/showtimes`),
        axios.get(`${BOOKING_API}/api/screens`)
      ]);
      setBookings(bookRes.data);
      setMovies(movieRes.data);
      setShowTimes(showRes.data);
      setScreens(screenRes.data);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const todayBookings = bookings.filter(b => {
    if (!b.bookingDate) return false;
    return new Date(b.bookingDate).toDateString() === new Date().toDateString();
  });

  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div style={{backgroundColor:'#f8f9fa', minHeight:'100vh'}}>
      <nav className="navbar navbar-dark" style={{backgroundColor:'#8e44ad'}}>
        <div className="container">
          <span className="navbar-brand fw-bold">🎭 Manager Dashboard</span>
          <div>
            <span className="text-white me-3">👔 {user?.email}</span>
            <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">

        {/* Summary Cards */}
        <div className="row mb-4">
          {[
            { title: "Today's Bookings", value: todayBookings.length, icon: '🎟️', color: '#e50914' },
            { title: 'Total Movies', value: movies.length, icon: '🎬', color: '#2980b9' },
            { title: 'Active Screens', value: screens.length, icon: '🎭', color: '#8e44ad' },
            { title: 'Total Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: '💰', color: '#27ae60' },
          ].map((card, i) => (
            <div className="col-md-3 mb-3" key={i}>
              <div className="card shadow text-center p-3" style={{borderTop: `4px solid ${card.color}`}}>
                <div style={{fontSize:'35px'}}>{card.icon}</div>
                <h4 className="fw-bold" style={{color: card.color}}>{card.value}</h4>
                <p className="text-muted mb-0 small">{card.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}>📊 Overview</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}>🎟️ Bookings ({bookings.length})</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'movies' ? 'active' : ''}`}
              onClick={() => setActiveTab('movies')}>🎬 Movies ({movies.length})</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'screens' ? 'active' : ''}`}
              onClick={() => setActiveTab('screens')}>🎭 Screens ({screens.length})</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'showtimes' ? 'active' : ''}`}
              onClick={() => setActiveTab('showtimes')}>🕐 Show Times ({showTimes.length})</button>
          </li>
        </ul>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <h5 className="mb-3">📊 Today's Activity</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="card shadow p-3 mb-3">
                  <h6 className="fw-bold">🎟️ Today's Bookings</h6>
                  {todayBookings.length === 0 ? (
                    <p className="text-muted">No bookings today!</p>
                  ) : todayBookings.slice(0, 5).map(b => (
                    <div key={b.id} className="d-flex justify-content-between border-bottom py-2">
                      <span>{b.movieName || b.movieTitle}</span>
                      <span className="text-success">₹{b.totalAmount}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <div className="card shadow p-3 mb-3">
                  <h6 className="fw-bold">🎭 Screen Status</h6>
                  {screens.map(screen => (
                    <div key={screen.id} className="d-flex justify-content-between border-bottom py-2">
                      <span>{screen.name}</span>
                      <span className="badge" style={{
                        backgroundColor: screen.type === 'IMAX' ? '#e50914' :
                          screen.type === 'DOLBY' ? '#27ae60' : '#7f8c8d'
                      }}>{screen.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Movie</th>
                <th>Customer</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id}>
                  <td>{i+1}</td>
                  <td>{b.movieName || b.movieTitle}</td>
                  <td>{b.userEmail}</td>
                  <td>{b.seatNumbers}</td>
                  <td>₹{b.totalAmount}</td>
                  <td><span className={`badge ${b.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>{b.status}</span></td>
                  <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* MOVIES TAB */}
        {activeTab === 'movies' && (
          <table className="table table-striped">
            <thead className="table-dark">
              <tr><th>#</th><th>Title</th><th>Genre</th><th>Language</th><th>Rating</th><th>Status</th></tr>
            </thead>
            <tbody>
              {movies.map((m, i) => (
                <tr key={m.id}>
                  <td>{i+1}</td>
                  <td>{m.title}</td>
                  <td>{m.genre}</td>
                  <td>{m.language}</td>
                  <td>⭐{m.rating}</td>
                  <td><span className={`badge ${m.status === 'ACTIVE' ? 'bg-success' : m.status === 'UPCOMING' ? 'bg-primary' : 'bg-secondary'}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* SCREENS TAB */}
        {activeTab === 'screens' && (
          <div className="row">
            {screens.map(screen => (
              <div className="col-md-4 mb-3" key={screen.id}>
                <div className="card shadow p-3">
                  <h6 className="fw-bold">{screen.name}</h6>
                  <span className="badge mb-2" style={{
                    backgroundColor: screen.type === 'IMAX' ? '#e50914' :
                      screen.type === 'DOLBY' ? '#27ae60' : '#7f8c8d',
                    width:'fit-content'
                  }}>{screen.type}</span>
                  <p className="mb-1 small">🪑 Seats: {screen.totalSeats}</p>
                  <p className="mb-1 small">✨ {screen.facilities}</p>
                  <p className="mb-0 small">💰 Price: x{screen.priceMultiplier}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SHOW TIMES TAB */}
        {activeTab === 'showtimes' && (
          <table className="table table-striped">
            <thead className="table-dark">
              <tr><th>#</th><th>Movie</th><th>Screen</th><th>Date</th><th>Start</th><th>End</th><th>Available Seats</th></tr>
            </thead>
            <tbody>
              {showTimes.map((st, i) => (
                <tr key={st.id}>
                  <td>{i+1}</td>
                  <td>{st.movieTitle}</td>
                  <td>{st.screenName}</td>
                  <td>{st.showDate}</td>
                  <td>{st.startTime}</td>
                  <td>{st.endTime}</td>
                  <td>{st.availableSeats}/{st.totalSeats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;