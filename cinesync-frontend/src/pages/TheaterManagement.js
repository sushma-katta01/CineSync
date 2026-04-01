import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8083';

function TheaterManagement() {
  const [theaters, setTheaters] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', totalSeats: '', facilities: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchTheaters(); }, []);

  const fetchTheaters = async () => {
    try {
      const res = await fetch(`${API}/api/theaters`);
      if (res.ok) { const data = await res.json(); setTheaters(data); }
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/theaters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) { setMessage('Theater added successfully!'); setForm({ name: '', location: '', totalSeats: '', facilities: '' }); fetchTheaters(); }
      else { setMessage('Failed to add theater!'); }
    } catch (err) { setMessage('Error: ' + err.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this theater?')) {
      await fetch(`${API}/api/theaters/${id}`, { method: 'DELETE' });
      fetchTheaters();
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark" style={{backgroundColor:'#e50914'}}>
        <div className="container">
          <span className="navbar-brand">🏛️ Theater Management</span>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/admin')}>Back</button>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow p-3">
              <h5>➕ Add Theater</h5>
              {message && <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
              <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" placeholder="Theater Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                <input className="form-control mb-2" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
                <input className="form-control mb-2" placeholder="Total Seats" type="number" value={form.totalSeats} onChange={e => setForm({...form, totalSeats: e.target.value})} required />
                <input className="form-control mb-2" placeholder="Facilities (AC, Parking etc)" value={form.facilities} onChange={e => setForm({...form, facilities: e.target.value})} />
                <button className="btn btn-danger w-100">➕ Add Theater</button>
              </form>
            </div>
          </div>
          <div className="col-md-8">
            <h5>All Theaters ({theaters.length})</h5>
            <table className="table table-striped">
              <thead className="table-dark">
                <tr><th>#</th><th>Name</th><th>Location</th><th>Seats</th><th>Facilities</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {theaters.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i+1}</td>
                    <td>{t.name}</td>
                    <td>{t.location}</td>
                    <td>{t.totalSeats}</td>
                    <td>{t.facilities}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>🗑️ Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TheaterManagement;