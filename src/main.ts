import './style.css'
import type { Booking, WorkshopId } from './models/booking'
import { initialBookings } from './data/initial-bookings'
import { TYPESCRIPT_CAPACITY, BUILD_CAPACITY } from './data/capacities'
import { countSeats } from './lib/count-seats'
// HW-Б1: подключите расчёты из ./lib/availability.
// HW-Б2: импортируйте ./assets/workshops.svg как URL.

const bookings: Array<Booking> = [...initialBookings]

// Проверка из практики уже работает. В базе менять её не требуется.
function readSeats(raw: FormDataEntryValue | null): number | null {
  if (typeof raw !== 'string' || raw.trim() === '') return null
  const seats = Number(raw)
  if (!Number.isInteger(seats) || seats < 1 || seats > 5) return null
  return seats
}

// HW-А2: замените заглушку; нужный результат WorkshopId | null.
// Для проверки через форму сначала включите список ui.workshop в месте HW-А4.
function readWorkshop(raw: FormDataEntryValue | null): WorkshopId | null {
  if (raw === 'typescript' || raw === 'build') {
    return raw;
  }
  return null;
}

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Не найден контейнер приложения')

app.innerHTML = `
  <main class="workspace">
    <header class="header">
      <div>
        <p class="eyebrow">ВЕБ-МАСТЕРСКАЯ / УЧЕБНЫЕ ГРУППЫ</p>
        <h1>Встречаемся на практике</h1>
        <p class="lead">Выберите занятие и приходите своей небольшой командой.</p>
      </div>
      <img id="logo" class="logo" width="112" height="96" alt="" hidden>
    </header>

    <aside id="starter-notice" class="notice">
      <strong>Стартовая версия: общая запись.</strong>
      Выбор занятия и учёт свободных мест пока не подключены.
    </aside>

    <section class="sessions" aria-label="Занятия и свободные места">
      <article class="session">
        <span class="session-code">01 / КОНТРАКТЫ</span>
        <h2>TypeScript</h2>
        <p>Вместимость: ${TYPESCRIPT_CAPACITY} человек</p>
        <p class="availability">Свободно: <strong id="typescript-free">не рассчитано</strong></p>
      </article>
      <article class="session session--blue">
        <span class="session-code">02 / ИНСТРУМЕНТЫ</span>
        <h2>Сборка проекта</h2>
        <p>Вместимость: ${BUILD_CAPACITY} человек</p>
        <p class="availability">Свободно: <strong id="build-free">не рассчитано</strong></p>
      </article>
    </section>

    <div class="columns">
      <section class="panel">
        <h2>Новая заявка</h2>
        <form id="booking-form" novalidate>
          <label for="name">Имя</label>
          <input id="name" name="name" autocomplete="given-name" placeholder="Как к вам обращаться?">

          <label for="workshop">Занятие</label>
          <select id="workshop" name="workshop" disabled>
            <option value="">Выберите занятие</option>
            <option value="typescript">TypeScript</option>
            <option value="build">Сборка проекта</option>
          </select>

          <label for="seats">Участников</label>
          <input id="seats" name="seats" type="text" inputmode="numeric" value="1" aria-describedby="seats-hint">
          <small id="seats-hint">Целое число от 1 до 5 в одной заявке.</small>
          <button type="submit">Записаться</button>
          <p id="message" class="message" role="status" aria-live="polite"></p>
        </form>
      </section>

      <section class="panel">
        <div class="list-heading">
          <h2>Уже записались</h2>
          <span class="counter">Участников: <strong id="total">0</strong></span>
        </div>
        <ul id="bookings" class="bookings"></ul>
        <p class="muted">Данные хранятся в памяти. Перезагрузка вернёт две исходные заявки.</p>
      </section>
    </div>
    <footer>Веб-мастерская <span>Учимся на небольших работающих проектах</span></footer>
  </main>`

const form = document.querySelector('#booking-form')
const list = document.querySelector('#bookings')
const total = document.querySelector('#total')
const message = document.querySelector('#message')
const workshop = document.querySelector('#workshop')
const typescriptFree = document.querySelector('#typescript-free')
const buildFree = document.querySelector('#build-free')
const logo = document.querySelector('#logo')
const notice = document.querySelector('#starter-notice')

if (!(form instanceof HTMLFormElement) || !(list instanceof HTMLUListElement)
  || !(total instanceof HTMLElement) || !(message instanceof HTMLElement)
  || !(workshop instanceof HTMLSelectElement) || !(typescriptFree instanceof HTMLElement)
  || !(buildFree instanceof HTMLElement) || !(logo instanceof HTMLImageElement)
  || !(notice instanceof HTMLElement)) {
  throw new Error('Не найдены элементы интерфейса')
}

// Проверенные DOM-элементы уже готовы к использованию.
const ui = { form, list, total, message, workshop, typescriptFree, buildFree, logo, notice }

// HW-А4: сделайте список ui.workshop доступным для выбора уже при проверке А2.
// Здесь же скройте или удалите найденный ui.notice после проверки DOM выше.
// HW-Б2: задайте ui.logo.src, alt и покажите изображение.

function render(items: Booking[]) {
  ui.list.replaceChildren()
  items.forEach((booking) => {
    const item = document.createElement('li')
    const title = document.createElement('strong')
    const details = document.createElement('span')
    title.textContent = booking.name
    // HW-А4: добавьте название занятия в подробности карточки.
    details.textContent = `${booking.seats} участн. · ${booking.status === 'confirmed' ? 'Подтверждена' : 'Новая'} · ${booking.source}`
    item.append(title, details)
    ui.list.append(item)
  })
  ui.total.textContent = String(countSeats(items))
  // HW-А4: обновите ui.typescriptFree и ui.buildFree через общий расчёт.
}

ui.form.addEventListener('submit', (event) => {
  event.preventDefault()
  const data = new FormData(ui.form)
  const rawName = data.get('name')
  if (typeof rawName !== 'string' || rawName.trim() === '') {
    ui.message.textContent = 'Укажите имя.'
    return
  }

  const seats = readSeats(data.get('seats'))
  if (seats === null) {
    ui.message.textContent = 'Введите целое число участников от 1 до 5.'
    return
  }
  const selectedWorkshop = readWorkshop(data.get('workshop'))
  if (selectedWorkshop === null) {
    ui.message.textContent = 'Пожалуйста, выберите занятие из списка.'
    return 
  }

  // HW-А2: прочитайте data.get('workshop') через readWorkshop, обработайте отказ.
  // HW-А3: сравните число участников с остатком мест выбранного занятия до изменения bookings.

  const booking: Booking = {
    id: crypto.randomUUID(),
    name: rawName.trim(),
    seats,
    status: 'new',
    source: 'web',
    workshop: selectedWorkshop,
  }
  bookings.push(booking)
  render(bookings)
  ui.message.textContent = 'Заявка добавлена.'
  ui.form.reset()
})

render(bookings)
