import { useMemo, useState } from 'react';
import { airportLabel } from '../data/airports';
import { flightById, flights } from '../data/flights';
import { currentUser } from '../data/user';
import { useBookings } from '../context/BookingsContext';
import type { Booking, Flight } from '../types';
import { formatDate } from '../utils/format';

interface EditState {
  email: string;
  phone: string;
  flightId: string;
}

const sortKey = (flight: Flight | undefined): string =>
  flight ? `${flight.departureDate}T${flight.departureTime}` : '9999-12-31T23:59';

export default function ManageBooking() {
  const { bookings, updateBooking, cancelBooking, resetBookings } = useBookings();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditState | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const myBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.passengerName === currentUser.name)
        .sort((a, b) => sortKey(flightById(a.flightId)).localeCompare(sortKey(flightById(b.flightId)))),
    [bookings],
  );

  const upcomingCount = myBookings.filter((b) => b.status === 'Confirmed').length;

  const startEdit = (booking: Booking) => {
    setEditing(booking.reference);
    setConfirmCancel(null);
    setDraft({ email: booking.email, phone: booking.phone, flightId: booking.flightId });
  };

  const saveEdit = (reference: string) => {
    if (!draft) return;
    updateBooking(reference, draft);
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
        <span className="eyebrow">My bookings</span>
        <h1>Your bookings, {currentUser.name.split(' ')[0]}</h1>
        <p>
          {upcomingCount} upcoming trip{upcomingCount === 1 ? '' : 's'} on this account &middot;{' '}
          {currentUser.email}
        </p>
      </section>

      <div className="toolbar toolbar--end">
        <button type="button" className="btn btn--ghost" onClick={resetBookings}>
          Reset demo data
        </button>
      </div>

      {myBookings.length === 0 ? (
        <div className="card empty">
          <p>No bookings on your account yet. Head to Book a Flight to create one.</p>
        </div>
      ) : (
        <div className="booking-group__list">
          {myBookings.map((booking) => {
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
                      <dd>{flight.flightNumber}</dd>
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
      )}
    </div>
  );
}
