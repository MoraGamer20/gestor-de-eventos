// Script para la validación y funcionalidades básicas del formulario
// Este script solo implementa las validaciones de ejemplo

// Referencia a elementos del DOM
const eventForm = document.getElementById("event-form")
const eventNameInput = document.getElementById("event-name")
const eventDateInput = document.getElementById("event-date")
const eventLocationInput = document.getElementById("event-location")
const eventCategorySelect = document.getElementById("event-category")
const eventStatusSelect = document.getElementById("event-status")
const colorOptions = document.querySelectorAll(".color-option")
const eventColorInput = document.getElementById("event-color")

// Configurar fecha mínima en el campo de fecha (hoy)
const today = new Date()
const yyyy = today.getFullYear()
const mm = String(today.getMonth() + 1).padStart(2, "0")
const dd = String(today.getDate()).padStart(2, "0")
const todayFormatted = `${yyyy}-${mm}-${dd}`
eventDateInput.setAttribute("min", todayFormatted)

// Manejo de la selección de color
colorOptions.forEach((option) => {
  option.addEventListener("click", function () {
    // Quitar selección previa
    colorOptions.forEach((opt) => opt.classList.remove("selected"))
    // Marcar como seleccionado
    this.classList.add("selected")
    // Guardar el valor del color
    eventColorInput.value = this.getAttribute("data-color")
  })
})

// Validación del formulario
eventForm.addEventListener("submit", (e) => {
  e.preventDefault()

  let isValid = true

  // Validar nombre del evento
  if (!eventNameInput.value.trim()) {
    document.getElementById("event-name-error").style.display = "block"
    isValid = false
  } else {
    document.getElementById("event-name-error").style.display = "none"
  }

  // Validar fecha del evento
  if (!eventDateInput.value) {
    document.getElementById("event-date-error").style.display = "block"
    isValid = false
  } else {
    // Validar que la fecha no sea anterior a hoy si el estado es "activo"
    if (eventStatusSelect.value === "active") {
      const selectedDate = new Date(eventDateInput.value)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Resetear hora para comparar solo fechas

      if (selectedDate < today) {
        document.getElementById("event-date-error").style.display = "block"
        isValid = false
      } else {
        document.getElementById("event-date-error").style.display = "none"
      }
    } else {
      document.getElementById("event-date-error").style.display = "none"
    }
  }

  // Validar ubicación
  if (!eventLocationInput.value.trim()) {
    document.getElementById("event-location-error").style.display = "block"
    isValid = false
  } else {
    document.getElementById("event-location-error").style.display = "none"
  }

  // Validar categoría
  if (!eventCategorySelect.value) {
    document.getElementById("event-category-error").style.display = "block"
    isValid = false
  } else {
    document.getElementById("event-category-error").style.display = "none"
  }

  // Si todo es válido, enviar datos al padre
  if (isValid) {
    const eventData = {
      name: eventNameInput.value,
      date: eventDateInput.value,
      time: document.getElementById("event-time").value,
      location: eventLocationInput.value,
      category: eventCategorySelect.value,
      status: eventStatusSelect.value,
      capacity: document.getElementById("event-capacity").value,
      color: eventColorInput.value,
      description: document.getElementById("event-description").value,
    }

    window.parent.postMessage(
      {
        type: "eventCreated",
        eventData: eventData,
      },
      "*",
    )
  }
})

// Botones de cancelar y cerrar
document.getElementById("cancel-event-btn").addEventListener("click", () => {
  window.parent.postMessage("closeModal", "*")
})

document.getElementById("close-event-modal").addEventListener("click", () => {
  window.parent.postMessage("closeModal", "*")
})
