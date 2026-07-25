import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { initialBookings } from '../data/bookings';
import { flightById } from '../data/flights';
import type { Booking } from '../types';

const STORAGE_KEY = 'flight-bookings.v1';

interface BookingsContextValue {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'reference' | 'status'>) => Booking;
  updateBooking: (reference: string, changes: Partial<Omit<Booking, 'reference'>>) => void;
  cancelBooking: (reference: string) => void;
  resetBookings: () => void;
}

const BookingsContext = createContext<BookingsContextValue | undefined>(undefined);

const generateReference = (existing: Booking[]): string => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let reference = '';
  do {
    reference = 'SKY';
    for (let i = 0; i < 4; i += 1) {
      reference += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  } while (existing.some((b) => b.reference === reference));
  return reference;
};

const loadBookings = (): Booking[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialBookings;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return initialBookings;
    // Drop bookings whose flight has fallen out of the rolling timetable window.
    const stored = (parsed as Booking[]).filter((b) => flightById(b.flightId));
    return stored.length > 0 ? stored : initialBookings;
  } catch {
    return initialBookings;
  }
};

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(loadBookings);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = useCallback((booking: Omit<Booking, 'reference' | 'status'>): Booking => {
    let created: Booking | undefined;
    setBookings((current) => {
      created = { ...booking, reference: generateReference(current), status: 'Confirmed' };
      return [...current, created];
    });
    return created ?? { ...booking, reference: generateReference(bookings), status: 'Confirmed' };
  }, [bookings]);

  const updateBooking = useCallback(
    (reference: string, changes: Partial<Omit<Booking, 'reference'>>) => {
      setBookings((current) =>
        current.map((b) => (b.reference === reference ? { ...b, ...changes } : b)),
      );
    },
    [],
  );

  const cancelBooking = useCallback((reference: string) => {
    setBookings((current) =>
      current.map((b) => (b.reference === reference ? { ...b, status: 'Cancelled' } : b)),
    );
  }, []);

  const resetBookings = useCallback(() => setBookings(initialBookings), []);

  const value = useMemo(
    () => ({ bookings, addBooking, updateBooking, cancelBooking, resetBookings }),
    [bookings, addBooking, updateBooking, cancelBooking, resetBookings],
  );

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings(): BookingsContextValue {
  const context = useContext(BookingsContext);
  if (!context) throw new Error('useBookings must be used within a BookingsProvider');
  return context;
}
