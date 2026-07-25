import type { Airport } from '../types';

export const airports: Airport[] = [
  { code: 'LHR', city: 'London', name: 'Heathrow', country: 'United Kingdom' },
  { code: 'LGW', city: 'London', name: 'Gatwick', country: 'United Kingdom' },
  { code: 'EDI', city: 'Edinburgh', name: 'Edinburgh Airport', country: 'United Kingdom' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International', country: 'United States' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International', country: 'United States' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France' },
  { code: 'AMS', city: 'Amsterdam', name: 'Schiphol', country: 'Netherlands' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt am Main', country: 'Germany' },
  { code: 'MAD', city: 'Madrid', name: 'Adolfo Suarez Barajas', country: 'Spain' },
  { code: 'FCO', city: 'Rome', name: 'Leonardo da Vinci Fiumicino', country: 'Italy' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'United Arab Emirates' },
  { code: 'SIN', city: 'Singapore', name: 'Changi', country: 'Singapore' },
  { code: 'HND', city: 'Tokyo', name: 'Haneda', country: 'Japan' },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith', country: 'Australia' },
];

export const airportByCode = (code: string): Airport | undefined =>
  airports.find((a) => a.code === code);

export const airportLabel = (code: string): string => {
  const a = airportByCode(code);
  return a ? `${a.city} (${a.code})` : code;
};
