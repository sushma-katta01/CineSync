import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8084';

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API}/api/payments`);
      if (res.ok) { const data = await res.json(); setPayments(data); }
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <nav className="navbar navbar-dark" style={{backgroundColor:'#e50914'}}>
        <div className="container">
          <span className="navbar-brand">💰 Payment Management</span>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/admin')}>Back</button>
        </div>
      </nav>
      <div className="container mt-4">
        <h5>All Payments ({payments.length})</h5>
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Payment ID</th>
              <th>Booking ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No payments yet!</td></tr>
            ) : payments.map((p, i) => (
              <tr key={p.id}>
                <td>{i+1}</td>
                <td>{p.id}</td>
                <td>{p.bookingId}</td>
                <td>₹{p.amount}</td>
                <td>{p.paymentMethod}</td>
                <td><span className={`badge ${p.status === 'SUCCESS' ? 'bg-success' : 'bg-danger'}`}>{p.status}</span></td>
                <td>{p.paymentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentManagement;