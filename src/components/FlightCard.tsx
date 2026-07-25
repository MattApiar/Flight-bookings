import { airportLabel } from '../data/airports';
import type { Flight } from '../types';

interface Props {
  flight: Flight;
  passengers: number;
  onSelect?: (flight: Flight) => void;
  actionLabel?: string;
  selected?: boolean;
}

export default function FlightCard({ flight, passengers, onSelect, actionLabel = 'Select', selected = false }: Props) {
  const total = flight.price * passengers;

  return (
    <article className={selected ? 'flight-card flight-card--selected' : 'flight-card'}>
      <div className="flight-card__airline">
        <span className="badge">{flight.cabin}</span>
        <strong className="flight-card__number">{flight.flightNumber}</strong>
        <span className="muted">{flight.aircraft}</span>
      </div>

      <div className="flight-card__route">
        <div className="flight-card__endpoint">
          <strong>{flight.departureTime}</strong>
          <span className="muted">{airportLabel(flight.originCode)}</span>
        </div>
        <div className="flight-card__path">
          <span className="muted">{flight.duration}</span>
          <div className="flight-card__line" aria-hidden="true" />
          <span className="muted">Non-stop</span>
        </div>
        <div className="flight-card__endpoint flight-card__endpoint--right">
          <strong>{flight.arrivalTime}</strong>
          <span className="muted">{airportLabel(flight.destinationCode)}</span>
        </div>
      </div>

      <div className="flight-card__price">
        <div>
          <strong>&pound;{total.toLocaleString()}</strong>
          <span className="muted">
            total for {passengers} passenger{passengers === 1 ? '' : 's'}
          </span>
        </div>
        {onSelect ? (
          <button type="button" className="btn btn--primary" onClick={() => onSelect(flight)}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </article>
  );
}
