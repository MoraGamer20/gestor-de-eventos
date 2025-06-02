let asistentes = []
let contador = 1
let idEditando = null
let asientosDisponibles = []
let asientosOcupados = {}
let modoActual = "mesa"
let currentEventId = null

function getEventIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("eventId")
}

function loadEventConfiguration() {
  const eventId = getEventIdFromUrl()
  if (eventId) {
    currentEventId = eventId
    const eventConfig = localStorage.getItem(`event_${eventId}_config`)
    if (eventConfig) {
      const config = JSON.parse(eventConfig)
      document.getElementById("tipoOrganizacion").value = config.tipo || "mesa"
      document.getElementById("numMesas").value = config.numMesas || 10
      document.getElementById("asientosPorMesa").value = config.asientosPorMesa || 8
      document.getElementById("numFilas").value = config.numFilas || 5
      document.getElementById("asientosPorFila").value = config.asientosPorFila || 10

      const savedAsistentes = localStorage.getItem(`event_${eventId}_asistentes`)
      if (savedAsistentes) {
        asistentes = JSON.parse(savedAsistentes)
        asientosOcupados = {}
        asistentes.forEach((a) => {
          asientosOcupados[a.ubicacion] = a.nombre
        })

        // Actualizar el contador para evitar IDs duplicados
        if (asistentes.length > 0) {
          contador = Math.max(...asistentes.map((a) => a.id)) + 1
        }
      }
    }
  }
  cambiarModo()
  actualizarSelectorFilas()
  actualizarSelectorMesas()

  // AGREGAR ESTAS LÍNEAS AL FINAL:
  // Actualizar la tabla con los asistentes cargados
  actualizarTabla()
  // Actualizar la lista de asientos disponibles
  actualizarListaAsientosDisponibles()
  // Actualizar la visualización de asientos
  actualizarVisualizacionAsientos()
}

function guardarConfiguracion() {
  if (!currentEventId) return

  const config = {
    tipo: document.getElementById("tipoOrganizacion").value,
    numMesas: document.getElementById("numMesas").value,
    asientosPorMesa: document.getElementById("asientosPorMesa").value,
    numFilas: document.getElementById("numFilas").value,
    asientosPorFila: document.getElementById("asientosPorFila").value,
  }

  localStorage.setItem(`event_${currentEventId}_config`, JSON.stringify(config))
  localStorage.setItem(`event_${currentEventId}_asistentes`, JSON.stringify(asistentes))
}

function guardarCambiosYSalir() {
  guardarConfiguracion()
  alert("Cambios guardados correctamente")
  volverInicio()
}

function volverInicio() {
  window.location.href = "../index.html"
}

function cambiarModo() {
  modoActual = document.getElementById("tipoOrganizacion").value
  document.getElementById("campo-mesas").style.display = modoActual === "mesa" ? "block" : "none"
  document.getElementById("campo-filas-asientos").style.display = modoActual === "filaAsiento" ? "block" : "none"

  asientosDisponibles = []
  asientosOcupados = {}
  actualizarListaAsientosDisponibles()
  actualizarVisualizacionAsientos()

  if (modoActual === "mesa") {
    generarMesas()
  } else {
    generarAsientos()
  }
}

function generarAsientos() {
  const numFilas = Number.parseInt(document.getElementById("numFilas").value, 10) || 5
  const asientosPorFila = Number.parseInt(document.getElementById("asientosPorFila").value, 10) || 10
  const configuracionFilas = obtenerConfiguracionFilas()

  asientosDisponibles = []

  const maxFilas = Math.min(numFilas, 26)

  for (let i = 0; i < maxFilas; i++) {
    const letraFila = String.fromCharCode(65 + i)
    const cantidad = configuracionFilas[letraFila] || asientosPorFila

    for (let j = 1; j <= cantidad; j++) {
      asientosDisponibles.push(`${letraFila}${j}`)
    }
  }

  actualizarListaAsientosDisponibles()
  actualizarVisualizacionAsientos()
  actualizarSelectorFilas()
}

function generarMesas() {
  const numMesas = Number.parseInt(document.getElementById("numMesas").value, 10) || 10
  const asientosPorMesa = Number.parseInt(document.getElementById("asientosPorMesa").value, 10) || 8
  const configuracionMesas = obtenerConfiguracionMesas()

  asientosDisponibles = []

  for (let i = 1; i <= numMesas; i++) {
    const cantidad = configuracionMesas[i] || asientosPorMesa
    for (let j = 1; j <= cantidad; j++) {
      asientosDisponibles.push(`Mesa ${i}, Asiento ${j}`)
    }
  }

  actualizarListaAsientosDisponibles()
  actualizarVisualizacionAsientos()
  actualizarSelectorMesas()
}

