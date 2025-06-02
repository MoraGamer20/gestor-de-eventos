// Inicializar el almacenamiento
const eventStorage = new EventStorage()

// Función para renderizar eventos
function renderEvents(filter = "all") {
  const eventsContainer = document.getElementById("events-container")
  const events = eventStorage.getEvents(filter)

  eventsContainer.innerHTML = events
    .map(
      (event) => `
        <div class="event-card" data-id="${event.id}">
            <div class="event-header">
                <div>
                    <h3 class="event-title">${event.name}</h3>
                    <p class="event-date">${event.date} ${event.time || ""}</p>
                </div>
                <span class="status-badge status-${event.status}">${event.status}</span>
            </div>
            <div class="event-info">
                <p class="info-item">Ubicación: <span class="info-value">${event.location}</span></p>
                <p class="info-item">Categoría: <span class="info-value">${event.category}</span></p>
            </div>
        </div>
    `,
    )
    .join("")
}

// Gestión del modal de evento
const eventModal = document.getElementById("event-modal")
const createEventBtn = document.getElementById("create-event-btn")

// Mostrar el modal
createEventBtn.addEventListener("click", () => {
  eventModal.classList.add("show")
})

// Escuchar mensajes del iframe
window.addEventListener("message", (event) => {
  if (event.data === "closeModal") {
    eventModal.classList.remove("show")
  } else if (event.data.type === "eventCreated") {
    eventModal.classList.remove("show")
    const newEvent = eventStorage.addEvent(event.data.eventData)
    renderEvents()
  }
})

// Agregar listeners para los filtros
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
    e.target.classList.add("active")
    const filter = e.target.id.replace("filter-", "")
    renderEvents(filter)
  })
})

// Añadir manejador de clic para las tarjetas de evento
document.getElementById("events-container").addEventListener("click", (e) => {
  const eventCard = e.target.closest(".event-card")
  if (eventCard) {
    const eventId = eventCard.dataset.id
    // Redirigir a la página de gestión de asientos con el ID del evento
    window.location.href = `pages/event-management.html?eventId=${eventId}`
  }
})

// Cargar eventos iniciales
renderEvents()
