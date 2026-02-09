# 🚀 NextCMS: Enterprise-Grade Role-Based CMS

NextCMS es una solución de gestión de contenido robusta y escalable construida sobre el **Next.js 14 App Router**. Diseñada con una arquitectura limpia y un enfoque en la seguridad, permite una gestión granular de permisos mediante un sistema de Control de Acceso Basado en Roles (RBAC).

## 🛠 Tech Stack

*   **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (Type-safety de extremo a extremo)
*   **Autenticación:** [NextAuth.js](https://next-auth.js.org/) con estrategias de sesión seguras.
*   **ORM:** [Prisma](https://www.prisma.io/) para modelado de datos y migraciones.
*   **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) (Optimizado para [Neon](https://neon.tech/)).
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/).
*   **Infraestructura:** Server Actions para mutaciones de datos y Middleware para protección de rutas.

## ✨ Características Principales

### 🔐 Control de Acceso Granular (RBAC)
Implementación de seguridad por capas:
- **Admin:** Control total del sistema, gestión de usuarios y configuraciones críticas.
- **Editor:** Gestión completa del ciclo de vida del contenido (CRUD de posts y categorías).
- **Viewer:** Acceso de solo lectura al panel administrativo y contenido restringido.

### 🚀 Rendimiento y SEO
- **Server-Side Rendering (SSR):** Generación de páginas en el servidor para una carga instantánea.
- **Optimización de Imágenes:** Uso del componente `next/image` para WebP y Lazy Loading.
- **Metadatos Dinámicos:** Configuración avanzada de SEO para cada entrada del blog.

### 🏗 Arquitectura Limpia
- **Server Actions:** Lógica de negocio encapsulada en el servidor, eliminando la necesidad de APIs REST redundantes.
- **Modularidad:** Componentes desacoplados y reutilizables bajo el patrón de diseño atómico.
- **Seguridad:** Validación de esquemas con Zod y protección contra CSRF/XSS nativa de Next.js.

## 📂 Estructura del Proyecto

```text
nextcms/
├── app/                # Next.js App Router (Rutas, Layouts, Server Actions)
│   ├── (auth)/         # Flujos de autenticación
│   ├── (dashboard)/    # Panel de administración protegido
│   └── api/            # Endpoints de API necesarios
├── components/         # Componentes de UI reutilizables
├── lib/                # Configuraciones compartidas (Prisma, Utils, Mail)
├── prisma/             # Esquema de base de datos y migraciones
├── public/             # Assets estáticos
└── types/              # Definiciones de tipos globales
```

## 🚀 Configuración del Entorno

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/maxiguaymas/nextcms.git
    cd nextcms
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Variables de Entorno:**
    Crea un archivo `.env` en la raíz basado en el siguiente ejemplo:
    ```dosini
    # Database (Neon/PostgreSQL)
    DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

    # NextAuth Configuration
    NEXTAUTH_SECRET="tu_secret_muy_seguro"
    NEXTAUTH_URL="http://localhost:3000"

    # Email Service (Opcional)
    EMAIL_SERVER_HOST="smtp.example.com"
    EMAIL_SERVER_PORT=587
    EMAIL_FROM="noreply@nextcms.com"
    ```

4.  **Preparar la Base de Datos:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```

## 🛡 Seguridad

El proyecto utiliza un **Middleware de Next.js** para interceptar las peticiones y validar la sesión del usuario antes de renderizar rutas protegidas. Las Server Actions validan los permisos del rol del usuario en cada ejecución para prevenir escalada de privilegios.

## 📈 Roadmap

- [ ] Implementación de búsqueda con Full-text search.
- [ ] Sistema de comentarios con moderación.
- [ ] Dashboard con analíticas en tiempo real.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---
Desarrollado por Maxi Guaymas