function actualizarListaAsientosDisponibles() {
  const selectAsientos = document.getElementById("asientosDisponibles")
  selectAsientos.innerHTML = '<option value="">-- Selecciona un asiento --</option>'

  const disponibles = asientosDisponibles.filter((a) => !asientosOcupados[a])

  disponibles.forEach((asiento) => {
    const option = document.createElement("option")
    option.value = asiento
    option.textContent = asiento
    selectAsientos.appendChild(option)
  })
}

function actualizarVisualizacionAsientos() {
  const container = document.getElementById("visualizacion-asientos")
  container.innerHTML = ""

  if (asientosDisponibles.length === 0) {
    container.innerHTML = "<p>Por favor, configura y genera los asientos primero.</p>"
    return
  }

  // Encontrar el número máximo de asientos por fila
  let maxAsientosPorFila = 0
  if (modoActual === "filaAsiento") {
    const filas = {}
    asientosDisponibles.forEach((asiento) => {
      const fila = asiento.charAt(0)
      const numero = Number.parseInt(asiento.slice(1))
      filas[fila] = filas[fila] ? Math.max(filas[fila], numero) : numero
    })
    maxAsientosPorFila = Math.max(...Object.values(filas))
  } else {
    const mesas = {}
    asientosDisponibles.forEach((asiento) => {
      const [mesa, numAsiento] = asiento.split(", Asiento ")
      const mesaNum = mesa.replace("Mesa ", "")
      mesas[mesaNum] = mesas[mesaNum]
        ? Math.max(mesas[mesaNum], Number.parseInt(numAsiento))
        : Number.parseInt(numAsiento)
    })
    maxAsientosPorFila = Math.max(...Object.values(mesas))
  }

  // Establecer la variable CSS para el grid
  container.style.setProperty("--max-asientos", maxAsientosPorFila)

  if (modoActual === "filaAsiento") {
    // Agrupar asientos por fila
    const filas = {}
    asientosDisponibles.forEach((asiento) => {
      const fila = asiento.charAt(0)
      if (!filas[fila]) filas[fila] = new Array(maxAsientosPorFila).fill(null)
      const numero = Number.parseInt(asiento.slice(1)) - 1
      filas[fila][numero] = asiento
    })

    // Crear el layout manteniendo espacios vacíos
    Object.keys(filas)
      .sort()
      .forEach((fila) => {
        const filaDiv = document.createElement("div")
        filaDiv.className = "fila-asientos"

        filas[fila].forEach((asiento, index) => {
          const div = document.createElement("div")
          if (asiento) {
            div.className = "asiento" + (asientosOcupados[asiento] ? " ocupado" : "")
            div.textContent = asiento
            div.title = asientosOcupados[asiento] ? `Ocupado por: ${asientosOcupados[asiento]}` : "Disponible"
            div.addEventListener("click", () => seleccionarAsiento(asiento))
          } else {
            div.className = "asiento espacio-vacio"
            div.textContent = "—"
          }
          container.appendChild(div)
        })
      })
  } else {
    // Lógica similar para mesas
    const mesas = {}
    asientosDisponibles.forEach((asiento) => {
      const [mesa, numAsiento] = asiento.split(", Asiento ")
      const mesaNum = Number.parseInt(mesa.replace("Mesa ", ""))
      if (!mesas[mesaNum]) mesas[mesaNum] = new Array(maxAsientosPorFila).fill(null)
      mesas[mesaNum][Number.parseInt(numAsiento) - 1] = asiento
    })

    Object.keys(mesas)
      .sort((a, b) => a - b)
      .forEach((mesa) => {
        const mesaDiv = document.createElement("div")
        mesaDiv.className = "fila-asientos"

        mesas[mesa].forEach((asiento, index) => {
          const div = document.createElement("div")
          if (asiento) {
            div.className = "asiento" + (asientosOcupados[asiento] ? " ocupado" : "")
            div.textContent = asiento
            div.title = asientosOcupados[asiento] ? `Ocupado por: ${asientosOcupados[asiento]}` : "Disponible"
            div.addEventListener("click", () => seleccionarAsiento(asiento))
          } else {
            div.className = "asiento espacio-vacio"
            div.textContent = "—"
          }
          container.appendChild(div)
        })
      })
  }
}

