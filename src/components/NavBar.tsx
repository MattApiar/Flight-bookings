import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link nav-link--active' : 'nav-link';

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/book" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__mark" aria-hidden="true">
            &#9992;
          </span>
          <span className="brand__text">Skyline Airways</span>
        </NavLink>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={open ? 'nav nav--open' : 'nav'}>
          <NavLink to="/book" className={linkClass} onClick={() => setOpen(false)}>
            Book a Flight
          </NavLink>
          <NavLink to="/manage" className={linkClass} onClick={() => setOpen(false)}>
            Manage Booking
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
