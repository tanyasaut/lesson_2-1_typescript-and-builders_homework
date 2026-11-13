// HW-А3, HW-Б1: добавьте экспортируемые функции:
// countWorkshopSeats(items: Booking[], workshop: WorkshopId): number
// Суммирует число участников выбранного занятия.
// getRemainingSeats(items: Booking[], workshop: WorkshopId): number
// Возвращает вместимость минус занятые места.
// Типы находятся в ../models/booking, лимиты в ../data/capacities.
// Расчёты не меняют массив и не обращаются к DOM.
import type { Booking, WorkshopId } from '../models/booking'
import { TYPESCRIPT_CAPACITY, BUILD_CAPACITY } from '../data/capacities'

export function countWorkshopSeats(items: Booking[], workshop: WorkshopId): number {
  return items
    .filter((item) => item.workshop === workshop)
    .reduce((sum, item) => sum + item.seats, 0)
}

export function getRemainingSeats(items: Booking[], workshop: WorkshopId): number {
  const capacity = workshop === 'typescript' ? TYPESCRIPT_CAPACITY : BUILD_CAPACITY
  return capacity - countWorkshopSeats(items, workshop)
}
