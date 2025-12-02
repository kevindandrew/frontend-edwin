# Frontend Edwin

**Frontend Edwin** es un sistema de gestión integral basado en web diseñado para manejar diversas operaciones comerciales, incluyendo administración, inventario, actividades comerciales, compras y mantenimiento técnico. Construido con tecnologías web modernas, ofrece una interfaz de usuario responsiva e intuitiva.

## 🚀 Tecnologías

Este proyecto aprovecha un conjunto robusto de tecnologías modernas para garantizar el rendimiento, la escalabilidad y la experiencia del desarrollador.

### Frameworks Principales

- **[Next.js 15](https://nextjs.org/)**: El Framework de React para la Web, utilizando el App Router para enrutamiento y diseños.
- **[React 18](https://react.dev/)**: Una biblioteca de JavaScript para construir interfaces de usuario.

### Estilos y UI

- **[Tailwind CSS 4](https://tailwindcss.com/)**: Un framework CSS de utilidad primero para el desarrollo rápido de UI.
- **[Radix UI](https://www.radix-ui.com/)**: Componentes accesibles y sin estilo para construir sistemas de diseño de alta calidad (vía [shadcn/ui](https://ui.shadcn.com/)).
- **[Lucide React](https://lucide.dev/)**: Iconos hermosos y consistentes.
- **[Tailwind Merge](https://github.com/dcastil/tailwind-merge) & [CLSX](https://github.com/lukeed/clsx)**: Utilidades para construir cadenas de className condicionalmente.

### Gestión de Estado y Formularios

- **[React Hook Form](https://react-hook-form.com/)**: Formularios performantes, flexibles y extensibles con validación fácil de usar.
- **[Zod](https://zod.dev/)**: Biblioteca de declaración y validación de esquemas TypeScript-first.
- **Custom Hooks**: Lógica encapsulada para peticiones API (`useFetch`), autenticación y datos específicos del módulo (ej., `useEquipos`, `useCompras`).

### Utilidades y Librerías

- **[date-fns](https://date-fns.org/)**: Biblioteca moderna de utilidad de fechas en JavaScript.
- **[Recharts](https://recharts.org/)**: Biblioteca de gráficos redefinida construida con React y D3.
- **[jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)**: Generación de PDF del lado del cliente.
- **[Sonner](https://sonner.emilkowal.ski/)**: Un componente de notificaciones (toast) con opinión para React.
- **[js-cookie](https://github.com/js-cookie/js-cookie)**: API de JavaScript simple y ligera para manejar cookies.

## 🌟 Características Clave

La aplicación está organizada en varios módulos distintos, cada uno sirviendo a un área operativa específica:

### 1. 🛡️ Módulo de Administración (`/app/admin`)

Control centralizado para administradores del sistema.

- **Gestión de Usuarios**: Crear, actualizar y gestionar usuarios y roles del sistema.
- **Registros de Auditoría**: Rastrea actividades y cambios del sistema.
- **Reportes**: Generar y ver reportes de todo el sistema.
- **Configuración Global**: Configurar parámetros de toda la aplicación.

### 2. 📦 Módulo de Inventario (`/app/admin/inventario`)

Seguimiento integral de activos físicos.

- **Gestión de Equipos**: Rastrea equipos biomédicos, estado e historial.
- **Repuestos**: Gestionar inventario de repuestos.
- **Fabricantes**: Base de datos de fabricantes de equipos.

### 3. 💼 Módulo Comercial (`/app/admin/ventas`, `/app/admin/clientes`)

Herramientas para ventas y gestión de relaciones con clientes.

- **Ventas**: Procesar y rastrear órdenes de venta.
- **Clientes**: Gestionar perfiles y datos de clientes.
- **Ubicaciones**: Manejar ubicaciones de clientes y puntos de entrega.

### 4. 🛒 Módulo de Compras (`/app/compras`)

Agiliza el proceso de adquisiciones.

- **Solicitudes**: Gestionar solicitudes de compra.
- **Presupuestos**: Rastrear y gestionar presupuestos de adquisiciones.
- **Proveedores**: Gestionar relaciones y datos de proveedores.

### 5. 🔧 Módulo Técnico (`/app/tecnico`, `/app/admin/mantenimiento`)

Enfocado en mantenimiento y soporte técnico.

- **Mantenimiento**: Programar y rastrear tareas de mantenimiento.
- **Datos Técnicos**: Gestionar especificaciones técnicas y documentación.
- **Técnicos**: Gestionar perfiles y asignaciones de técnicos.

## 📂 Estructura del Proyecto

```bash
frontend-edwin/
├── app/                    # Directorio App Router de Next.js
│   ├── admin/              # Rutas del módulo de administración
│   ├── compras/            # Rutas del módulo de compras
│   ├── login/              # Rutas de autenticación
│   ├── tecnico/            # Rutas del módulo técnico
│   ├── globals.css         # Estilos globales
│   └── layout.jsx          # Layout raíz
├── components/             # Componentes React reutilizables
│   ├── ui/                 # Primitivas de UI (botones, inputs, etc.)
│   ├── admin/              # Componentes específicos de admin
│   └── shared/             # Componentes compartidos entre módulos
├── hooks/                  # Hooks personalizados de React
│   ├── useFetch.js         # Hook genérico para peticiones API
│   ├── useEquipos.js       # Lógica de equipos
│   └── ...                 # Otros hooks específicos del dominio
├── public/                 # Activos estáticos
└── styles/                 # Archivos de estilo adicionales
```

## 🛠️ Comenzando

Sigue estas instrucciones para obtener una copia del proyecto y ejecutarla en tu máquina local.

### Prerrequisitos

- **Node.js**: Se recomienda la versión 18 o superior.
- **npm** o **pnpm**: Gestor de paquetes.

### Instalación

1.  **Clonar el repositorio:**

    ```bash
    git clone <url-del-repositorio>
    cd frontend-edwin
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    pnpm install
    ```

### Configuración

1.  **Variables de Entorno:**
    Crea un archivo `.env.local` en el directorio raíz para configurar tu entorno. Es posible que necesites definir variables como la URL base de tu API.

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    ```

    _(Nota: Revisa `hooks/useFetch.js` u otros archivos de configuración para confirmar los nombres exactos de las variables esperadas por la aplicación.)_

2.  **Configuración de Next.js:**
    El proyecto está configurado para ignorar errores de compilación de TypeScript y no optimizar imágenes para facilitar el desarrollo/despliegue en ciertos entornos (ver `next.config.mjs`).

### Ejecutando la Aplicación

1.  **Servidor de Desarrollo:**
    Inicia la aplicación en modo desarrollo con recarga en caliente (hot-reloading).

    ```bash
    npm run dev
    ```

    Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

2.  **Construcción para Producción:**
    Construye la aplicación para producción.

    ```bash
    npm run build
    ```

3.  **Iniciar Servidor de Producción:**
    Inicia el servidor usando la salida de la construcción.

    ```bash
    npm start
    ```

4.  **Linting:**
    Ejecuta el linter para verificar problemas de calidad de código.
    ```bash
    npm run lint
    ```

## 📄 Licencia

[Agregar Información de Licencia Aquí]
