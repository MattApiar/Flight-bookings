# Flight-bookings

Demo flight booking single-page application built with React, TypeScript and Vite.

Everything is **mock data** &mdash; there is no backend and no authentication. Bookings you create or
change are persisted to your browser's `localStorage` so they survive a refresh.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually http://localhost:5173).

Other scripts:

```bash
npm run build      # type-check and produce a production build
npm run typecheck  # type-check only
npm run preview    # preview the production build
```

## Tabs

- **Book a Flight** &mdash; search the mock timetable by origin, destination, date, time of day and
  passenger count, browse matching flights, and confirm a booking. A random booking reference is
  generated for each new booking.
- **Manage Booking** &mdash; all bookings grouped by passenger name and sorted by departure date.
  Each booking can be modified (passenger details or flight) or cancelled. "Reset demo data" restores
  the original mock bookings.

## Project structure

```
src/
  components/   NavBar, SearchForm, FlightCard
  context/      BookingsContext (state + localStorage persistence)
  data/         airports.ts, flights.ts, bookings.ts (all mock data)
  pages/        BookFlight.tsx, ManageBooking.tsx
  styles/       global.css (blue-and-white theme, responsive)
```
