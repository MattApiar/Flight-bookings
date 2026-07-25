import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import FlightCard from '../components/FlightCard';
import SearchForm from '../components/SearchForm';
import type { SearchCriteria } from '../components/SearchForm';
import { airportLabel } from '../data/airports';
import { flights } from '../data/flights';
import { useBookings } from '../context/BookingsContext';
import type { Booking, Flight } from '../types';
import { formatDate, todayIso } from '../utils/format';

const matchesTimeOfDay = (departureTime: string, timeOfDay: string): boolean => {
  if (timeOfDay === 'any') return true;
  const hour = Number(departureTime.slice(0, 2));
  if (timeOfDay === 'morning') return hour < 12;
  if (timeOfDay === 'afternoon') return hour >= 12 && hour < 18;
  return hour >= 18;
};

const randomSeat = (): string => {
  const row = 1 + Math.floor(Math.random() * 32);
  const letter = 'ABCDEF'[Math.floor(Math.random() * 6)];
  return `${row}${letter}`;
};

/** Showcase date used as the default search: it always has a full day of LHR-JFK departures. */
const FEATURED_DATE = '2026-08-30';

const defaultCriteria: SearchCriteria = {
  origin: 'LHR',
  destination: 'JFK',
  date: FEATURED_DATE >= todayIso() ? FEATURED_DATE : todayIso(),
  timeOfDay: 'any',
  passengers: 1,
};

export default function BookFlight() {
  const { addBooking } = useBookings();
  const [criteria, setCriteria] = useState<SearchCriteria | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [passenger, setPassenger] = useState({ name: '', email: '', phone: '' });
  const [confirmation, setConfirmation] = useState<Booking | null>(null);
  const [error, setError] = useState('');

  const results = useMemo(() => {
    if (!criteria) return [];
    return flights
      .filter(
        (f) =>
          f.originCode === criteria.origin &&
          f.destinationCode === criteria.destination &&
          f.departureDate === criteria.date &&
          matchesTimeOfDay(f.departureTime, criteria.timeOfDay),
      )
      .sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }, [criteria]);

  const handleSearch = (next: SearchCriteria) => {
    setCriteria(next);
    setSelectedFlight(null);
    setConfirmation(null);
  };

  const handleConfirm = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFlight || !criteria) return;
    if (!passenger.name.trim()) {
      setError('Please enter the lead passenger name.');
      return;
    }
    setError('');
    const booking = addBooking({
      passengerName: passenger.name.trim(),
      email: passenger.email.trim(),
      phone: passenger.phone.trim(),
      flightId: selectedFlight.id,
      seat: randomSeat(),
      passengers: criteria.passengers,
    });
    setConfirmation(booking);
    setSelectedFlight(null);
    setPassenger({ name: '', email: '', phone: '' });
  };

  return (
    <div className="page">
      <section className="hero">
        <h1>Where would you like to fly?</h1>
        <p>Search our mock timetable, pick a flight and book in seconds &mdash; no account needed.</p>
      </section>

      <SearchForm initial={defaultCriteria} onSearch={handleSearch} />

      {confirmation ? (
        <div className="card confirmation">
          <h2>Booking confirmed</h2>
          <p>
            Your booking reference is <strong>{confirmation.reference}</strong>. Find it any time under
            Manage Booking.
          </p>
        </div>
      ) : null}

      {criteria ? (
        <section className="results">
          <h2>
            {airportLabel(criteria.origin)} to {airportLabel(criteria.destination)}
            <span className="muted"> &middot; {formatDate(criteria.date)}</span>
          </h2>

          {results.length === 0 ? (
            <div className="card empty">
              <p>No flights match your search. Try another date or time of day.</p>
            </div>
          ) : (
            <div className="results__list">
              {results.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  passengers={criteria.passengers}
                  selected={selectedFlight?.id === flight.id}
                  onSelect={(f) => {
                    setSelectedFlight(f);
                    setConfirmation(null);
                  }}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {selectedFlight && criteria ? (
        <section className="card booking-form">
          <h2>Passenger details</h2>
          <p className="muted">
            {selectedFlight.airline} {selectedFlight.flightNumber} &middot;{' '}
            {airportLabel(selectedFlight.originCode)} &rarr; {airportLabel(selectedFlight.destinationCode)}{' '}
            &middot; {formatDate(selectedFlight.departureDate)} at {selectedFlight.departureTime}
          </p>
          <form onSubmit={handleConfirm}>
            <div className="form-grid">
              <label className="field">
                <span>Lead passenger name</span>
                <input
                  type="text"
                  value={passenger.name}
                  placeholder="Jane Smith"
                  onChange={(e) => setPassenger({ ...passenger, name: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  value={passenger.email}
                  placeholder="jane@example.com"
                  onChange={(e) => setPassenger({ ...passenger, email: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Phone</span>
                <input
                  type="tel"
                  value={passenger.phone}
                  placeholder="+44 7700 900000"
                  onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })}
                />
              </label>
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <div className="actions">
              <button type="submit" className="btn btn--primary">
                Confirm booking &middot; &pound;
                {(selectedFlight.price * criteria.passengers).toLocaleString()}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setSelectedFlight(null)}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
