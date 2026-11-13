export type BookingStatus = 'new' | 'confirmed'
export type WorkshopId = 'typescript' | 'build';
// HW-А1: добавьте WorkshopId и обязательное поле workshop в Booking.
export interface Booking {
  id: string
  name: string
  seats: number
  status: BookingStatus
  source: 'web'
  workshop: WorkshopId
}
