import { useMemo, useState } from 'react';
import { airportLabel } from '../data/airports';
import { flightById, flights } from '../data/flights';
import { useBookings } from '../context/BookingsContext';
import type { Booking, Flight } from '../types';
import { formatDate } from '../utils/format';

interface EditState {
  passengerName: string;
  email: string;
  phone: string;
  flightId: string;
}

const sortKey = (flight: Flight | undefined): string =>
  flight ? `${flight.departureDate}T${flight.departureTime}` : '9999-12-31T23:59';

export default function ManageBooking() {
  const { bookings, updateBooking, cancelBooking, resetBookings } = useBookings();
  const [nameFilter, setNameFilter] = useState('all');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditState | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const passengerNames = useMemo(
    () => Array.from(new Set(bookings.map((b) => b.passengerName))).sort((a, b) => a.localeCompare(b)),
    [bookings],
  );

  const grouped = useMemo(() => {
    const visible = bookings.filter((b) => nameFilter === 'all' || b.passengerName === nameFilter);
    const groups = new Map<string, Booking[]>();
    visible.forEach((booking) => {
      const list = groups.get(booking.passengerName) ?? [];
      list.push(booking);
      groups.set(booking.passengerName, list);
    });
    return Array.from(groups.entries())
      .map(([name, list]) => ({
        name,
        list: [...list].sort((a, b) =>
          sortKey(flightById(a.flightId)).localeCompare(sortKey(flightById(b.flightId))),
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [bookings, nameFilter]);

  const startEdit = (booking: Booking) => {
    setEditing(booking.reference);
    setConfirmCancel(null);
    setDraft({
      passengerName: booking.passengerName,
      email: booking.email,
      phone: booking.phone,
      flightId: booking.flightId,
    });
  };

  const saveEdit = (reference: string) => {
    if (!draft || !draft.passengerName.trim()) return;
    updateBooking(reference, { ...draft, passengerName: draft.passengerName.trim() });
    setEditing(null);
    setDraft(null);
  };

  const alternativesFor = (booking: Booking): Flight[] => {
    const current = flightById(booking.flightId);
    if (!current) return flights.slice(0, 20);
    return flights
      .filter(
        (f) => f.originCode === current.originCode && f.destinationCode === current.destinationCode,
      )
      .sort((a, b) =>
        `${a.departureDate}${a.departureTime}`.localeCompare(`${b.departureDate}${b.departureTime}`),
      )
      .slice(0, 40);
  };

  return (
    <div className="page">
      <section className="hero hero--compact">
        <h1>Manage your bookings</h1>
        <p>Review, change or cancel any mock booking. Changes are saved in your browser.</p>
      </section>

      <div className="card toolbar">
        <label className="field">
          <span>Filter by passenger</span>
          <select value={nameFilter} onChange={(e) => setNameFilter(e.target.value)}>
            <option value="all">All passengers</option>
            {passengerNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn--ghost" onClick={resetBookings}>
          Reset demo data
        </button>
      </div>

      {grouped.length === 0 ? (
        <div className="card empty">
          <p>No bookings yet. Head to Book a Flight to create one.</p>
        </div>
      ) : null}

      {grouped.map((group) => (
        <section key={group.name} className="booking-group">
          <h2>{group.name}</h2>
          <div className="booking-group__list">
            {group.list.map((booking) => {
              const flight = flightById(booking.flightId);
              const isEditing = editing === booking.reference;
              return (
                <article key={booking.reference} className="card booking">
                  <header className="booking__header">
                    <div>
                      <span className="muted">Booking reference</span>
                      <h3>{booking.reference}</h3>
                    </div>
                    <span
                      className={
                        booking.status === 'Confirmed' ? 'status status--ok' : 'status status--cancelled'
                      }
                    >
                      {booking.status}
                    </span>
                  </header>

                  {flight ? (
                    <dl className="booking__details">
                      <div>
                        <dt>Route</dt>
                        <dd>
                          {airportLabel(flight.originCode)} &rarr; {airportLabel(flight.destinationCode)}
                        </dd>
                      </div>
                      <div>
                        <dt>Date</dt>
                        <dd>{formatDate(flight.departureDate)}</dd>
                      </div>
                      <div>
                        <dt>Departs</dt>
                        <dd>
                          {flight.departureTime} &middot; arrives {flight.arrivalTime}
                        </dd>
                      </div>
                      <div>
                        <dt>Flight</dt>
                        <dd>
                          {flight.airline} {flight.flightNumber}
                        </dd>
                      </div>
                      <div>
                        <dt>Seat</dt>
                        <dd>{booking.seat}</dd>
                      </div>
                      <div>
                        <dt>Passengers</dt>
                        <dd>{booking.passengers}</dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="muted">Flight details unavailable.</p>
                  )}

                  {isEditing && draft ? (
                    <div className="booking__edit">
                      <div className="form-grid">
                        <label className="field">
                          <span>Passenger name</span>
                          <input
                            type="text"
                            value={draft.passengerName}
                            onChange={(e) => setDraft({ ...draft, passengerName: e.target.value })}
                          />
                        </label>
                        <label className="field">
                          <span>Email</span>
                          <input
                            type="email"
                            value={draft.email}
                            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                          />
                        </label>
                        <label className="field">
                          <span>Phone</span>
                          <input
                            type="tel"
                            value={draft.phone}
                            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                          />
                        </label>
                        <label className="field field--wide">
                          <span>Flight</span>
                          <select
                            value={draft.flightId}
                            onChange={(e) => setDraft({ ...draft, flightId: e.target.value })}
                          >
                            {alternativesFor(booking).map((f) => (
                              <option key={f.id} value={f.id}>
                                {formatDate(f.departureDate)} &middot; {f.departureTime} &middot;{' '}
                                {f.flightNumber} &middot; &pound;{f.price}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="actions">
                        <button
                          type="button"
                          className="btn btn--primary"
                          onClick={() => saveEdit(booking.reference)}
                        >
                          Save changes
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => {
                            setEditing(null);
                            setDraft(null);
                          }}
                        >
                          Discard
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="actions">
                      <button
                        type="button"
                        className="btn btn--secondary"
                        disabled={booking.status === 'Cancelled'}
                        onClick={() => startEdit(booking)}
                      >
                        Modify booking
                      </button>
                      {confirmCancel === booking.reference ? (
                        <>
                          <span className="muted">Cancel this booking?</span>
                          <button
                            type="button"
                            className="btn btn--danger"
                            onClick={() => {
                              cancelBooking(booking.reference);
                              setConfirmCancel(null);
                            }}
                          >
                            Yes, cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() => setConfirmCancel(null)}
                          >
                            Keep booking
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="btn btn--ghost"
                          disabled={booking.status === 'Cancelled'}
                          onClick={() => setConfirmCancel(booking.reference)}
                        >
                          Cancel booking
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
