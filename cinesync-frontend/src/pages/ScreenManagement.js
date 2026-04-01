import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8083';

const SCREEN_TYPES = [
  { type: 'IMAX', multiplier: 2.0, color: '#e50914' },
  { type: 'XD', multiplier: 1.8, color: '#8e44ad' },
  { type: 'SONY', multiplier: 1.5, color: '#2980b9' },
  { type: 'DOLBY', multiplier: 1.6, color: '#27ae60' },
  { type: 'STANDARD', multiplier: 1.0, color: '#7f8c8d' },
];

function ScreenManagement() {
  const [screens, setScreens] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('screens');
  const [screenForm, setScreenForm] = useState({
    name: '', type: 'STANDARD', totalSeats: 120, facilities: '', priceMultiplier: 1.0
  });
  const [showTimeForm, setShowTimeForm] = useState({
    movieId: '', movieTitle: '', movieDuration: '',
    screenId: '', showDate: '', startTime: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchScreens();
    fetchShowTimes();
    fetchMovies();
  }, []);

  const fetchScreens = async () => {
    try {
      const res = await fetch(`${API}/api/screens`);
      if (res.ok) setScreens(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchShowTimes = async () => {
    try {
      const res = await fetch(`${API}/api/showtimes`);
      if (res.ok) setShowTimes(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchMovies = async () => {
    try {
      const res = await fetch('http://localhost:8082/api/movies');
      if (res.ok) setMovies(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleAddScreen = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/screens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(screenForm)
      });
      if (res.ok) {
        setMessage('Screen added successfully!');
        setScreenForm({ name: '', type: 'STANDARD', totalSeats: 120, facilities: '', priceMultiplier: 1.0 });
        fetchScreens();
      }
    } catch (err) { setMessage('Error: ' + err.message); }
  };

  const handleAddShowTime = async (e) => {
    e.preventDefault();
    try {
      const selectedMovie = movies.find(m => m.id == showTimeForm.movieId);
      const data = {
        ...showTimeForm,
        movieTitle: selectedMovie?.title || '',
        movieDuration: selectedMovie?.duration || 120,
      };
      const res = await fetch(`${API}/api/showtimes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setMessage('Show time added successfully!');
        setShowTimeForm({ movieId: '', movieTitle: '', movieDuration: '', screenId: '', showDate: '', startTime: '' });
        fetchShowTimes();
      }
    } catch (err) { setMessage('Error: ' + err.message); }
  };

  const handleDeleteScreen = async (id) => {
    if (window.confirm('Delete this screen?')) {
      await fetch(`${API}/api/screens/${id}`, { method: 'DELETE' });
      fetchScreens();
    }
  };

  const handleDeleteShowTime = async (id) => {
    if (window.confirm('Delete this show time?')) {
      await fetch(`${API}/api/showtimes/${id}`, { method: 'DELETE' });
      fetchShowTimes();
    }
  };

  const getScreenColor = (type) => {
    const screen = SCREEN_TYPES.find(s => s.type === type);
    return screen ? screen.color : '#7f8c8d';
  };

  return (
    <div>
      <nav className="navbar navbar-dark" style={{backgroundColor:'#e50914'}}>
        <div className="container">
          <span className="navbar-brand fw-bold">🎭 Screen & Show Management</span>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/admin')}>Back</button>
        </div>
      </nav>

      <div className="container mt-4">
        {message && <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'screens' ? 'active' : ''}`}
              onClick={() => setActiveTab('screens')}>🎭 Screens ({screens.length})</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'showtimes' ? 'active' : ''}`}
              onClick={() => setActiveTab('showtimes')}>🕐 Show Times ({showTimes.length})</button>
          </li>
        </ul>

        {/* SCREENS TAB */}
        {activeTab === 'screens' && (
          <div className="row">
            <div className="col-md-4">
              <div className="card shadow p-3">
                <h5>➕ Add Screen</h5>
                <form onSubmit={handleAddScreen}>
                  <input className="form-control mb-2" placeholder="Screen Name (e.g. Screen 1)"
                    value={screenForm.name} onChange={e => setScreenForm({...screenForm, name: e.target.value})} required />
                  <select className="form-control mb-2" value={screenForm.type}
                    onChange={e => {
                      const t = SCREEN_TYPES.find(s => s.type === e.target.value);
                      setScreenForm({...screenForm, type: e.target.value, priceMultiplier: t?.multiplier || 1.0});
                    }}>
                    {SCREEN_TYPES.map(s => (
                      <option key={s.type} value={s.type}>{s.type} (x{s.multiplier})</option>
                    ))}
                  </select>
                  <input className="form-control mb-2" placeholder="Total Seats" type="number"
                    value={screenForm.totalSeats} onChange={e => setScreenForm({...screenForm, totalSeats: e.target.value})} />
                  <input className="form-control mb-2" placeholder="Facilities (4K, Recliner, etc)"
                    value={screenForm.facilities} onChange={e => setScreenForm({...screenForm, facilities: e.target.value})} />
                  <button className="btn btn-danger w-100">➕ Add Screen</button>
                </form>
              </div>
            </div>
            <div className="col-md-8">
              <div className="row">
                {screens.map(screen => (
                  <div className="col-md-6 mb-3" key={screen.id}>
                    <div className="card shadow" style={{borderLeft: `4px solid ${getScreenColor(screen.type)}`}}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <h6 className="fw-bold">{screen.name}</h6>
                          <span className="badge" style={{backgroundColor: getScreenColor(screen.type)}}>{screen.type}</span>
                        </div>
                        <p className="mb-1 small">🪑 Seats: {screen.totalSeats}</p>
                        <p className="mb-1 small">💰 Price: x{screen.priceMultiplier}</p>
                        <p className="mb-1 small">✨ {screen.facilities}</p>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteScreen(screen.id)}>🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SHOW TIMES TAB */}
        {activeTab === 'showtimes' && (
          <div className="row">
            <div className="col-md-4">
              <div className="card shadow p-3">
                <h5>➕ Add Show Time</h5>
                <form onSubmit={handleAddShowTime}>
                  <select className="form-control mb-2" value={showTimeForm.movieId}
                    onChange={e => setShowTimeForm({...showTimeForm, movieId: e.target.value})} required>
                    <option value="">Select Movie</option>
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>{m.title} ({m.duration} mins)</option>
                    ))}
                  </select>
                  <select className="form-control mb-2" value={showTimeForm.screenId}
                    onChange={e => setShowTimeForm({...showTimeForm, screenId: e.target.value})} required>
                    <option value="">Select Screen</option>
                    {screens.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - {s.type}</option>
                    ))}
                  </select>
                  <input className="form-control mb-2" type="date"
                    value={showTimeForm.showDate}
                    onChange={e => setShowTimeForm({...showTimeForm, showDate: e.target.value})} required />
                  <input className="form-control mb-2" type="time"
                    value={showTimeForm.startTime}
                    onChange={e => setShowTimeForm({...showTimeForm, startTime: e.target.value})} required />
                  <small className="text-muted">End time calculated automatically based on movie duration + 15 min interval</small>
                  <button className="btn btn-danger w-100 mt-2">➕ Add Show Time</button>
                </form>
              </div>
            </div>
            <div className="col-md-8">
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Movie</th>
                    <th>Screen</th>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Seats</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {showTimes.length === 0 ? (
                    <tr><td colSpan="8" className="text-center">No show times added yet!</td></tr>
                  ) : showTimes.map(st => (
                    <tr key={st.id}>
                      <td>{st.movieTitle}</td>
                      <td><span className="badge" style={{backgroundColor: getScreenColor(st.screenType)}}>{st.screenName}</span></td>
                      <td>{st.showDate}</td>
                      <td>{st.startTime}</td>
                      <td>{st.endTime}</td>
                      <td>{st.availableSeats}/{st.totalSeats}</td>
                      <td>₹{st.basePrice}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteShowTime(st.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScreenManagement;