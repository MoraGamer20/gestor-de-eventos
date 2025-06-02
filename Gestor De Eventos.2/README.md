# Sistema de Gestión de Eventos y Asientos

## Estructura del Proyecto

\`\`\`
public/
├── index.html                          # Página principal
├── pages/
│   └── event-management.html           # Gestión de asistentes y asientos
├── components/
│   └── modals/
│       └── event-form.html             # Modal para crear/editar eventos
├── assets/
│   ├── css/
│   │   ├── main.css                    # Estilos principales
│   │   ├── modal.css                   # Estilos para modales
│   │   └── event-management.css        # Estilos específicos de gestión
│   ├── js/
│   │   ├── main.js                     # JavaScript principal
│   │   ├── event-management.js         # Lógica de gestión de eventos
│   │   ├── services/
│   │   │   └── event-storage.js        # Servicio de almacenamiento
│   │   └── components/
│   │       └── event-form.js           # Lógica del formulario de eventos
│   └── images/
│       └── escudo-uat.png              # Logo institucional
└── data/
    └── events.json                     # Datos de eventos (opcional)
\`\`\`

## Características

- **Gestión de Eventos**: Crear, editar y eliminar eventos
- **Gestión de Asistentes**: Registrar asistentes con asignación de asientos
- **Configuración Flexible**: Organización por mesas o filas
- **Búsqueda**: Filtrado de asistentes por nombre, correo o asiento
- **Almacenamiento Local**: Persistencia de datos en localStorage
- **Interfaz Responsiva**: Diseño adaptable a diferentes dispositivos

## Uso

1. Abrir `index.html` en el navegador
2. Crear nuevos eventos usando el botón "Nuevo Evento"
3. Hacer clic en un evento para gestionar sus asistentes
4. Configurar la disposición de asientos (mesas o filas)
5. Registrar asistentes y asignar asientos

## Tecnologías

- HTML5
- CSS3 (Variables CSS, Grid, Flexbox)
- JavaScript ES6+
- LocalStorage para persistencia