function seleccionarAsiento(asiento) {
  if (asientosOcupados[asiento]) {
    alert(`Este asiento está ocupado por: ${asientosOcupados[asiento]}`)
    return
  }

  document.getElementById("asientosDisponibles").value = asiento

  document.querySelectorAll(".asiento.seleccionado").forEach((el) => {
    el.classList.remove("seleccionado")
  })

  document.querySelectorAll(".asiento").forEach((el) => {
    if (el.textContent === asiento) {
      el.classList.add("seleccionado")
    }
  })
}

function agregarAsistente() {
  const nombre = document.getElementById("nombre").value.trim()
  const correo = document.getElementById("correo").value.trim()
  const ubicacion = document.getElementById("asientosDisponibles").value

  if (!nombre || !correo || !ubicacion) {
    alert("Por favor, completa todos los campos y selecciona un asiento.")
    return
  }

  if (idEditando) {
    const index = asistentes.findIndex((a) => a.id === idEditando)
    if (index !== -1) {
      delete asientosOcupados[asistentes[index].ubicacion]
      asistentes[index] = { id: idEditando, nombre, correo, ubicacion }
      asientosOcupados[ubicacion] = nombre
    }
    idEditando = null
  } else {
    asistentes.push({ id: contador++, nombre, correo, ubicacion })
    asientosOcupados[ubicacion] = nombre
  }

  actualizarTabla()
  actualizarListaAsientosDisponibles()
  actualizarVisualizacionAsientos()
  limpiarCampos()
  guardarConfiguracion()
}

