import type { Booking } from '../models/booking'

// HW-А1: Анна записана на typescript, Илья на build.
export const initialBookings: Booking[] = [
  { id: 'b1', name: 'Анна', seats: 2, status: 'confirmed', source: 'web', workshop: 'typescript'  },
  { id: 'b2', name: 'Илья', seats: 1, status: 'new', source: 'web', workshop: 'build' },
]
