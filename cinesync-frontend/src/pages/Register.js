import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:8081';

function Register() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '', role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/users/register`, form);
      setSuccess('Registered successfully! Please login.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Registration failed! Email may already exist.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4" style={{color:'#e50914'}}>🎬 CineSync</h2>
              <h5 className="text-center mb-4">Register</h5>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label>Full Name</label>
                  <input type="text" className="form-control" name="fullName"
                    value={form.fullName} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input type="email" className="form-control" name="email"
                    value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input type="password" className="form-control" name="password"
                    value={form.password} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Phone</label>
                  <input type="text" className="form-control" name="phone"
                    value={form.phone} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label>Role</label>
                  <select className="form-control" name="role"
                    value={form.role} onChange={handleChange}>
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-danger w-100">Register</button>
              </form>
              <p className="text-center mt-3">
                Already have account? <Link to="/">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
