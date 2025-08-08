# Grupo Rosso - Tienda de Accesorios Automotrices

## 🚗 Descripción

Aplicación web moderna y elegante para **Grupo Rosso**, tienda especializada en accesorios automotrices de alta calidad. Desarrollada con Next.js 14+, React, TypeScript y Tailwind CSS, integrada completamente con Airtable como backend.

## ✨ Características Principales

### 🎯 Funcionalidades de Negocio
- **Catálogo de Productos Completo**: Visualización de productos con filtros avanzados
- **Sistema de Filtrado Inteligente**: Por categoría, marca, precio y disponibilidad
- **Búsqueda Avanzada**: Con debounce para mejor rendimiento
- **Carrito de Compras**: Gestión completa del estado con Zustand
- **Navegación por Categorías y Marcas**: Páginas dinámicas para cada categoría/marca
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
git clone https://github.com/grupo-rosso/website.git
cd grupo-rosso

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
# - AIRTABLE_BASE_ID: app4xBwfGa1IwoCkr (ya configurado)
```

### 3. Configurar Base de Datos Airtable

La aplicación espera estas tablas en Airtable:

#### Tabla `Categories`
- `Name` (Single line text)
- `Slug` (Single line text)
- `Description` (Long text)

#### Tabla `Brands`
- `Name` (Single line text)
- `Slug` (Single line text)
- `Description` (Long text)
- `Logo` (Attachment)

#### Tabla `Products`
- `Name` (Single line text)
- `Slug` (Single line text)
- `SKU` (Single line text)
- `Description` (Long text)
- `Price Retail` (Currency)
- `Price Wholesale` (Currency)
- `Stock` (Number)
- `Active` (Checkbox)
- `Category` (Link to Categories)
- `Brand` (Link to Brands)
- `Images` (Attachment)

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
│   │   ├── categoria/[slug]/ # Páginas de categorías
│   │   └── marca/[slug]/  # Páginas de marcas
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

Copyright © 2025 Grupo Rosso. Todos los derechos reservados.
