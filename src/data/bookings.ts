import type { Booking } from '../types';
import { flights } from './flights';

const pick = (origin: string, destination: string, offsetDays: number): string => {
  const target = new Date();
  target.setDate(target.getDate() + offsetDays);
  const iso = target.toISOString().slice(0, 10);
  const match =
    flights.find(
      (f) => f.originCode === origin && f.destinationCode === destination && f.departureDate === iso,
    ) ?? flights.find((f) => f.originCode === origin && f.destinationCode === destination);
  return match ? match.id : flights[0].id;
};

export const initialBookings: Booking[] = [
  {
    reference: 'SKY4B2C',
    passengerName: 'Amelia Clarke',
    email: 'amelia.clarke@example.com',
    phone: '+44 7700 900123',
    flightId: pick('LHR', 'JFK', 6),
    seat: '12A',
    passengers: 1,
    status: 'Confirmed',
  },
  {
    reference: 'SKY9X1M',
    passengerName: 'Amelia Clarke',
    email: 'amelia.clarke@example.com',
    phone: '+44 7700 900123',
    flightId: pick('LHR', 'CDG', 2),
    seat: '3C',
    passengers: 2,
    status: 'Confirmed',
  },
  {
    reference: 'SKY7T5Q',
    passengerName: 'Daniel Osei',
    email: 'daniel.osei@example.com',
    phone: '+44 7700 900456',
    flightId: pick('LHR', 'DXB', 11),
    seat: '21F',
    passengers: 1,
    status: 'Confirmed',
  },
  {
    reference: 'SKY2H8L',
    passengerName: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '+44 7700 900789',
    flightId: pick('LHR', 'EDI', 1),
    seat: '8D',
    passengers: 1,
    status: 'Cancelled',
  },
];
