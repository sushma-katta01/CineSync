import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const cards = [
    { title: 'Manage Movies', desc: 'Add, Edit, Delete Movies', icon: '🎬', path: '/admin/movies', color: '#e50914' },
    { title: 'Manage Screens', desc: 'Add Screens & Show Times', icon: '🎭', path: '/admin/screens', color: '#8e44ad' },
    { title: 'Bookings', desc: 'View All Bookings', icon: '🎟️', path: '/admin/bookings', color: '#2980b9' },
    { title: 'Payments', desc: 'View All Payments', icon: '💰', path: '/admin/payments', color: '#27ae60' },
    { title: 'Sales Report', desc: 'Daily, Weekly, Monthly Sales', icon: '📊', path: '/admin/sales', color: '#f39c12' },
    { title: 'Staff Management', desc: 'Manage Managers & Agents', icon: '👥', path: '/admin/staff', color: '#2c3e50' },
  ];

  return (
    <div style={{backgroundColor:'#f8f9fa', minHeight:'100vh'}}>
      <nav className="navbar navbar-dark" style={{backgroundColor:'#e50914'}}>
        <div className="container">
          <span className="navbar-brand fw-bold">🎬 CineSync Admin</span>
          <div>
            <span className="text-white me-3">👤 {user?.email}</span>
            <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <h3 className="mb-4 fw-bold">Admin Dashboard</h3>
        <div className="row">
          {cards.map((card, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div className="card shadow text-center p-4 h-100"
                style={{cursor:'pointer', borderRadius:'12px', border:'none',
                  borderTop: `4px solid ${card.color}`,
                  transition:'transform 0.2s'}}
                onClick={() => navigate(card.path)}
                onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>
                <div style={{fontSize:'50px'}}>{card.icon}</div>
                <h5 className="fw-bold mt-2">{card.title}</h5>
                <p className="text-muted">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;