function actualizarTabla() {
  const tbody = document.querySelector("#tabla-asistentes tbody")
  tbody.innerHTML = ""

  asistentes.forEach((a, i) => {
    const fila = document.createElement("tr")
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${a.nombre}</td>
      <td>${a.correo}</td>
      <td>${a.ubicacion}</td>
      <td class="acciones">
        <button class="btn-editar" onclick="editarAsistente(${a.id})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarAsistente(${a.id})">Eliminar</button>
      </td>
    `
    tbody.appendChild(fila)
  })
}

function eliminarAsistente(id) {
  if (confirm("¿Deseas eliminar este asistente?")) {
    const asistente = asistentes.find((a) => a.id === id)
    if (asistente) {
      delete asientosOcupados[asistente.ubicacion]
    }

    asistentes = asistentes.filter((a) => a.id !== id)
    actualizarTabla()
    actualizarListaAsientosDisponibles()
    actualizarVisualizacionAsientos()
    guardarConfiguracion()
  }
}

function editarAsistente(id) {
  const asistente = asistentes.find((a) => a.id === id)
  if (!asistente) return

  idEditando = id
  document.getElementById("nombre").value = asistente.nombre
  document.getElementById("correo").value = asistente.correo
  document.getElementById("asientosDisponibles").value = asistente.ubicacion

  document.querySelectorAll(".asiento").forEach((el) => {
    el.classList.remove("seleccionado")
    if (el.textContent === asistente.ubicacion) {
      el.classList.add("seleccionado")
    }
  })
}

function limpiarCampos() {
  document.getElementById("nombre").value = ""
  document.getElementById("correo").value = ""
  document.getElementById("asientosDisponibles").value = ""

  document.querySelectorAll(".asiento.seleccionado").forEach((el) => {
    el.classList.remove("seleccionado")
  })
}

function actualizarSelectorFilas() {
  const numFilas = Number.parseInt(document.getElementById("numFilas").value, 10) || 5
  const selectorFilas = document.getElementById("filaIndividual")
  selectorFilas.innerHTML = ""

  for (let i = 0; i < Math.min(numFilas, 26); i++) {
    const letraFila = String.fromCharCode(65 + i)
    const option = document.createElement("option")
    option.value = letraFila
    option.textContent = `Fila ${letraFila}`
    selectorFilas.appendChild(option)
  }
  actualizarResumenFilas()
}

function actualizarFilaIndividual() {
  const fila = document.getElementById("filaIndividual").value
  const numAsientos = Number.parseInt(document.getElementById("asientosFila").value, 10)

  if (!fila || isNaN(numAsientos) || numAsientos < 1) {
    alert("Por favor, ingrese valores válidos")
    return
  }

  const configuracionFilas = obtenerConfiguracionFilas()
  configuracionFilas[fila] = numAsientos
  localStorage.setItem(`event_${currentEventId}_filas`, JSON.stringify(configuracionFilas))

  actualizarResumenFilas()
  generarAsientos()
}

function obtenerConfiguracionFilas() {
  if (!currentEventId) return {}
  const config = localStorage.getItem(`event_${currentEventId}_filas`)
  return config ? JSON.parse(config) : {}
}

function actualizarResumenFilas() {
  const resumenDiv = document.getElementById("resumen-filas")
  const configuracion = obtenerConfiguracionFilas()

  let html = "<h4>Resumen de configuración:</h4><ul>"
  for (const [fila, asientos] of Object.entries(configuracion)) {
    html += `<li>Fila ${fila}: ${asientos} asientos</li>`
  }
  html += "</ul>"

  resumenDiv.innerHTML = html
}

function actualizarSelectorMesas() {
  const numMesas = Number.parseInt(document.getElementById("numMesas").value, 10) || 10
  const selectorMesas = document.getElementById("mesaIndividual")
  selectorMesas.innerHTML = ""

  for (let i = 1; i <= numMesas; i++) {
    const option = document.createElement("option")
    option.value = i
    option.textContent = `Mesa ${i}`
    selectorMesas.appendChild(option)
  }
  actualizarResumenMesas()
}

function actualizarMesaIndividual() {
  const mesa = document.getElementById("mesaIndividual").value
  const numAsientos = Number.parseInt(document.getElementById("asientosMesa").value, 10)

  if (!mesa || isNaN(numAsientos) || numAsientos < 1) {
    alert("Por favor, ingrese valores válidos")
    return
  }

  const configuracionMesas = obtenerConfiguracionMesas()
  configuracionMesas[mesa] = numAsientos
  localStorage.setItem(`event_${currentEventId}_mesas`, JSON.stringify(configuracionMesas))

  actualizarResumenMesas()
  generarMesas()
}

function obtenerConfiguracionMesas() {
  if (!currentEventId) return {}
  const config = localStorage.getItem(`event_${currentEventId}_mesas`)
  return config ? JSON.parse(config) : {}
}

function actualizarResumenMesas() {
  const resumenDiv = document.getElementById("resumen-mesas")
  const configuracion = obtenerConfiguracionMesas()

  let html = "<h4>Resumen de configuración:</h4><ul>"
  for (const [mesa, asientos] of Object.entries(configuracion)) {
    html += `<li>Mesa ${mesa}: ${asientos} asientos</li>`
  }
  html += "</ul>"

  resumenDiv.innerHTML = html
}

// Buscador de asistentes confirmados
function filtrarAsistentesConfirmados() {
  const query = document.getElementById("buscador-asistentes").value.trim().toLowerCase()
  const resultadosDiv = document.getElementById("resultados-busqueda")
  const resultadosBody = document.getElementById("resultados-busqueda-body")
  if (!query) {
    resultadosDiv.style.display = "none"
    resultadosBody.innerHTML = ""
    return
  }
  // Filtrar por nombre, correo o asiento
  const filtrados = asistentes.filter(
    (a) =>
      (a.nombre && a.nombre.toLowerCase().includes(query)) ||
      (a.correo && a.correo.toLowerCase().includes(query)) ||
      (a.ubicacion && a.ubicacion.toLowerCase().includes(query)),
  )
  if (filtrados.length === 0) {
    resultadosBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#888;">No se encontraron asistentes.</td></tr>`
  } else {
    resultadosBody.innerHTML = filtrados
      .map(
        (a) =>
          `<tr>
        <td style="padding:8px;">${a.ubicacion}</td>
        <td style="padding:8px;">${a.nombre}</td>
        <td style="padding:8px;">${a.correo}</td>
      </tr>`,
      )
      .join("")
  }
  resultadosDiv.style.display = "block"
}

function verificarDatosGuardados() {
  if (!currentEventId) return

  const savedAsistentes = localStorage.getItem(`event_${currentEventId}_asistentes`)
  const savedConfig = localStorage.getItem(`event_${currentEventId}_config`)

  console.log("Datos guardados encontrados:", {
    asistentes: savedAsistentes ? JSON.parse(savedAsistentes).length : 0,
    configuracion: !!savedConfig,
  })
}

window.onload = () => {
  loadEventConfiguration()
  verificarDatosGuardados()
}
