import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BOOKING_API = 'http://localhost:8083';
const PAYMENT_API = 'http://localhost:8084';
const TAX_RATE = 0.08;

const ROWS = [
  { label: 'A', seats: 10, type: 'PREMIUM' },
  { label: 'B', seats: 10, type: 'PREMIUM' },
  { label: 'C', seats: 12, type: 'NORMAL' },
  { label: 'D', seats: 12, type: 'NORMAL' },
  { label: 'E', seats: 12, type: 'NORMAL' },
  { label: 'F', seats: 12, type: 'NORMAL' },
  { label: 'G', seats: 14, type: 'ECONOMY' },
  { label: 'H', seats: 14, type: 'ECONOMY' },
  { label: 'PH', seats: 6, type: 'PHYSICALLY_CHALLENGED' },
];

const ROW_PRICE_MULTIPLIER = {
  PREMIUM: 1.5,
  NORMAL: 1.0,
  ECONOMY: 0.7,
  PHYSICALLY_CHALLENGED: 0.5,
};

function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const movie = state?.movie;
  const user = JSON.parse(localStorage.getItem('user'));

  const [step, setStep] = useState(1);
  const [showTimes, setShowTimes] = useState([]);
  const [selectedShowTime, setSelectedShowTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie) fetchShowTimes();
  }, [movie, selectedDate]);

  const fetchShowTimes = async () => {
    try {
      const res = await axios.get(`${BOOKING_API}/api/showtimes/movie/${movie.id}/date/${selectedDate}`);
      setShowTimes(res.data);
    } catch (err) {
      console.error(err);
      setShowTimes([]);
    }
  };

  const fetchBookedSeats = async (showTimeId) => {
    try {
      const res = await axios.get(`${BOOKING_API}/api/bookings`);
      const booked = res.data
        .filter(b => b.showTimeId == showTimeId && b.status === 'CONFIRMED')
        .flatMap(b => b.seatNumbers ? b.seatNumbers.split(',') : []);
      setBookedSeats(booked);
    } catch (err) { console.error(err); }
  };

  const handleSelectShowTime = (showTime) => {
    setSelectedShowTime(showTime);
    setSelectedSeats([]);
    fetchBookedSeats(showTime.id);
    setStep(2);
  };

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const getSeatPrice = (rowLabel) => {
    const row = ROWS.find(r => r.label === rowLabel);
    const multiplier = ROW_PRICE_MULTIPLIER[row?.type] || 1.0;
    return selectedShowTime ? (selectedShowTime.basePrice * multiplier) : 250;
  };

  const calculateTotal = () => {
    let subtotal = selectedSeats.reduce((sum, seatId) => {
      const rowLabel = seatId.replace(/[0-9]/g, '');
      return sum + getSeatPrice(rowLabel);
    }, 0);
    const tax = subtotal * TAX_RATE;
    return { subtotal, tax, total: subtotal + tax };
  };

  const getSeatColor = (seatId, type) => {
    if (bookedSeats.includes(seatId)) return '#e74c3c';
    if (selectedSeats.includes(seatId)) return '#27ae60';
    if (type === 'PREMIUM') return '#8e44ad';
    if (type === 'PHYSICALLY_CHALLENGED') return '#2980b9';
    if (type === 'ECONOMY') return '#f39c12';
    return '#7f8c8d';
  };

  const getScreenColor = (type) => {
    const colors = { IMAX:'#e50914', XD:'#8e44ad', SONY:'#2980b9', DOLBY:'#27ae60', STANDARD:'#7f8c8d' };
    return colors[type] || '#7f8c8d';
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) { alert('Please select at least one seat!'); return; }
    setLoading(true);
    try {
      const { subtotal, tax, total } = calculateTotal();
      const bookingData = {
        userId: user?.id,
        movieId: movie?.id,
        movieName: movie?.title,
        movieTitle: movie?.title,
        userEmail: user?.email,
        showTimeId: selectedShowTime?.id,
        screenId: selectedShowTime?.screenId,
        seatNumbers: selectedSeats.join(','),
        seatsBooked: selectedSeats.length,
        numberOfSeats: selectedSeats.length,
        totalAmount: parseFloat(total.toFixed(2)),
        status: 'CONFIRMED',
        showDate: selectedDate,
        showTime: selectedShowTime?.startTime,
        theaterName: `${selectedShowTime?.screenName} - ${selectedShowTime?.screenType}`
      };

      const res = await axios.post(`${BOOKING_API}/api/bookings`, bookingData);
      setBooking(res.data);

      await axios.post(`${PAYMENT_API}/api/payments`, {
        bookingId: res.data.id,
        userId: user?.id,
        amount: parseFloat(total.toFixed(2)),
        paymentMethod: 'UPI',
        status: 'SUCCESS'
      });

      setStep(4);
    } catch (err) {
      alert('Booking failed! ' + err.message);
    }
    setLoading(false);
  };

  const { subtotal, tax, total } = calculateTotal();

  if (!movie) return <div className="container mt-5"><h3>No movie selected!</h3></div>;

  return (
    <div style={{backgroundColor:'#1a1a2e', minHeight:'100vh', color:'white'}}>
      <nav className="navbar navbar-dark" style={{backgroundColor:'#e50914'}}>
        <div className="container">
          <span className="navbar-brand fw-bold">🎬 CineSync - Book Tickets</span>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/customer')}>← Back</button>
        </div>
      </nav>

      <div className="container mt-4">
        {/* Movie Info */}
        <div className="card mb-4 p-3" style={{backgroundColor:'#16213e', border:'none'}}>
          <div className="row align-items-center">
            <div className="col-md-2">
              {movie.imageUrl && <img src={movie.imageUrl} alt={movie.title}
                style={{width:'100%', borderRadius:'8px', maxHeight:'100px', objectFit:'cover'}} />}
            </div>
            <div className="col-md-10">
              <h4 className="text-white fw-bold">{movie.title}</h4>
              <p className="text-muted mb-0">{movie.genre} | {movie.language} | ⏱ {movie.duration} mins | ⭐ {movie.rating}/10</p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="d-flex justify-content-center mb-4 gap-2">
          {['Select Show', 'Select Seats', 'Confirm', 'Success'].map((s, i) => (
            <div key={i} className="d-flex align-items-center">
              <div style={{
                width:'30px', height:'30px', borderRadius:'50%',
                backgroundColor: step > i + 1 ? '#27ae60' : step === i + 1 ? '#e50914' : '#555',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'12px', fontWeight:'bold'
              }}>{step > i + 1 ? '✓' : i + 1}</div>
              <span className="ms-1 me-2" style={{fontSize:'12px', color: step === i + 1 ? 'white' : '#aaa'}}>{s}</span>
              {i < 3 && <span style={{color:'#555'}}>→</span>}
            </div>
          ))}
        </div>

        {/* STEP 1 - Select Show Time */}
        {step === 1 && (
          <div>
            <h5 className="text-white mb-3">📅 Select Date & Show Time</h5>
            <div className="mb-4">
              <input type="date" className="form-control" style={{maxWidth:'200px'}}
                value={selectedDate} min={new Date().toISOString().split('T')[0]}
                onChange={e => setSelectedDate(e.target.value)} />
            </div>
            {showTimes.length === 0 ? (
              <div className="text-center py-5">
                <div style={{fontSize:'60px'}}>🎭</div>
                <h5 className="text-muted">No shows available for this date!</h5>
                <p className="text-muted">Please ask admin to add show times for this movie.</p>
              </div>
            ) : (
              <div className="row">
                {showTimes.map(st => (
                  <div className="col-md-4 mb-3" key={st.id}>
                    <div className="card p-3 h-100" style={{
                      backgroundColor:'#16213e',
                      border:`2px solid ${getScreenColor(st.screenType)}`,
                      cursor:'pointer'
                    }} onClick={() => handleSelectShowTime(st)}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="badge" style={{backgroundColor: getScreenColor(st.screenType), fontSize:'12px'}}>
                          {st.screenType}
                        </span>
                        <span className="text-success fw-bold">{st.availableSeats} seats left</span>
                      </div>
                      <h6 className="text-white">{st.screenName}</h6>
                      <p className="text-warning fw-bold mb-1">🕐 {st.startTime} - {st.endTime}</p>
                      <p className="text-muted small mb-1">💰 Base Price: ₹{st.basePrice}</p>
                      <button className="btn btn-sm w-100 mt-2" style={{backgroundColor: getScreenColor(st.screenType), color:'white'}}>
                        Select →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2 - Select Seats */}
        {step === 2 && selectedShowTime && (
          <div>
            <div className="d-flex justify-content-between mb-3">
              <h5 className="text-white">🪑 Select Your Seats</h5>
              <button className="btn btn-sm btn-outline-light" onClick={() => setStep(1)}>← Change Show</button>
            </div>

            {/* Show info bar */}
            <div className="card p-2 mb-4" style={{backgroundColor:'#16213e'}}>
              <div className="d-flex gap-4 flex-wrap">
                <span className="text-white">🎭 {selectedShowTime.screenName}</span>
                <span className="badge" style={{backgroundColor: getScreenColor(selectedShowTime.screenType)}}>{selectedShowTime.screenType}</span>
                <span className="text-warning">🕐 {selectedShowTime.startTime} - {selectedShowTime.endTime}</span>
                <span className="text-muted">📅 {selectedDate}</span>
              </div>
            </div>

            {/* Screen */}
            <div className="text-center mb-4">
              <div style={{background:'linear-gradient(to bottom, #fff, #ccc)',
                height:'8px', borderRadius:'4px', margin:'0 auto 8px',
                width:'70%', boxShadow:'0 4px 15px rgba(255,255,255,0.5)'}}></div>
              <small className="text-muted">◀ ── SCREEN ── ▶</small>
            </div>

            {/* Legend */}
            <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
              {[
                {color:'#8e44ad', label:`Premium ₹${(selectedShowTime.basePrice * 1.5).toFixed(0)}`},
                {color:'#7f8c8d', label:`Normal ₹${selectedShowTime.basePrice}`},
                {color:'#f39c12', label:`Economy ₹${(selectedShowTime.basePrice * 0.7).toFixed(0)}`},
                {color:'#2980b9', label:`PH ₹${(selectedShowTime.basePrice * 0.5).toFixed(0)}`},
                {color:'#27ae60', label:'Selected'},
                {color:'#e74c3c', label:'Booked'},
              ].map((item, i) => (
                <div key={i} className="d-flex align-items-center gap-1">
                  <div style={{width:'16px', height:'16px', backgroundColor:item.color, borderRadius:'3px'}}></div>
                  <small className="text-white">{item.label}</small>
                </div>
              ))}
            </div>

            {/* Seat Layout */}
            <div className="text-center">
              {ROWS.map(row => (
                <div key={row.label} className="d-flex justify-content-center align-items-center mb-2 gap-1">
                  <span style={{width:'35px', color:'#aaa', fontSize:'11px', textAlign:'right'}}>
                    {row.label === 'PH' ? '♿' : row.label}
                  </span>
                  <div className="d-flex gap-1 flex-wrap justify-content-center">
                    {Array.from({length: row.seats}, (_, i) => {
                      const seatId = `${row.label}${i + 1}`;
                      return (
                        <div key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          title={`${seatId} - ₹${getSeatPrice(row.label).toFixed(0)}`}
                          style={{
                            width:'28px', height:'26px',
                            backgroundColor: getSeatColor(seatId, row.type),
                            borderRadius:'4px 4px 0 0',
                            cursor: bookedSeats.includes(seatId) ? 'not-allowed' : 'pointer',
                            fontSize:'9px', display:'flex',
                            alignItems:'center', justifyContent:'center',
                            color:'white', fontWeight:'bold',
                            border: selectedSeats.includes(seatId) ? '2px solid #fff' : 'none',
                            transition:'all 0.2s',
                            opacity: bookedSeats.includes(seatId) ? 0.5 : 1
                          }}>
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                  <span style={{width:'35px', color:'#aaa', fontSize:'11px'}}>{row.label}</span>
                </div>
              ))}
            </div>

            {/* Summary */}
            {selectedSeats.length > 0 && (
              <div className="card mt-4 p-3" style={{backgroundColor:'#16213e', border:'1px solid #e50914'}}>
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <p className="text-white mb-1">🎟️ Selected: <strong>{selectedSeats.join(', ')}</strong></p>
                    <p className="text-white mb-1">Subtotal: ₹{subtotal.toFixed(2)} | Tax (8%): ₹{tax.toFixed(2)}</p>
                    <h5 className="text-warning mb-0">Total: ₹{total.toFixed(2)}</h5>
                  </div>
                  <div className="col-md-4">
                    <button className="btn btn-danger btn-lg w-100" onClick={() => setStep(3)}>
                      Proceed →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 - Confirm */}
        {step === 3 && (
          <div className="card p-4" style={{backgroundColor:'#16213e', border:'1px solid #e50914'}}>
            <h4 className="text-white mb-4">💳 Confirm Booking</h4>
            <div className="row">
              <div className="col-md-5">
                {movie.imageUrl && <img src={movie.imageUrl} alt={movie.title}
                  style={{width:'100%', borderRadius:'8px', maxHeight:'250px', objectFit:'cover'}} />}
              </div>
              <div className="col-md-7">
                <table className="table table-dark">
                  <tbody>
                    <tr><td>🎬 Movie</td><td><strong>{movie.title}</strong></td></tr>
                    <tr><td>🎭 Screen</td><td>{selectedShowTime?.screenName} ({selectedShowTime?.screenType})</td></tr>
                    <tr><td>📅 Date</td><td>{selectedDate}</td></tr>
                    <tr><td>⏰ Time</td><td>{selectedShowTime?.startTime} - {selectedShowTime?.endTime}</td></tr>
                    <tr><td>🎟️ Seats</td><td><strong>{selectedSeats.join(', ')}</strong></td></tr>
                    <tr><td>👥 Count</td><td>{selectedSeats.length} seats</td></tr>
                    <tr><td>💰 Subtotal</td><td>₹{subtotal.toFixed(2)}</td></tr>
                    <tr><td>🧾 Tax (8%)</td><td>₹{tax.toFixed(2)}</td></tr>
                    <tr><td>💵 Total</td><td><strong className="text-warning fs-5">₹{total.toFixed(2)}</strong></td></tr>
                  </tbody>
                </table>
                <p className="text-muted small">📧 Confirmation will be sent to: {user?.email}</p>
                <button className="btn btn-success w-100 mb-2 btn-lg"
                  onClick={handleConfirmBooking} disabled={loading}>
                  {loading ? '⏳ Processing...' : `✅ Confirm & Pay ₹${total.toFixed(2)}`}
                </button>
                <button className="btn btn-secondary w-100" onClick={() => setStep(2)}>← Back</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 - Success */}
        {step === 4 && booking && (
          <div className="text-center card p-5" style={{backgroundColor:'#16213e', border:'2px solid #27ae60'}}>
            <div style={{fontSize:'80px'}}>🎉</div>
            <h2 className="text-success">Booking Confirmed!</h2>
            <p className="text-white">Booking ID: <strong>#{booking.id}</strong></p>
            <div className="card p-3 mt-3" style={{backgroundColor:'#0f3460'}}>
              <div className="row">
                <div className="col-md-8 text-start">
                  <table className="table table-dark">
                    <tbody>
                      <tr><td>🎬 Movie</td><td><strong>{movie.title}</strong></td></tr>
                      <tr><td>🎭 Screen</td><td>{selectedShowTime?.screenName} ({selectedShowTime?.screenType})</td></tr>
                      <tr><td>📅 Date</td><td>{selectedDate}</td></tr>
                      <tr><td>⏰ Time</td><td>{selectedShowTime?.startTime}</td></tr>
                      <tr><td>🎟️ Seats</td><td><strong>{selectedSeats.join(', ')}</strong></td></tr>
                      <tr><td>💰 Total</td><td><strong className="text-warning">₹{total.toFixed(2)}</strong></td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                  <div style={{backgroundColor:'white', padding:'15px', borderRadius:'8px'}}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=CINESYNC|BID:${booking.id}|MOVIE:${movie.title}|SEATS:${selectedSeats.join('-')}|DATE:${selectedDate}|TIME:${selectedShowTime?.startTime}`}
                      alt="QR Code" style={{width:'130px', height:'130px'}} />
                    <p style={{color:'black', fontSize:'10px', textAlign:'center', marginTop:'5px'}}>
                      Scan at entrance 🎬
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-success mt-3">📧 Confirmation email sent to {user?.email}!</p>
            <button className="btn btn-danger btn-lg mt-3" onClick={() => navigate('/customer')}>
              🏠 Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;