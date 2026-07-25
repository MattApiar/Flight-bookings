import { useState } from 'react';
import type { FormEvent } from 'react';
import { airports } from '../data/airports';

export interface SearchCriteria {
  origin: string;
  destination: string;
  date: string;
  timeOfDay: string;
  passengers: number;
}

export const timeOfDayOptions = [
  { value: 'any', label: 'Any time' },
  { value: 'morning', label: 'Morning (before 12:00)' },
  { value: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
  { value: 'evening', label: 'Evening (after 18:00)' },
];

interface Props {
  initial: SearchCriteria;
  onSearch: (criteria: SearchCriteria) => void;
}

export default function SearchForm({ initial, onSearch }: Props) {
  const [criteria, setCriteria] = useState<SearchCriteria>(initial);
  const [error, setError] = useState('');

  const update = <K extends keyof SearchCriteria>(key: K, value: SearchCriteria[K]) =>
    setCriteria((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (criteria.origin === criteria.destination) {
      setError('Origin and destination must be different.');
      return;
    }
    if (!criteria.date) {
      setError('Please choose a departure date.');
      return;
    }
    setError('');
    onSearch(criteria);
  };

  return (
    <form className="card search-form" onSubmit={handleSubmit}>
      <div className="search-form__grid">
        <label className="field">
          <span>From</span>
          <select value={criteria.origin} onChange={(e) => update('origin', e.target.value)}>
            {airports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code}) &ndash; {a.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>To</span>
          <select value={criteria.destination} onChange={(e) => update('destination', e.target.value)}>
            {airports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code}) &ndash; {a.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Departure date</span>
          <input type="date" value={criteria.date} onChange={(e) => update('date', e.target.value)} />
        </label>

        <label className="field">
          <span>Time of day</span>
          <select value={criteria.timeOfDay} onChange={(e) => update('timeOfDay', e.target.value)}>
            {timeOfDayOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Passengers</span>
          <select
            value={criteria.passengers}
            onChange={(e) => update('passengers', Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <div className="field field--action">
          <button type="submit" className="btn btn--primary btn--block">
            Search flights
          </button>
        </div>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}
