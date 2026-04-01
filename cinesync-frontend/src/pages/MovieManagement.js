import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8082';

function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', genre: '', language: '',
    duration: '', rating: '', releaseDate: '', status: 'ACTIVE',
    imageUrl: '', trailerUrl: '', featured: false
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch(`${API}/api/movies`);
      const data = await res.json();
      setMovies(data);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await fetch(`${API}/api/movies/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) { setMessage('Movie updated successfully!'); setEditId(null); }
        else { setMessage('Failed! Status: ' + res.status); }
      } else {
        const res = await fetch(`${API}/api/movies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) { setMessage('Movie added successfully!'); }
        else { setMessage('Failed to add movie!'); }
      }
      setForm({ title: '', description: '', genre: '', language: '',
        duration: '', rating: '', releaseDate: '', status: 'ACTIVE',
        imageUrl: '', trailerUrl: '', featured: false });
      fetchMovies();
    } catch (err) { setMessage('Error: ' + err.message); }
  };

  const handleEdit = (movie) => {
    setEditId(movie.id);
    setForm({
      title: movie.title || '',
      description: movie.description || '',
      genre: movie.genre || '',
      language: movie.language || '',
      duration: movie.duration || '',
      rating: movie.rating || '',
      releaseDate: movie.releaseDate || '',
      status: movie.status || 'ACTIVE',
      imageUrl: movie.imageUrl || '',
      trailerUrl: movie.trailerUrl || '',
      featured: movie.featured || false
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this movie?')) {
      await fetch(`${API}/api/movies/${id}`, { method: 'DELETE' });
      fetchMovies();
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: '', description: '', genre: '', language: '',
      duration: '', rating: '', releaseDate: '', status: 'ACTIVE',
      imageUrl: '', trailerUrl: '', featured: false });
  };

  const filteredMovies = filter === 'ALL' ? movies : movies.filter(m => m.status === filter);

  return (
    <div>
      <nav className="navbar navbar-dark" style={{backgroundColor:'#e50914'}}>
        <div className="container">
          <span className="navbar-brand">🎬 Movie Management</span>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/admin')}>Back</button>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow p-3">
              <h5>{editId ? '✏️ Edit Movie' : '➕ Add Movie'}</h5>
              {message && <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} py-2`}>{message}</div>}
              <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" placeholder="Title" name="title" value={form.title} onChange={handleChange} required />
                <input className="form-control mb-2" placeholder="Description" name="description" value={form.description} onChange={handleChange} />
                <input className="form-control mb-2" placeholder="Genre" name="genre" value={form.genre} onChange={handleChange} />
                <input className="form-control mb-2" placeholder="Language" name="language" value={form.language} onChange={handleChange} />
                <input className="form-control mb-2" placeholder="Duration (mins)" name="duration" type="number" value={form.duration} onChange={handleChange} />
                <input className="form-control mb-2" placeholder="Rating" name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} />
                <input className="form-control mb-2" type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} />
                <input className="form-control mb-2" placeholder="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
                <input className="form-control mb-2" placeholder="Trailer URL (YouTube)" name="trailerUrl" value={form.trailerUrl} onChange={handleChange} />
                <select className="form-control mb-2" name="status" value={form.status} onChange={handleChange}>
                  <option value="ACTIVE">🟢 Now Showing</option>
                  <option value="UPCOMING">🔵 Upcoming</option>
                  <option value="INACTIVE">🔴 Inactive</option>
                </select>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" name="featured"
                    checked={form.featured} onChange={handleChange} id="featured" />
                  <label className="form-check-label" htmlFor="featured">
                    ⭐ Featured (Show as Popup)
                  </label>
                </div>
                <button className="btn btn-danger w-100 mb-2">
                  {editId ? '✏️ Update Movie' : '➕ Add Movie'}
                </button>
                {editId && <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>❌ Cancel</button>}
              </form>
            </div>
          </div>
          <div className="col-md-8">
            {/* Filter Tabs */}
            <div className="d-flex gap-2 mb-3">
              {['ALL', 'ACTIVE', 'UPCOMING', 'INACTIVE'].map(f => (
                <button key={f} className={`btn btn-sm ${filter === f ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setFilter(f)}>
                  {f === 'ALL' ? '🎬 All' : f === 'ACTIVE' ? '🟢 Now Showing' : f === 'UPCOMING' ? '🔵 Upcoming' : '🔴 Inactive'}
                  ({f === 'ALL' ? movies.length : movies.filter(m => m.status === f).length})
                </button>
              ))}
            </div>
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td>
                      {m.imageUrl ?
                        <img src={m.imageUrl} alt={m.title}
                          style={{width:'40px', height:'55px', objectFit:'cover'}} /> :
                        <span>🎬</span>}
                    </td>
                    <td>{m.title}</td>
                    <td>{m.genre}</td>
                    <td>⭐{m.rating}</td>
                    <td>
                      <span className={`badge ${m.status === 'ACTIVE' ? 'bg-success' : m.status === 'UPCOMING' ? 'bg-primary' : 'bg-secondary'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>{m.featured ? '⭐' : ''}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(m)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>🗑️</button>
                    </td>
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

export default MovieManagement;