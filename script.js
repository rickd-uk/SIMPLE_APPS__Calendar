let nav = 0
let clicked = null
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []

const calendar = document.getElementById('calendar')
const newEventModal = document.getElementById('newEventModal')
const backdropModal = document.getElementById('backdropModal')
const eventTitle = document.getElementById('eventTitleInput')

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function openModal(date) {
	clicked = date

	const eventForDay = events.find((e) => e.date === clicked)

	if (eventForDay) {
		document.getElementById('eventText').innerText = eventForDay.title
		deleteEventModal.style.display = 'block'
	} else {
		newEventModal.style.display = 'block'
	}

	backdropModal.style.display = 'block'
}

function load() {
	const dt = new Date()

	if (nav !== 0) {
		dt.setMonth(new Date().getMonth() + nav)
	}

	const day = dt.getDate()
	const month = dt.getMonth()
	const year = dt.getFullYear()

	const monthLong = dt.toLocaleDateString('en-us', { month: 'long' })

	const firstDayOfMonth = new Date(year, month, 1)
	const daysInMonth = new Date(year, month + 1, 0).getDate()

	const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
		weekday: 'long',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	})

	document.getElementById('monthDisplay').innerText = `${monthLong} ${year}`

	const paddingDays = weekdays.indexOf(dateString.split(',')[0])

	calendar.innerText = ''

	for (let i = 1; i <= paddingDays + daysInMonth; i++) {
		const daySq = document.createElement('div')
		daySq.classList.add('day')

		if (i > paddingDays) {
			// generate day square
			daySq.innerText = i - paddingDays

			const dayString = `${month + 1}/${i - paddingDays}/${year}`

			const eventForDay = events.find((evt) => evt.date === dayString)

			if (i - paddingDays === day && nav === 0) {
				daySq.id = `currentDay`
			}

			if (eventForDay) {
				const eventDiv = document.createElement('div')
				eventDiv.classList.add('event')
				eventDiv.innerText = eventForDay.title
				daySq.appendChild(eventDiv)
			}

			daySq.addEventListener('click', () => {
				openModal(dayString)
			})
		} else {
			// generate padding square
			daySq.classList.add('padding')
		}
		calendar.appendChild(daySq)
	}
}

function closeModal() {
	eventTitleInput.classList.remove('error')
	newEventModal.style.display = 'none'
	backdropModal.style.display = 'none'
	deleteEventModal.style.display = 'none'
	eventTitleInput.value = ''
	clicked = null
	load()
}

function saveEvent() {
	if (eventTitleInput.value) {
		eventTitleInput.classList.remove('error')
		events.push({
			date: clicked,
			title: eventTitleInput.value,
		})
		localStorage.setItem('events', JSON.stringify(events))
		closeModal()
	} else {
		eventTitleInput.classList.add('error')
	}
}

function deleteEvent() {
	events = events.filter((evt) => evt.date !== clicked)
	localStorage.setItem('events', JSON.stringify(events))
	closeModal()
}

function initButtons() {
	document.getElementById('nextBtn').addEventListener('click', () => {
		nav++
		load()
	})
	document.getElementById('backBtn').addEventListener('click', () => {
		nav--
		load()
	})
	document.getElementById('saveBtn').addEventListener('click', saveEvent)
	document.getElementById('cancelBtn').addEventListener('click', closeModal)

	document.getElementById('deleteBtn').addEventListener('click', deleteEvent)
	document.getElementById('closeBtn').addEventListener('click', closeModal)
}

initButtons()
load()
