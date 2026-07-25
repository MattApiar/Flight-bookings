import type { Booking } from '../types';
import { flights } from './flights';
import { currentUser } from './user';

const pick = (origin: string, destination: string, offsetDays: number): string => {
  const target = new Date();
  target.setHours(12, 0, 0, 0);
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
    passengerName: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    flightId: pick('LHR', 'CDG', 14),
    seat: '3C',
    passengers: 2,
    status: 'Confirmed',
  },
  {
    reference: 'SKY9X1M',
    passengerName: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    flightId: pick('LHR', 'JFK', 36),
    seat: '12A',
    passengers: 1,
    status: 'Confirmed',
  },
  {
    reference: 'SKY7T5Q',
    passengerName: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    flightId: pick('LHR', 'DXB', 75),
    seat: '21F',
    passengers: 1,
    status: 'Confirmed',
  },
];
