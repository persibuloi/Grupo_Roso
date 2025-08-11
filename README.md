# Grupo Rosso - E-commerce Platform

## 🚗 Descripción

Plataforma de comercio electrónico especializada en accesorios automotrices, construida con Next.js 15 y integrada con Airtable como CMS.

## 🆕 **NUEVO PANEL DE ADMINISTRACIÓN**

El proyecto incluye un **panel de administración completamente renovado** con sistema de autenticación unificado y catálogos especializados para vendedores y distribuidores.

### **🔐 Acceso al Panel**
- **URL**: `/admin-login.html`
- **Credenciales**:
  - Admin: `admin@gruporosso.com` / `admin123`
  - Vendedor: `vendedor@gruporosso.com` / `vendedor123`
  - Distribuidor: `distribuidor@gruporosso.com` / `distribuidor123`

### **📋 Funcionalidades**
- ✅ **Dashboard unificado** para todos los roles
- ✅ **Catálogo de vendedores** con precios retail
- ✅ **Catálogo de distribuidores** con precios mayorista
- ✅ **Gestión de usuarios** (solo admin)
- ✅ **Exportación CSV/Excel** de productos
- ✅ **Filtros avanzados** y búsqueda en tiempo real
- ✅ **Diseño responsive** optimizado para móvil y escritorio

📖 **[Ver documentación completa del panel →](./ADMIN_PANEL_DOCUMENTATION.md)**

## ✨ Características Principales

### 🎯 Funcionalidades de Negocio
- **Catálogo de Productos Completo**: Visualización de productos con filtros avanzados
- **Sistema de Filtrado Inteligente**: Por categoría, marca, precio y disponibilidad
- **Búsqueda Avanzada**: Con debounce para mejor rendimiento
- **Carrito de Compras**: Gestión completa del estado con Zustand
- **Filtros por Categoría y Marca**: Derivados directamente de la tabla Products (sin tablas dedicadas en el frontend)
- **Páginas de Producto Detalladas**: Con galería de imágenes y productos relacionados
- **SEO Optimizado**: Meta tags, Schema.org, sitemap automático

### 🛠️ Características Técnicas
- **Stack Moderno**: Next.js 14+ con App Router
- **TypeScript**: Tipado completo en toda la aplicación
- **Renderizado Híbrido**: ISR para catálogo, SSG para páginas estáticas
- **Rendimiento Optimizado**: Lighthouse Score >90
- **Responsive Design**: Móvil-first con Tailwind CSS
- **Accesibilidad**: WCAG 2.1 AA compliance
- **Integración Completa**: Airtable como CMS backend

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- pnpm 8+
- Cuenta de Airtable con API key

### 1. Clonar e Instalar
```bash
# Clonar el repositorio
git clone https://github.com/persibuloi/Grupo_Roso.git
cd Grupo_Roso

# Instalar dependencias
pnpm install
```

### 2. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tus credenciales
# Necesitarás:
# - AIRTABLE_API_KEY: Tu API key de Airtable
# - AIRTABLE_BASE_ID: Tu Base ID de Airtable (ej: appXXXXXXXXXXXXXX)
```

### 3. Configurar Base de Datos Airtable

La aplicación usa una sola tabla como fuente de verdad:

#### Tabla `Products`
- `Name` (Single line text)
- `SKU` (Single line text)
- `Description` (Long text)
- `Price Retail` (Number/Currency)
- `Price Wholesale` (Number/Currency)
- `Stock` (Number)
- `Active` (Checkbox)
- `Images` (Attachment)
- `createdTime` (Date/Time)
- `Categoria` (Lookup del campo Name desde el vínculo `Category`)
- `Marca` (Lookup del campo Name desde el vínculo `Brand`)

Notas:
- El backend lee únicamente `Products` y usa los LOOKUPs `Categoria` y `Marca` para nombres y slugs.
- Puedes mantener los campos vinculados `Category`/`Brand` si tu base ya los usa; el frontend no consulta esas tablas.

### 4. Ejecutar en Desarrollo
```bash
pnpm dev
```

### 5. Construir para Producción
```bash
pnpm build
pnpm start
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── (pages)/           # Rutas de la aplicación
│   │   ├── catalogo/      # Página de catálogo con filtros
│   │   ├── producto/[slug]/ # Páginas dinámicas de productos
│   │   ├── catalogo/      # Página de catálogo con filtros (derivados de Products)
│   │   └── producto/[slug]/ # Páginas dinámicas de productos
│   ├── globals.css        # Estilos globales
│   └── layout.tsx         # Layout principal
├── components/             # Componentes React
│   ├── ui/                # Componentes UI básicos
│   ├── layout/            # Componentes de layout
│   └── features/          # Componentes con lógica de negocio
├── lib/                   # Utilities y lógica de negocio
│   ├── airtable.ts        # Integración con Airtable
│   ├── types.ts           # Tipos TypeScript
│   └── utils.ts           # Utilidades
├── hooks/                 # Custom React hooks
└── store/                 # Estado global (Zustand)
```

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Anthracite**: `#111111` - Color principal oscuro
- **Rosso**: `#C1121F` - Color de marca (rojo)
- **White Soft**: `#F5F5F5` - Blanco suave
- **Gray Neutral**: `#A0A0A0` - Gris neutro
- **Gray Dark**: `#333333` - Gris oscuro

