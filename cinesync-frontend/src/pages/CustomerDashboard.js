import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MOVIE_API = 'http://localhost:8082';
const BOOKING_API = 'http://localhost:8083';

const movieColors = [
  '#e50914', '#0066cc', '#00aa44', '#ff6600',
  '#9900cc', '#cc0066', '#00aacc', '#aa6600',
  '#006633', '#cc3300'
];

function CustomerDashboard() {
  const [movies, setMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('movies');
  const [cancelMsg, setCancelMsg] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchMovies();
    fetchUpcoming();
    fetchBookings();
    fetchFeatured();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${MOVIE_API}/api/movies/now-showing`);
      setMovies(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUpcoming = async () => {
    try {
      const res = await axios.get(`${MOVIE_API}/api/movies/upcoming`);
      setUpcomingMovies(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchFeatured = async () => {
    try {
      const res = await axios.get(`${MOVIE_API}/api/movies/featured`);
      if (res.data.length > 0) {
        setFeaturedMovie(res.data[0]);
        setShowPopup(true);
      }
    } catch (err) { console.error(err); }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${BOOKING_API}/api/bookings`);
      const userBookings = res.data.filter(b => b.userEmail === user?.email);
      setBookings(userBookings);
    } catch (err) { console.error(err); }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`${BOOKING_API}/api/bookings/${bookingId}/cancel`);
        setCancelMsg('Booking cancelled! Refund will be processed in 3-5 days.');
        fetchBookings();
      } catch (err) { setCancelMsg('Failed to cancel booking!'); }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{backgroundColor:'#f8f9fa', minHeight:'100vh'}}>

      {/* Featured Movie Popup */}
      {showPopup && featuredMovie && (
        <div style={{
          position:'fixed', top:0, left:0, width:'100%', height:'100%',
          backgroundColor:'rgba(0,0,0,0.8)', zIndex:9999,
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <div className="card" style={{maxWidth:'500px', width:'90%', borderRadius:'16px', overflow:'hidden'}}>
            {featuredMovie.imageUrl && (
              <img src={featuredMovie.imageUrl} alt={featuredMovie.title}
                style={{width:'100%', height:'250px', objectFit:'cover'}} />
            )}
            <div className="card-body text-center p-4">
              <div className="badge bg-warning text-dark mb-2">⭐ Featured Movie</div>
              <h4 className="fw-bold">{featuredMovie.title}</h4>
              <p className="text-muted">{featuredMovie.genre} | {featuredMovie.language} | ⭐ {featuredMovie.rating}/10</p>
              <p className="text-muted small">{featuredMovie.description}</p>
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-danger px-4"
                  onClick={() => { setShowPopup(false); navigate('/booking', { state: { movie: featuredMovie } }); }}>
                  🎟️ Book Now
                </button>
                <button className="btn btn-outline-secondary" onClick={() => setShowPopup(false)}>
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="navbar navbar-dark" style={{backgroundColor:'#e50914'}}>
        <div className="container">
          <span className="navbar-brand fw-bold">🎬 CineSync</span>
          <div>
            <span className="text-white me-3">👤 {user?.email}</span>
            <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {cancelMsg && <div className="alert alert-info">{cancelMsg}</div>}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'movies' ? 'active' : ''}`}
              onClick={() => setActiveTab('movies')}>🎬 Now Showing ({movies.length})</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}>🔵 Upcoming ({upcomingMovies.length})</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}>🎟️ My Bookings ({bookings.length})</button>
          </li>
        </ul>

        {/* NOW SHOWING TAB */}
        {activeTab === 'movies' && (
          <div className="row">
            {movies.length === 0 ? (
              <div className="text-center py-5">
                <div style={{fontSize:'60px'}}>🎬</div>
                <h5 className="text-muted">No movies showing now!</h5>
              </div>
            ) : movies.map((movie, index) => (
              <div className="col-md-3 mb-4" key={movie.id}>
                <div className="card shadow h-100" style={{borderRadius:'10px', overflow:'hidden', border:'none'}}>
                  {movie.imageUrl ? (
                    <img src={movie.imageUrl} alt={movie.title}
                      style={{width:'100%', height:'300px', objectFit:'cover'}}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                  ) : null}
                  <div style={{
                    width:'100%', height:'300px',
                    backgroundColor: movieColors[index % movieColors.length],
                    display: movie.imageUrl ? 'none' : 'flex',
                    flexDirection:'column', alignItems:'center',
                    justifyContent:'center', color:'white', padding:'20px', textAlign:'center'
                  }}>
                    <div style={{fontSize:'60px'}}>🎬</div>
                    <h4 style={{marginTop:'10px', fontWeight:'bold'}}>{movie.title}</h4>
                  </div>
                  <div className="card-body text-center">
                    <h5 className="fw-bold">{movie.title}</h5>
                    <span className="badge bg-danger mb-2">{movie.genre}</span>
                    {movie.featured && <span className="badge bg-warning text-dark ms-1 mb-2">⭐ Featured</span>}
                    <p className="text-muted small mb-1">⏱ {movie.duration} mins | ⭐ {movie.rating}/10</p>
                    <p className="text-muted small mb-2">{movie.language}</p>
                    <button className="btn btn-danger w-100 fw-bold"
                      onClick={() => navigate('/booking', { state: { movie } })}>
                      🎟️ Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* UPCOMING TAB */}
        {activeTab === 'upcoming' && (
          <div className="row">
            {upcomingMovies.length === 0 ? (
              <div className="text-center py-5">
                <div style={{fontSize:'60px'}}>🔵</div>
                <h5 className="text-muted">No upcoming movies!</h5>
              </div>
            ) : upcomingMovies.map((movie, index) => (
              <div className="col-md-3 mb-4" key={movie.id}>
                <div className="card shadow h-100" style={{borderRadius:'10px', overflow:'hidden', border:'2px solid #0066cc'}}>
                  {movie.imageUrl ? (
                    <img src={movie.imageUrl} alt={movie.title}
                      style={{width:'100%', height:'300px', objectFit:'cover'}} />
                  ) : (
                    <div style={{
                      width:'100%', height:'300px',
                      backgroundColor: movieColors[index % movieColors.length],
                      display:'flex', flexDirection:'column',
                      alignItems:'center', justifyContent:'center',
                      color:'white', padding:'20px', textAlign:'center'
                    }}>
                      <div style={{fontSize:'60px'}}>🎬</div>
                      <h4 style={{marginTop:'10px', fontWeight:'bold'}}>{movie.title}</h4>
                    </div>
                  )}
                  <div className="card-body text-center">
                    <span className="badge bg-primary mb-2">🔵 Upcoming</span>
                    <h5 className="fw-bold">{movie.title}</h5>
                    <p className="text-muted small mb-1">{movie.genre} | {movie.language}</p>
                    <p className="text-muted small mb-1">⏱ {movie.duration} mins</p>
                    <p className="text-muted small mb-2">📅 Release: {movie.releaseDate}</p>
                    <button className="btn btn-outline-primary w-100 fw-bold" disabled>
                      🔔 Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div>
            <h5 className="mb-3">🎟️ My Booking History</h5>
            {bookings.length === 0 ? (
              <div className="text-center py-5">
                <div style={{fontSize:'60px'}}>🎬</div>
                <h5 className="text-muted">No bookings yet!</h5>
                <button className="btn btn-danger" onClick={() => setActiveTab('movies')}>Browse Movies</button>
              </div>
            ) : (
              <div className="row">
                {bookings.map(booking => (
                  <div className="col-md-6 mb-4" key={booking.id}>
                    <div className="card shadow" style={{
                      borderLeft: `4px solid ${booking.status === 'CONFIRMED' ? '#27ae60' : '#e74c3c'}`
                    }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <h6 className="fw-bold">🎬 {booking.movieName || booking.movieTitle}</h6>
                          <span className={`badge ${booking.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="mb-1 small">🎫 Booking ID: <strong>#{booking.id}</strong></p>
                        <p className="mb-1 small">🎭 Screen: {booking.theaterName}</p>
                        <p className="mb-1 small">📅 Date: {booking.showDate}</p>
                        <p className="mb-1 small">⏰ Time: {booking.showTime}</p>
                        <p className="mb-1 small">🪑 Seats: <strong>{booking.seatNumbers}</strong></p>
                        <p className="mb-1 small">👥 Count: {booking.seatsBooked} seats</p>
                        <p className="mb-2 small">💰 Total: <strong className="text-danger">₹{booking.totalAmount}</strong></p>
                        {booking.status === 'CONFIRMED' && (
                          <div className="d-flex align-items-center gap-3">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=CINESYNC-${booking.id}-${booking.seatNumbers}`}
                              alt="QR" style={{width:'80px', height:'80px', borderRadius:'4px'}} />
                            <div>
                              <small className="text-muted">Scan QR at entrance</small>
                              <br/>
                              <button className="btn btn-danger btn-sm mt-1"
                                onClick={() => handleCancel(booking.id)}>
                                ❌ Cancel Booking
                              </button>
                            </div>
                          </div>
                        )}
                        {booking.status === 'CANCELLED' && (
                          <p className="text-danger small mt-2">
                            ⚠️ Refund will be processed in 3-5 business days
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;