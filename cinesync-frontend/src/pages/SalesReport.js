import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BOOKING_API = 'http://localhost:8083';
const PAYMENT_API = 'http://localhost:8084';

function SalesReport() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookRes, payRes] = await Promise.all([
        axios.get(`${BOOKING_API}/api/bookings`),
        axios.get(`${PAYMENT_API}/api/payments`)
      ]);
      setBookings(bookRes.data);
      setPayments(payRes.data);
    } catch (err) { console.error(err); }
  };

  const getFilteredBookings = () => {
    const now = new Date(selectedDate);
    return bookings.filter(b => {
      if (!b.bookingDate) return false;
      const bookDate = new Date(b.bookingDate);
      if (filter === 'daily') {
        return bookDate.toDateString() === now.toDateString();
      } else if (filter === 'weekly') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return bookDate >= weekAgo && bookDate <= now;
      } else if (filter === 'monthly') {
        return bookDate.getMonth() === now.getMonth() &&
               bookDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredBookings = getFilteredBookings();
  const confirmedBookings = filteredBookings.filter(b => b.status === 'CONFIRMED');
  const cancelledBookings = filteredBookings.filter(b => b.status === 'CANCELLED');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalTickets = confirmedBookings.reduce((sum, b) => sum + (b.seatsBooked || 0), 0);

  // Chart data - last 7 days
  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayBookings = bookings.filter(b => {
        if (!b.bookingDate) return false;
        const bookDate = new Date(b.bookingDate);
        return bookDate.toDateString() === date.toDateString() && b.status === 'CONFIRMED';
      });
      const revenue = dayBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      days.push({
        label: date.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'}),
        revenue,
        tickets: dayBookings.reduce((sum, b) => sum + (b.seatsBooked || 0), 0),
        count: dayBookings.length
      });
    }
    return days;
  };

  const chartData = getLast7DaysData();
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  // Movie wise sales
  const movieSales = confirmedBookings.reduce((acc, b) => {
    const title = b.movieName || b.movieTitle || 'Unknown';
    if (!acc[title]) acc[title] = { tickets: 0, revenue: 0, count: 0 };
    acc[title].tickets += b.seatsBooked || 0;
    acc[title].revenue += b.totalAmount || 0;
    acc[title].count += 1;
    return acc;
  }, {});

  return (
    <div>
      <nav className="navbar navbar-dark" style={{backgroundColor:'#e50914'}}>
        <div className="container">
          <span className="navbar-brand fw-bold">📊 Sales Report</span>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/admin')}>Back</button>
        </div>
      </nav>

      <div className="container mt-4">

        {/* Filter */}
        <div className="d-flex gap-3 mb-4 align-items-center flex-wrap">
          {['daily', 'weekly', 'monthly'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilter(f)}>
              {f === 'daily' ? '📅 Daily' : f === 'weekly' ? '📆 Weekly' : '🗓️ Monthly'}
            </button>
          ))}
          <input type="date" className="form-control" style={{maxWidth:'180px'}}
            value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          {[
            { title: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: '💰', color: '#27ae60' },
            { title: 'Tickets Sold', value: totalTickets, icon: '🎟️', color: '#2980b9' },
            { title: 'Bookings', value: confirmedBookings.length, icon: '✅', color: '#8e44ad' },
            { title: 'Cancellations', value: cancelledBookings.length, icon: '❌', color: '#e74c3c' },
          ].map((card, i) => (
            <div className="col-md-3 mb-3" key={i}>
              <div className="card shadow text-center p-3" style={{borderTop: `4px solid ${card.color}`}}>
                <div style={{fontSize:'40px'}}>{card.icon}</div>
                <h4 className="fw-bold" style={{color: card.color}}>{card.value}</h4>
                <p className="text-muted mb-0">{card.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bar Chart - Last 7 Days */}
        <div className="card shadow p-4 mb-4">
          <h5 className="fw-bold mb-4">📊 Revenue - Last 7 Days</h5>
          <div className="d-flex align-items-end gap-2" style={{height:'200px'}}>
            {chartData.map((day, i) => (
              <div key={i} className="d-flex flex-column align-items-center flex-grow-1">
                <small className="text-muted mb-1">₹{day.revenue.toFixed(0)}</small>
                <div style={{
                  width:'100%',
                  height: `${(day.revenue / maxRevenue) * 150}px`,
                  backgroundColor: day.revenue > 0 ? '#e50914' : '#dee2e6',
                  borderRadius:'4px 4px 0 0',
                  minHeight:'4px',
                  transition:'all 0.3s'
                }} title={`${day.label}: ₹${day.revenue}`}></div>
                <small className="text-muted mt-1" style={{fontSize:'10px', textAlign:'center'}}>{day.label}</small>
                <small style={{fontSize:'10px', color:'#2980b9'}}>{day.tickets} tickets</small>
              </div>
            ))}
          </div>
        </div>

        {/* Movie wise Sales */}
        <div className="card shadow p-4 mb-4">
          <h5 className="fw-bold mb-3">🎬 Movie-wise Sales</h5>
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Movie</th>
                <th>Bookings</th>
                <th>Tickets Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(movieSales).length === 0 ? (
                <tr><td colSpan="4" className="text-center">No sales data!</td></tr>
              ) : Object.entries(movieSales).map(([title, data], i) => (
                <tr key={i}>
                  <td>🎬 {title}</td>
                  <td>{data.count}</td>
                  <td>🎟️ {data.tickets}</td>
                  <td className="text-success fw-bold">₹{data.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Bookings */}
        <div className="card shadow p-4">
          <h5 className="fw-bold mb-3">🎟️ Recent Bookings</h5>
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Movie</th>
                <th>Customer</th>
                <th>Seats</th>
                <th>Tickets</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr><td colSpan="8" className="text-center">No bookings found!</td></tr>
              ) : filteredBookings.slice(0, 20).map((b, i) => (
                <tr key={b.id}>
                  <td>{i+1}</td>
                  <td>{b.movieName || b.movieTitle}</td>
                  <td>{b.userEmail}</td>
                  <td>{b.seatNumbers}</td>
                  <td>{b.seatsBooked}</td>
                  <td className="text-success">₹{b.totalAmount}</td>
                  <td>
                    <span className={`badge ${b.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalesReport;