# Frontend Edwin

**Frontend Edwin** is a comprehensive web-based management system designed to handle various business operations including administration, inventory, commercial activities, purchasing, and technical maintenance. Built with modern web technologies, it offers a responsive and intuitive user interface.

## 🚀 Tech Stack

This project leverages a robust stack of modern technologies to ensure performance, scalability, and developer experience.

### Core Frameworks

- **[Next.js 15](https://nextjs.org/)**: The React Framework for the Web, utilizing the App Router for routing and layouts.
- **[React 18](https://react.dev/)**: A JavaScript library for building user interfaces.

### Styling & UI

- **[Tailwind CSS 4](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
- **[Radix UI](https://www.radix-ui.com/)**: Unstyled, accessible components for building high-quality design systems (via [shadcn/ui](https://ui.shadcn.com/)).
- **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icons.
- **[Tailwind Merge](https://github.com/dcastil/tailwind-merge) & [CLSX](https://github.com/lukeed/clsx)**: Utilities for constructing className strings conditionally.

### State Management & Forms

- **[React Hook Form](https://react-hook-form.com/)**: Performant, flexible and extensible forms with easy-to-use validation.
- **[Zod](https://zod.dev/)**: TypeScript-first schema declaration and validation library.
- **Custom Hooks**: Encapsulated logic for API fetching (`useFetch`), authentication, and module-specific data (e.g., `useEquipos`, `useCompras`).

### Utilities & Libraries

- **[date-fns](https://date-fns.org/)**: Modern JavaScript date utility library.
- **[Recharts](https://recharts.org/)**: Redefined chart library built with React and D3.
- **[jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)**: Client-side PDF generation.
- **[Sonner](https://sonner.emilkowal.ski/)**: An opinionated toast component for React.
- **[js-cookie](https://github.com/js-cookie/js-cookie)**: Simple, lightweight JavaScript API for handling cookies.

## 🌟 Key Features

The application is organized into several distinct modules, each serving a specific operational area:

### 1. 🛡️ Admin Module (`/app/admin`)

Centralized control for system administrators.

- **User Management**: Create, update, and manage system users and roles.
- **Audit Logs**: Track system activities and changes.
- **Reports**: Generate and view system-wide reports.
- **Global Settings**: Configure application-wide parameters.

### 2. 📦 Inventory Module (`/app/admin/inventario`)

Comprehensive tracking of physical assets.

- **Equipment Management**: Track biomedical equipment, status, and history.
- **Spare Parts**: Manage inventory of spare parts (`repuestos`).
- **Manufacturers**: Database of equipment manufacturers.

### 3. 💼 Commercial Module (`/app/admin/ventas`, `/app/admin/clientes`)

Tools for sales and customer relationship management.

- **Sales**: Process and track sales orders.
- **Customers**: Manage customer profiles and data.
- **Locations**: Handle customer locations and delivery points.

### 4. 🛒 Purchasing Module (`/app/compras`)

Streamlines the procurement process.

- **Requests**: Manage purchase requests (`solicitudes`).
- **Budgets**: Track and manage procurement budgets (`presupuesto`).
- **Suppliers**: Manage vendor relationships and data.

### 5. 🔧 Technical Module (`/app/tecnico`, `/app/admin/mantenimiento`)

Focused on maintenance and technical support.

- **Maintenance**: Schedule and track maintenance tasks.
- **Technical Data**: Manage technical specifications and documentation.
- **Technicians**: Manage technician profiles and assignments.

## 📂 Project Structure

```bash
frontend-edwin/
├── app/                    # Next.js App Router directory
│   ├── admin/              # Admin module routes
│   ├── compras/            # Purchasing module routes
│   ├── login/              # Authentication routes
│   ├── tecnico/            # Technical module routes
│   ├── globals.css         # Global styles
│   └── layout.jsx          # Root layout
├── components/             # Reusable React components
│   ├── ui/                 # UI primitives (buttons, inputs, etc.)
│   ├── admin/              # Admin-specific components
│   └── shared/             # Shared components across modules
├── hooks/                  # Custom React hooks
│   ├── useFetch.js         # Generic API fetch hook
│   ├── useEquipos.js       # Equipment logic
│   └── ...                 # Other domain-specific hooks
├── public/                 # Static assets
└── styles/                 # Additional style files
```

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- **Node.js**: Version 18 or higher is recommended.
- **npm** or **pnpm**: Package manager.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd frontend-edwin
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

### Configuration

1.  **Environment Variables:**
    Create a `.env.local` file in the root directory to configure your environment. You may need to define variables such as your API base URL.

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    ```

    _(Note: Check `hooks/useFetch.js` or other configuration files to confirm the exact variable names expected by the application.)_

2.  **Next.js Config:**
    The project is configured to ignore TypeScript build errors and unoptimize images for easier development/deployment in certain environments (see `next.config.mjs`).

### Running the Application

1.  **Development Server:**
    Start the application in development mode with hot-reloading.

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

2.  **Production Build:**
    Build the application for production.

    ```bash
    npm run build
    ```

3.  **Start Production Server:**
    Start the server using the build output.

    ```bash
    npm start
    ```

4.  **Linting:**
    Run the linter to check for code quality issues.
    ```bash
    npm run lint
    ```

## 📄 License

[Add License Information Here]
