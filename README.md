# TechZocos - Sistema de Gestión de Usuarios y Datos Relacionados

TechZocos es una plataforma web moderna construida con **React 19**, **TypeScript** y **Vite**. Este proyecto sirve como el frontend oficial para administrar una organización, permitiendo el control de usuarios, estudios académicos y direcciones físicas, todo bajo un sistema robusto de roles y seguridad.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una estructura modular y limpia (Clean Architecture adaptable) separando la lógica de negocio de los componentes visuales:

```text
src/
├── assets/             # Recursos estáticos (Imágenes, logos)
├── core/               # El "cerebro" de la aplicación
│   ├── api/            # Instancias de Axios e Interceptores
│   ├── context/        # Providers de React (Auth, Idioma, Tema)
│   ├── router/         # Definición de rutas protegidas y públicas
│   ├── services/       # Comunicación con la API (Lógica de negocio)
│   └── types/          # Definiciones de TypeScript globales
├── pages/              # Vistas principales del sistema
│   ├── admin/          # Paneles exclusivos para Administradores
│   ├── auth/           # Login y flujos de autenticación
│   ├── dashboard/      # Panel de resumen dinámico
│   └── profile/        # Gestión de datos del usuario (Estudios/Direcciones)
├── shared/             # Componentes reutilizables y utilidades
│   ├── components/     # UI (Modales, Tablas, Layouts)
│   └── routes/         # Lógica de protección de rutas (AuthGuards)
└── test/               # Configuración global de Vitest
```

### ¿Por qué esta estructura?
- **Escalabilidad**: Al separar los servicios de los componentes, es fácil cambiar la lógica de la API sin romper la interfaz.
- **Mantenibilidad**: Los contextos globales permiten que cualquier parte del sistema conozca el idioma o el usuario autenticado sin pasar "props" infinitas.
- **Seguridad**: Las rutas están protegidas por lógica centralizada que redirige al login si el token expira o no existe.

---

## 🚀 Cómo Iniciar

### 1. Requisitos Previos
- **Node.js**: Versión 18 o superior recomendada.
- **Backend**: El servidor de TechZocos debe estar corriendo (generalmente en el puerto 5000).

### 2. Configuración de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo:
```bash
cp .env.example .env
```
Asegúrate de configurar la URL de tu API:
`VITE_API_URL=http://localhost:5000/api`

### 3. Instalación y Ejecución
```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Ejecutar la suite de tests
npm test

# Generar build para producción
npm run build
```

---

## 🛠️ Tecnologías Utilizadas

- **React 19 & Vite**: Para un renderizado ultra-rápido y desarrollo fluido.
- **Tailwind CSS**: Diseño moderno, responsivo y modo oscuro nativo.
- **Vitest & React Testing Library**: Garantía de calidad con 29+ tests automatizados.
- **Lucide React**: Set de iconos consistentes y elegantes.
- **Sonner**: Sistema de notificaciones (Toasts) no intrusivas.
- **Axios**: Cliente HTTP con interceptores para inyección automática de Bearer Token.

---

## 🔑 Características Principales

### 🔒 Autenticación y Autorización
- Sistema de login persistente (sessionStorage).
- Interceptor de respuesta que redirige al login si el token expira (401).
- Logout sincronizado con la API para invalidación de sesiones.

### 🌐 Internacionalización
- Sistema bilingüe Completo (**Español** e **Inglés**).
- Soporte para etiquetas dinámicas y mensajes de éxito/error traducidos.

### 🌓 Dark Mode
- Interfaz adaptable al tema del sistema o preferencia del usuario.
- Paleta de colores optimizada para reducir la fatiga visual.

### 📱 Diseño Responsivo
- Sidebar dinámico (drawer en móviles).
- Uso de **React Portals** para modales, asegurando una experiencia visual perfecta en cualquier resolución sin problemas de z-index o recortes.

---

## ⚠️ A tener en cuenta

- **Tokens**: El token JWT se inyecta automáticamente en cada petición si existe en la sesión.
- **Cierre de Sesión**: Al hacer logout, el sistema intenta avisar a la API y garantiza la limpieza local de datos sensibles.
- **Paginación**: Los listados de administración y perfil están limitados a **5 elementos por página** para optimizar el rendimiento.
- **Formularios**: Se utiliza el hook `useActionState` de React 19 para un manejo eficiente de estados de carga y errores en formularios de autenticación.

---

Desarrollado con ❤️ para **TechZocos**.
