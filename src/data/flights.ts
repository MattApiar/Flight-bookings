import type { Flight } from '../types';

interface RouteTemplate {
  originCode: string;
  destinationCode: string;
  duration: string;
  basePrice: number;
  /** Daily departure slots, spread across morning, afternoon and evening. */
  slots: Array<{ departureTime: string; arrivalTime: string }>;
}

const slot = (departureTime: string, arrivalTime: string) => ({ departureTime, arrivalTime });

export const routeTemplates: RouteTemplate[] = [
  {
    originCode: 'LHR',
    destinationCode: 'JFK',
    duration: '7h 55m',
    basePrice: 420,
    slots: [
      slot('06:30', '09:25'),
      slot('08:15', '11:10'),
      slot('10:45', '13:40'),
      slot('12:20', '15:15'),
      slot('14:50', '17:45'),
      slot('16:35', '19:30'),
      slot('18:20', '21:15'),
      slot('20:55', '23:50'),
    ],
  },
  {
    originCode: 'JFK',
    destinationCode: 'LHR',
    duration: '6h 50m',
    basePrice: 445,
    slots: [
      slot('07:10', '19:00'),
      slot('09:00', '20:50'),
      slot('13:25', '01:15'),
      slot('17:40', '05:30'),
      slot('19:30', '07:20'),
    ],
  },
  {
    originCode: 'LHR',
    destinationCode: 'CDG',
    duration: '1h 20m',
    basePrice: 95,
    slots: [
      slot('06:15', '08:35'),
      slot('07:05', '09:25'),
      slot('09:50', '12:10'),
      slot('12:15', '14:35'),
      slot('15:20', '17:40'),
      slot('17:45', '20:05'),
      slot('20:30', '22:50'),
    ],
  },
  {
    originCode: 'CDG',
    destinationCode: 'LHR',
    duration: '1h 25m',
    basePrice: 99,
    slots: [
      slot('07:20', '07:45'),
      slot('08:30', '08:55'),
      slot('13:05', '13:30'),
      slot('16:10', '16:35'),
      slot('19:45', '20:10'),
    ],
  },
  {
    originCode: 'LHR',
    destinationCode: 'DXB',
    duration: '6h 55m',
    basePrice: 380,
    slots: [
      slot('08:05', '18:00'),
      slot('10:20', '20:15'),
      slot('14:35', '00:30'),
      slot('21:40', '07:35'),
    ],
  },
  {
    originCode: 'DXB',
    destinationCode: 'LHR',
    duration: '7h 40m',
    basePrice: 395,
    slots: [slot('02:50', '07:30'), slot('09:15', '13:55'), slot('14:05', '18:45')],
  },
  {
    originCode: 'LHR',
    destinationCode: 'LAX',
    duration: '11h 20m',
    basePrice: 610,
    slots: [slot('09:35', '12:55'), slot('11:00', '14:20'), slot('15:45', '19:05')],
  },
  {
    originCode: 'LAX',
    destinationCode: 'LHR',
    duration: '10h 15m',
    basePrice: 640,
    slots: [slot('13:20', '06:35'), slot('16:45', '10:00'), slot('20:10', '13:25')],
  },
  {
    originCode: 'LHR',
    destinationCode: 'EDI',
    duration: '1h 25m',
    basePrice: 72,
    slots: [
      slot('06:40', '08:05'),
      slot('09:15', '10:40'),
      slot('11:20', '12:45'),
      slot('14:05', '15:30'),
      slot('16:50', '18:15'),
      slot('19:00', '20:25'),
    ],
  },
  {
    originCode: 'EDI',
    destinationCode: 'LHR',
    duration: '1h 30m',
    basePrice: 78,
    slots: [
      slot('07:25', '08:55'),
      slot('09:10', '10:40'),
      slot('13:50', '15:20'),
      slot('17:35', '19:05'),
    ],
  },
  {
    originCode: 'LGW',
    destinationCode: 'FCO',
    duration: '2h 45m',
    basePrice: 110,
    slots: [slot('07:50', '10:35'), slot('11:40', '14:25'), slot('15:30', '18:15')],
  },
  {
    originCode: 'LHR',
    destinationCode: 'AMS',
    duration: '1h 15m',
    basePrice: 88,
    slots: [
      slot('06:55', '09:10'),
      slot('08:00', '10:15'),
      slot('11:30', '13:45'),
      slot('14:20', '16:35'),
      slot('18:40', '20:55'),
    ],
  },
  {
    originCode: 'LHR',
    destinationCode: 'FRA',
    duration: '1h 40m',
    basePrice: 105,
    slots: [slot('07:30', '10:10'), slot('12:45', '15:25'), slot('18:05', '20:45')],
  },
  {
    originCode: 'LHR',
    destinationCode: 'MAD',
    duration: '2h 25m',
    basePrice: 120,
    slots: [slot('09:45', '12:10'), slot('13:30', '15:55'), slot('16:55', '19:20')],
  },
  {
    originCode: 'LHR',
    destinationCode: 'SIN',
    duration: '13h 10m',
    basePrice: 690,
    slots: [slot('11:50', '08:00'), slot('21:15', '17:25')],
  },
  {
    originCode: 'SIN',
    destinationCode: 'SYD',
    duration: '7h 50m',
    basePrice: 430,
    slots: [slot('09:40', '20:30'), slot('22:15', '09:05')],
  },
  {
    originCode: 'LHR',
    destinationCode: 'HND',
    duration: '13h 45m',
    basePrice: 725,
    slots: [slot('13:05', '09:50')],
  },
];

const airlines = [
  { name: 'Skyline Airways', prefix: 'SK' },
  { name: 'Britannia Air', prefix: 'BA' },
  { name: 'Atlantic Express', prefix: 'AX' },
  { name: 'Northwind', prefix: 'NW' },
];

const aircraftTypes = [
  'Airbus A320neo',
  'Boeing 787-9',
  'Airbus A350-1000',
  'Boeing 777-300ER',
  'Airbus A321',
];

/** Timetable window: every route flies every day for this many days from today. */
const SCHEDULE_DAYS = 180;

const isoDate = (offsetDays: number): string => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

/** Small stable hash so airline, price and aircraft stay identical for a given flight id. */
const hash = (value: string): number => {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) {
    result = (result * 31 + value.charCodeAt(i)) % 100000;
  }
  return result;
};

const buildTimetable = (): Flight[] => {
  const built: Flight[] = [];

  for (let day = 0; day < SCHEDULE_DAYS; day += 1) {
    const departureDate = isoDate(day);
    routeTemplates.forEach((route) => {
      route.slots.forEach(({ departureTime, arrivalTime }) => {
        const id = `${route.originCode}-${route.destinationCode}-${departureDate}-${departureTime.replace(':', '')}`;
        const seed = hash(id);
        const airline = airlines[seed % airlines.length];
        built.push({
          id,
          airline: airline.name,
          flightNumber: `${airline.prefix}${100 + (seed % 800)}`,
          originCode: route.originCode,
          destinationCode: route.destinationCode,
          departureDate,
          departureTime,
          arrivalTime,
          duration: route.duration,
          price: route.basePrice + ((seed * 13) % 90),
          aircraft: aircraftTypes[seed % aircraftTypes.length],
        });
      });
    });
  }

  return built;
};

export const flights: Flight[] = buildTimetable();

export const flightById = (id: string): Flight | undefined => flights.find((f) => f.id === id);