### Tipografía
- **Fuente Principal**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Componentes
- **Buttons**: Variantes primary, secondary, outline, ghost
- **Cards**: Con hover effects y sombras
- **Badges**: Para estados de stock y filtros
- **Forms**: Inputs y controles con validación

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Servidor de desarrollo
pnpm build        # Construir para producción
pnpm start        # Servidor de producción
pnpm lint         # Linting
pnpm type-check   # Verificación de tipos
```

## 📊 Rendimiento y SEO

### Métricas Objetivo
- **Lighthouse Performance**: >90
- **First Contentful Paint**: <2s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

### Estrategias de Optimización
- **Imágenes**: `next/image` con optimización automática
- **Fuentes**: `next/font` con preload
- **Code Splitting**: Automático por Next.js
- **ISR**: Revalidación cada 5 minutos para datos del catálogo

### SEO Features
- **Meta Tags**: Dinámicos por página
- **Schema.org**: Structured data para productos
- **Sitemap**: Generación automática
- **Robots.txt**: Configurado para indexación

## 🛒 Funcionalidades del Carrito

- **Estado Persistente**: LocalStorage con Zustand
- **Gestión de Cantidades**: Incrementar/decrementar
- **Validación de Stock**: Verificación en tiempo real
- **Cálculo de Totales**: Automático con precios retail

## 🔍 Sistema de Filtros

- **Filtros Múltiples**: Categoría, marca, precio, stock
- **URL Persistente**: Estado de filtros en query params
- **Búsqueda Inteligente**: Debounced search con 300ms delay
- **Ordenamiento**: Por precio, nombre, fecha

## 🌐 Internacionalización

- **Idioma**: Español (Nicaragua)
- **Moneda**: USD con formato local
- **Fechas**: Formato español

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Conectar repositorio a Vercel
# Configurar variables de entorno en el dashboard
# Deploy automático en cada push
```

### Variables de Entorno para Producción
```bash
AIRTABLE_API_KEY=your_production_api_key
AIRTABLE_BASE_ID=app4xBwfGa1IwoCkr
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NODE_ENV=production
```

## 📞 Soporte y Contribución

- **Autor**: MiniMax Agent
- **Versión**: 1.0.0
- **Licencia**: Propietario

### Reportar Issues
1. Usar el sistema de issues de GitHub
2. Incluir pasos para reproducir
3. Especificar navegador y versión

### Desarrollo Local
1. Fork el repositorio
2. Crear branch feature
3. Commit cambios
4. Crear Pull Request
  
## 📄 Licencia

Copyright 2025 Grupo Roso. Todos los derechos reservados.


## 🧭 Guía de Deploy en Vercel (actualizada)

Esta guía resume la configuración aplicada y cómo desplegar el proyecto en Vercel usando pnpm.

- **Package manager**: pnpm (definido en `engines.pnpm` de `package.json`)
- **Archivo `vercel.json`**: agregado para fijar comandos
  - `installCommand`: `pnpm install`
  - `buildCommand`: `pnpm run build`
  - `outputDirectory`: `.next`
- **Build local en Windows**: se deshabilitó `output: 'standalone'` en `next.config.js` para evitar errores de symlink (EPERM) en Windows.
- **Turbopack**: migrado de `experimental.turbo` a `turbopack` para evitar deprecations.

### Pasos en Vercel
1. Conectar el repositorio `persibuloi/Grupo_Roso`.
2. En Project Settings, confirmar:
   - Package Manager: pnpm
   - Build Command: `pnpm run build`
   - Output Directory: `.next`
3. Configurar variables de entorno (Production/Preview):
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_CATEGORIES_TABLE` (opcional)
   - `AIRTABLE_BRANDS_TABLE` (opcional)
   - `AIRTABLE_PRODUCTS_TABLE` (opcional)
4. Hacer push a `main` y verificar el deploy automático.


## 🛠 Troubleshooting (build y deploy)

- **Warning: multiple lockfiles**
  - Causa: existía `C:\Users\USER\package-lock.json` fuera del repo.
  - Solución: eliminar ese archivo para que Vercel y Next usen sólo `pnpm-lock.yaml` del proyecto.

- **Windows EPERM symlink en build**
  - Causa: `output: 'standalone'` genera symlinks en `.next/standalone`.
  - Solución: comentar/retirar `output: 'standalone'` en `next.config.js` (ya aplicado).

- **TypeScript: "'error' is of type 'unknown'"**
  - Causa: uso de `error.message` en bloques `catch` sin narrow.
  - Solución: verificar con `instanceof Error` antes de acceder a `.message` (aplicado en `src/lib/airtable.ts`).

- **Propiedad global en `window`**
  - Caso: `window.productGridDebugShown` en `ProductGrid`.
  - Solución: se agregó `src/types/global.d.ts` y se incluyeron todos los `.d.ts` en `tsconfig.json`.


## 📌 Notas técnicas recientes (08-08-2025)

- `next.config.js`
  - Migrado a `turbopack` y deshabilitado `standalone` para compatibilidad Windows.
- `src/lib/airtable.ts`
  - Manejo seguro de errores (`unknown`) en `catch`.
- `tsconfig.json`
  - Incluye `**/*.d.ts` para que el tipado global sea reconocido.
- `src/types/global.d.ts`
  - Extiende `window` con `productGridDebugShown`.
- `vercel.json`
  - Define comandos de instalación y build con pnpm.
