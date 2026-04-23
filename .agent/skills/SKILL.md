---
name: nextcms-workflow
description: >
  Flujo de trabajo específico para el proyecto NextCMS.
  Trigger: Cuando se trabaja en el proyecto nextcms, se crean nuevas features,
  se modifican modelos de datos, o se implementan páginas.
license: Apache-2.0
metadata:
  author: maximiliano
  version: "1.0"
---

## Cuando Usar Esta Skill

Esta skill se carga automáticamente cuando:
- Se trabaja en cualquier archivo dentro del proyecto nextcms
- Se crean nuevas rutas en `app/`
- Se modifican modelos en `prisma/schema.prisma`
- Se implementan Server Actions
- Se crean componentes de UI

## Patrones Críticos

### Estructura de Rutas
```
app/
├── (public)/          # Blog público
│   ├── posts/[slug]/  # Ver post individual
│   ├── posts/         # Listado de posts
│   ├── contact/       # Formulario de contacto
│   └── newsletter-actions.ts
├── (dashboard)/       # Panel admin
│   └── dashboard/
│       ├── content/  # Gestión de posts
│       ├── users/    # Gestión de usuarios
│       ├── messages/ # Mensajes de contacto
│       └── settings/ # Configuración del sitio
├── (auth)/            # Auth routes
│   ├── login/
│   ├── register/
│   └── reset-password/
└── api/               # API routes REST
```

### Server Actions Pattern
```typescript
// app/(dashboard)/dashboard/content/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { permissions } from '@/lib/permissions'

const CreatePostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
})

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')
  
  const data = CreatePostSchema.parse(Object.fromEntries(formData))
  // ... implementation
}
```

### Zod Schemas Location
- Siempre agregar schemas en `lib/schemas.ts`
- Reusar schemas entre Server Actions y componentes

### Prisma Patterns
```typescript
// Instancia singleton desde lib/prisma.ts
import { prisma } from '@/lib/prisma'

// Query con select para optimizar
const posts = await prisma.post.findMany({
  select: { id: true, title: true, slug: true, status: true }
})

// Creación con relación
await prisma.post.create({
  data: {
    title: 'Nuevo post',
    slug: 'nuevo-post',
    content: '...',
    authorId: session.user.id
  }
})
```

### Comandos Útiles
```bash
# Desarrollo
npm run dev

# Migraciones
npx prisma migrate dev --name migration_name
npx prisma generate

# Build
npm run build

# Lint
npm run lint
```

## Decisiones de Arquitectura

### Por qué Server Actions?
- Menos código boilerplate que API routes
- Tipado automático con TypeScript
- Integración nativa con form actions
- Mejor experiencia de desarrollo

### Por qué Zod?
- Validación declarativa y reutilizable
- Inferencia de tipos automática
- Mensajes de error customizables
- Integración con TypeScript

### Por qué TipTap?
- Headless (total control sobre UI)
- Extensible (imágenes, placeholders, etc.)
- Comunidad activa
- Documentación excelente

## Recursos

- Docs: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- TipTap: https://tiptap.dev/docs
- Tailwind: https://tailwindcss.com/docs
