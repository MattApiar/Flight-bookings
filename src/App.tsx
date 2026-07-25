import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import BookFlight from './pages/BookFlight';
import ManageBooking from './pages/ManageBooking';

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/book" replace />} />
          <Route path="/book" element={<BookFlight />} />
          <Route path="/manage" element={<ManageBooking />} />
          <Route path="*" element={<Navigate to="/book" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>Demo application. All flights, prices and bookings are mock data.</p>
      </footer>
    </div>
  );
}
