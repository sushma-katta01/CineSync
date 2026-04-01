import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:8081';

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: 'MANAGER', salary: '', department: ''
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API}/api/users/staff`);
      setStaff(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/api/users/${editId}`, form);
        setMessage('Staff updated successfully!');
        setEditId(null);
      } else {
        await axios.post(`${API}/api/users/staff`, form);
        setMessage('Staff added successfully!');
      }
      setForm({ name: '', email: '', password: '', phone: '',
        role: 'MANAGER', salary: '', department: '' });
      fetchStaff();
    } catch (err) {
      setMessage('Error: ' + (err.response?.data || err.message));
    }
  };

  const handleEdit = (member) => {
    setEditId(member.id);
    setForm({
      name: member.name || '',
      email: member.email || '',
      password: '',
      phone: member.phone || '',
      role: member.role || 'MANAGER',
      salary: member.salary || '',
      department: member.department || ''
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this staff member?')) {
      await axios.delete(`${API}/api/users/${id}`);
      fetchStaff();
    }
  };

  const handleToggle = async (id) => {
    await axios.put(`${API}/api/users/${id}/toggle`);
    fetchStaff();
  };

  const handleSalaryUpdate = async (id, salary) => {
    await axios.put(`${API}/api/users/${id}/salary`, { salary: parseFloat(salary) });
    fetchStaff();
  };

  const filteredStaff = filter === 'ALL' ? staff : staff.filter(s => s.role === filter);

  const getRoleBadge = (role) => {
    const colors = { MANAGER: 'bg-warning text-dark', TICKET_AGENT: 'bg-info text-dark' };
    return colors[role] || 'bg-secondary';
  };

  const totalSalary = staff.reduce((sum, s) => sum + (s.salary || 0), 0);

  return (
    <div>
      <nav className="navbar navbar-dark" style={{backgroundColor:'#e50914'}}>
        <div className="container">
          <span className="navbar-brand fw-bold">👥 Staff Management</span>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/admin')}>Back</button>
        </div>
      </nav>

      <div className="container mt-4">

        {/* Summary Cards */}
        <div className="row mb-4">
          {[
            { title: 'Total Staff', value: staff.length, icon: '👥', color: '#2980b9' },
            { title: 'Managers', value: staff.filter(s => s.role === 'MANAGER').length, icon: '👔', color: '#8e44ad' },
            { title: 'Ticket Agents', value: staff.filter(s => s.role === 'TICKET_AGENT').length, icon: '🎟️', color: '#27ae60' },
            { title: 'Total Salary', value: `₹${totalSalary.toFixed(0)}`, icon: '💰', color: '#e50914' },
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

        <div className="row">
          {/* Add Staff Form */}
          <div className="col-md-4">
            <div className="card shadow p-3">
              <h5>{editId ? '✏️ Edit Staff' : '➕ Add Staff'}</h5>
              {message && <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} py-2`}>{message}</div>}
              <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" placeholder="Full Name"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                <input className="form-control mb-2" placeholder="Email"
                  type="email" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} required />
                {!editId && (
                  <input className="form-control mb-2" placeholder="Password"
                    type="password" value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})} required />
                )}
                <input className="form-control mb-2" placeholder="Phone"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <select className="form-control mb-2" value={form.role}
                  onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="MANAGER">👔 Manager</option>
                  <option value="TICKET_AGENT">🎟️ Ticket Agent</option>
                </select>
                <input className="form-control mb-2" placeholder="Department"
                  value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
                <input className="form-control mb-2" placeholder="Salary (₹)"
                  type="number" value={form.salary}
                  onChange={e => setForm({...form, salary: e.target.value})} />
                <button className="btn btn-danger w-100 mb-2">
                  {editId ? '✏️ Update Staff' : '➕ Add Staff'}
                </button>
                {editId && (
                  <button type="button" className="btn btn-secondary w-100"
                    onClick={() => { setEditId(null); setForm({ name: '', email: '', password: '',
                      phone: '', role: 'MANAGER', salary: '', department: '' }); }}>
                    ❌ Cancel
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Staff List */}
          <div className="col-md-8">
            {/* Filter */}
            <div className="d-flex gap-2 mb-3">
              {['ALL', 'MANAGER', 'TICKET_AGENT'].map(f => (
                <button key={f} className={`btn btn-sm ${filter === f ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setFilter(f)}>
                  {f === 'ALL' ? '👥 All' : f === 'MANAGER' ? '👔 Managers' : '🎟️ Ticket Agents'}
                  ({f === 'ALL' ? staff.length : staff.filter(s => s.role === f).length})
                </button>
              ))}
            </div>

            <div className="row">
              {filteredStaff.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{fontSize:'60px'}}>👥</div>
                  <h5 className="text-muted">No staff members yet!</h5>
                </div>
              ) : filteredStaff.map(member => (
                <div className="col-md-6 mb-3" key={member.id}>
                  <div className="card shadow" style={{
                    borderLeft: `4px solid ${member.active ? '#27ae60' : '#e74c3c'}`
                  }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <h6 className="fw-bold">👤 {member.name}</h6>
                        <span className={`badge ${getRoleBadge(member.role)}`}>{member.role}</span>
                      </div>
                      <p className="mb-1 small">📧 {member.email}</p>
                      <p className="mb-1 small">📱 {member.phone}</p>
                      <p className="mb-1 small">🏢 {member.department}</p>
                      <p className="mb-2 small">💰 Salary: <strong>₹{member.salary}</strong></p>
                      <p className="mb-2 small">
                        Status: <span className={`badge ${member.active ? 'bg-success' : 'bg-danger'}`}>
                          {member.active ? 'Active' : 'Inactive'}
                        </span>
                      </p>

                      {/* Salary Update */}
                      <div className="input-group input-group-sm mb-2">
                        <input type="number" className="form-control" placeholder="Update Salary"
                          id={`salary-${member.id}`} defaultValue={member.salary} />
                        <button className="btn btn-success btn-sm"
                          onClick={() => handleSalaryUpdate(member.id,
                            document.getElementById(`salary-${member.id}`).value)}>
                          💰 Update
                        </button>
                      </div>

                      <div className="d-flex gap-1">
                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(member)}>✏️ Edit</button>
                        <button className="btn btn-sm" style={{backgroundColor: member.active ? '#e74c3c' : '#27ae60', color:'white'}}
                          onClick={() => handleToggle(member.id)}>
                          {member.active ? '🔴 Deactivate' : '🟢 Activate'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(member.id)}>🗑️</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffManagement;