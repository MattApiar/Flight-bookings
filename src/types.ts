export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  cabin: string;
  originCode: string;
  destinationCode: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  aircraft: string;
}

export type BookingStatus = 'Confirmed' | 'Cancelled';

export interface Booking {
  reference: string;
  passengerName: string;
  email: string;
  phone: string;
  flightId: string;
  seat: string;
  passengers: number;
  status: BookingStatus;
}
