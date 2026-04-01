import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:8081';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/users/login`, { email, password });
      const data = res.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        email: data.email,
        name: data.name,
        role: data.role
      }));
      if (data.role === 'ADMIN') navigate('/admin');
      else if (data.role === 'MANAGER') navigate('/manager');
      else if (data.role === 'TICKET_AGENT') navigate('/manager');
      else navigate('/customer');
    } catch (err) {
      setError(typeof err.response?.data === 'string' ? err.response?.data : 'Invalid email or password!');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:'100vh', backgroundColor:'#1a1a2e',
      display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div className="card shadow-lg" style={{width:'400px', borderRadius:'16px', overflow:'hidden'}}>
        <div style={{backgroundColor:'#e50914', padding:'30px', textAlign:'center'}}>
          <h2 style={{color:'white', fontWeight:'bold', margin:0}}>🎬 CineSync</h2>
          <p style={{color:'rgba(255,255,255,0.8)', margin:0}}>Your Ultimate Movie Experience</p>
        </div>
        <div className="card-body p-4">
          <h5 className="text-center mb-4 fw-bold">Welcome Back!</h5>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-bold">📧 Email</label>
              <input type="email" className="form-control" placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">🔒 Password</label>
              <input type="password" className="form-control" placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-danger w-100 fw-bold py-2" disabled={loading}>
              {loading ? '⏳ Logging in...' : '🎬 Login'}
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-muted">Don't have an account?
              <span className="text-danger fw-bold" style={{cursor:'pointer'}}
                onClick={() => navigate('/register')}> Register here</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;