# AGENTS.md — Configuración del Proyecto NextCMS

## Stack Tecnológico
- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Tailwind CSS 4
- **Backend**: PostgreSQL, Prisma 7
- **Auth**: NextAuth con email/password
- **Editor**: TipTap
- **Cloud**: Cloudinary, Upstash (rate limiting)
- **Validación**: Zod

---

## Convenciones del Proyecto

### Estructura de Rutas
```
app/
├── (public)/          # Blog público, posts, contacto, newsletter
├── (dashboard)/       # Panel admin: content, users, messages, settings
├── (auth)/            # Login, registro, recuperación de contraseña
└── api/               # Endpoints REST
```

### Server Actions
- Ubicación: Archivos `actions.ts` en la misma carpeta de la página
-命名: funciones exportadas que siguen el patrón `actionName`
- Validación: siempre usar Zod schemas de `lib/schemas.ts`

### Componentes
- UI Components: dentro de las carpetas de página
- Tipado: TypeScript strict mode
- Estilos: Tailwind CSS con clases utilitarias

### Base de Datos
- ORM: Prisma 7
- Enums: Role (ADMIN, EDITOR, VIEWER), PostStatus (DRAFT, PUBLISHED, ARCHIVED)
- Siempre usar migraciones para cambios en schema

### Autenticación
- Proveedor: NextAuth con Credentials provider
- Roles: verificar con `lib/permissions.ts` antes de acciones protegidas
- Contraseñas: hasheadas con bcrypt

---

## Reglas para el Agente

### SIEMPRE
- Usar Server Actions para mutations (no API routes innecesarios)
- Validar input con Zod antes de cualquier operación de BD
- Verificar permisos usando `lib/permissions.ts`
- Usar Prisma client desde `lib/prisma.ts` (instancia singleton)
- Manejar errores con try/catch y retornar errores significativos

### NUNCA
- Exponer credenciales o secrets en logs
- Hacer queries directas sin validación
- Ignorar warnings de TypeScript
- Crear API routes cuando Server Action es suficiente

### Patrones Recomendados
- **Lectura de datos**: `prisma.model.findMany()` con `select` para optimizar
- **Creación**: usar transactions si hay operaciones relacionadas
- **Actualización**: siempre incluir `updatedAt` manualmente o usar `@updatedAt`
- **Deleted**: usar soft delete (campo `active` o `deletedAt`) cuando aplique

---

## Workflows Soportados

### Agregar Nueva Feature
1. Crear spec en `openspec/specs/` (si SDD está activo)
2. Implementar en la ruta correspondiente
3. Agregar migraciones si hay cambios en BD
4. Verificar con tests o manualmente

### Cambios en el Schema
1. Editar `prisma/schema.prisma`
2. Ejecutar `npx prisma migrate dev --name migration_name`
3. Regenerar client: `npx prisma generate`
4. Verificar que el código existente siga funcionando

### Agregar Nueva Ruta
1. Crear carpeta en `app/` bajo el grupo correspondiente
2. Agregar `page.tsx` como entry point
3. Crear `actions.ts` si hay mutations
4. Agregar validaciones en `lib/schemas.ts` si es necesario

---

## Recursos

- **Docs**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **TipTap**: https://tiptap.dev/docs
- **Tailwind**: https://tailwindcss.com/docs

---

## Skills del Proyecto

| Skill | Descripción | Ubicación |
|-------|-------------|------------|
| `nextcms-workflow` | Flujo de trabajo específico para NextCMS | [.agent/skills/SKILL.md](.agent/skills/SKILL.md) |
