# 🎟️ Gestor de Eventos y Asientos

Sistema web para la gestión integral de eventos y asignación de asientos, desarrollado como proyecto institucional para la Universidad Autónoma de Tamaulipas.

---

## 🚀 Características Principales

- **Gestión de Eventos**: Crear, editar y administrar eventos con información completa.
- **Asignación de Asientos**: Sistema flexible de organización por mesas o filas.
- **Registro de Asistentes**: Control completo de participantes con asignación automática.
- **Búsqueda Avanzada**: Filtrado de asistentes por nombre, correo o ubicación.
- **Persistencia Local**: Almacenamiento automático mediante localStorage.
- **Interfaz Responsiva**: Diseño adaptable a dispositivos móviles y de escritorio.

---

## 📁 Estructura del Proyecto

```plaintext
public/
├── index.html                          # Página principal - Lista de eventos
├── pages/
│   └── event-management.html           # Gestión de asistentes y asientos
├── components/
│   └── modals/
│       └── event-form.html             # Modal para crear/editar eventos
├── assets/
│   ├── css/
│   │   ├── main.css                    # Estilos generales
│   │   ├── modal.css                   # Estilos para ventanas modales
│   │   └── event-management.css        # Estilos de gestión
│   ├── js/
│   │   ├── main.js                     # Lógica principal
│   │   ├── event-management.js         # Lógica de eventos/asientos
│   │   ├── services/
│   │   │   └── event-storage.js        # Manejo de datos en localStorage
│   │   └── components/
│   │       └── event-form.js           # Formulario modular de eventos
│   └── images/
│       └── escudo-uat.png              # Logo institucional
└── data/
    └── events.json                     # Estructura de datos de eventos
````

---

## 🛠️ Tecnologías Utilizadas

* **Frontend**: HTML5, CSS3, JavaScript ES6+
* **Diseño**: CSS Grid, Flexbox, Variables CSS
* **Persistencia**: LocalStorage API
* **Arquitectura**: Modular y orientada a componentes

---

## 📋 Funcionalidades Detalladas

### 🎯 Gestión de Eventos

* Creación con nombre, fecha, ubicación y categoría.
* Estados: Activo, Inactivo, Finalizado.
* Filtros y colores personalizados.

### 🪑 Configuración de Asientos

* **Modo Mesa**: Configuración por mesas con número de asientos.
* **Modo Fila**: Filas alfabéticas (A-Z) con numeración.
* Mapa visual de asientos personalizable.

### 🙋 Gestión de Asistentes

* Registro con nombre, correo y teléfono.
* Asignación automática de asientos disponibles.
* Búsqueda en tiempo real y validaciones.

---

## 📦 Persistencia de Datos

Se usa `localStorage` para conservar información entre sesiones:

* `events`
* `event_{id}_config`
* `event_{id}_asistentes`
* `event_{id}_filas`
* `event_{id}_mesas`

---

## 🎨 Personalización

### 🎓 Colores Institucionales UAT

* Azul: `#07405a`
* Naranja: `#e76a24`

### 📱 Responsive Design

* Adaptado desde 320px hasta pantallas 4K.
* Navegación móvil optimizada.
* Interfaz con tarjetas y diseño modular.

---

## 🔧 Buenas Prácticas

* Separación de lógica y vista.
* Código documentado, legible y accesible.
* Validaciones y manejo de errores implementados.

---

## 📱 Compatibilidad

* **Navegadores**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
* **Dispositivos**: Escritorio, tablet y smartphone

---

## 🆘 Soporte

> Universidad Autónoma de Tamaulipas
> Centro Universitario Victoria
> Tel: (834) 318 1800

---

**Desarrollado por Kevin Alejandro Morado Ortega**
*Sistema de gestión de eventos institucionales*

