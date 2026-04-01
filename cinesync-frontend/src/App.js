import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import MovieManagement from './pages/MovieManagement';
import CustomerDashboard from './pages/CustomerDashboard';
import BookingPage from './pages/BookingPage';
import TheaterManagement from './pages/TheaterManagement';
import BookingManagement from './pages/BookingManagement';
import PaymentManagement from './pages/PaymentManagement';
import ScreenManagement from './pages/ScreenManagement';
import SalesReport from './pages/SalesReport';
import StaffManagement from './pages/StaffManagement';
import ManagerDashboard from './pages/ManagerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/movies" element={<MovieManagement />} />
        <Route path="/admin/theaters" element={<TheaterManagement />} />
        <Route path="/admin/screens" element={<ScreenManagement />} />
        <Route path="/admin/bookings" element={<BookingManagement />} />
        <Route path="/admin/payments" element={<PaymentManagement />} />
        <Route path="/admin/sales" element={<SalesReport />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;