# 🌟 Funcionalidad de Productos Destacados - Grupo Rosso

## 📋 Descripción General

La funcionalidad de **Productos Destacados** permite mostrar una selección especial de productos en la página principal (homepage) del sitio web Grupo Rosso. Los productos se marcan como destacados directamente en Airtable y se muestran de forma dinámica en la homepage.

## ✨ Características Principales

### 🎯 **Selección Inteligente**
- Muestra productos marcados como "Destacado" en Airtable
- **Máximo 8 productos** para optimizar performance y UX
- **Selección aleatoria** cuando hay más de 8 productos destacados
- **Responsive design** optimizado para móviles

### 🔄 **Comportamiento Dinámico**
- **4 productos destacados** → Muestra los 4
- **12 productos destacados** → Selecciona 8 aleatorios
- **20+ productos destacados** → Selecciona 8 aleatorios
- Cada recarga de página puede mostrar productos diferentes

### ⚡ **Performance Optimizada**
- Cache de **5 minutos** para reducir llamadas a Airtable
- Revalidación automática con Next.js ISR
- Fallback robusto en caso de errores

## 🛠️ Implementación Técnica

### 📁 **Archivos Modificados/Creados**

#### 1. **Endpoint API**: `/src/app/api/products/featured/route.ts`
```typescript
// Endpoint específico para productos destacados
export async function GET(request: NextRequest) {
  // Conecta a tabla 'Products' en Airtable
  // Filtra productos con campo 'Destacado' = true
  // Selecciona hasta 8 productos aleatoriamente
  // Mapea imágenes públicas de Airtable
}
```

#### 2. **Homepage**: `/src/app/page.tsx`
```typescript
// Consume endpoint de productos destacados
const featuredRes = await fetch(`${baseURL}/api/products/featured`, { 
  next: { revalidate: 300 } 
});

// Renderiza sección de productos destacados
<ProductGrid products={featuredProducts} loading={false} />
```

### 🗄️ **Configuración en Airtable**

#### **Campo Requerido en Tabla 'Products':**
- **Nombre**: `Destacado`
- **Tipo**: `Checkbox`
- **Función**: Marcar productos que aparecerán en homepage

#### **Campos Utilizados:**
- `Name` - Nombre del producto
- `Images` - Array de imágenes (URLs públicas)
- `Category` - Categoría del producto
- `Brand` - Marca del producto
- `Price Retail` - Precio retail
- `Price Wholesale` - Precio mayoreo
- `Stock` - Cantidad en inventario
- `SKU` - Código del producto
- `Description` - Descripción del producto
- `Destacado` - Campo checkbox para marcar como destacado

## 🔧 **Lógica de Funcionamiento**

### **1. Filtrado en Airtable**
```javascript
// Obtiene solo productos marcados como destacados
const records = await base('Products').select({
  filterByFormula: 'IF({Active}, TRUE(), TRUE())',
  maxRecords: 100
}).all();

// Filtra localmente productos con campo Destacado = true
const featuredProducts = products.filter(product => product.featured);
```

### **2. Selección Aleatoria**
```javascript
// Mezcla productos aleatoriamente
const shuffledProducts = featuredProducts.sort(() => Math.random() - 0.5);

// Selecciona máximo 8 productos
const selectedProducts = shuffledProducts.slice(0, 8);
```

### **3. Mapeo de Imágenes**
```javascript
// Mapea URLs públicas de imágenes desde Airtable
images: Array.isArray(fields.Images) 
  ? fields.Images.map((img: any) => img.url) 
  : []
```

## 📱 **Diseño y UX**

### **Sección en Homepage**
- **Título**: "Productos Destacados"
- **Subtítulo**: Descripción atractiva de la sección
- **Grid responsivo**: 1-4 columnas según tamaño de pantalla
- **Botón CTA**: "Ver Todos los Productos" → redirige a catálogo

### **Responsive Design**
- **Móvil**: 1 columna
- **Tablet**: 2-3 columnas
- **Desktop**: 4 columnas
- **Imágenes**: Optimizadas y con fallback

## 🚀 **Configuración de Despliegue**

### **Variables de Entorno Requeridas**
```env
AIRTABLE_API_KEY=tu_api_key_aqui
AIRTABLE_BASE_ID=tu_base_id_aqui
AIRTABLE_PRODUCTS_TABLE=Products
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

### **Cache y Revalidación**
- **ISR**: `revalidate: 300` (5 minutos)
- **Runtime**: `nodejs`
- **Dynamic**: `force-dynamic`

## 🔍 **Testing y Debugging**

### **Logs del Servidor**
```bash
🌟 API Featured Products - Obteniendo productos destacados...
🌟 Registros obtenidos: 9
🌟 Productos destacados encontrados: 4
🌟 Productos destacados seleccionados: 4
```

### **Endpoints de Testing**
- **Productos destacados**: `http://localhost:3001/api/products/featured`
- **Homepage**: `http://localhost:3001`

### **Verificaciones**
1. ✅ Campo "Destacado" existe en Airtable
2. ✅ Productos marcados como destacados
3. ✅ Imágenes públicas configuradas en Airtable
4. ✅ Variables de entorno configuradas
5. ✅ Endpoint responde correctamente

## 🎯 **Casos de Uso**

### **Escenario 1: Pocos Productos Destacados**
- **Situación**: 4 productos marcados como destacados
- **Resultado**: Muestra los 4 productos
- **Beneficio**: Todos los productos destacados son visibles

### **Escenario 2: Muchos Productos Destacados**
- **Situación**: 12 productos marcados como destacados
- **Resultado**: Selecciona 8 productos aleatoriamente
- **Beneficio**: Contenido dinámico, todos tienen oportunidad de aparecer

### **Escenario 3: Sin Productos Destacados**
- **Situación**: Ningún producto marcado como destacado
- **Resultado**: Sección vacía (sin fallback)
- **Recomendación**: Marcar al menos 4-8 productos como destacados

## 🔄 **Mantenimiento**

### **Actualizar Productos Destacados**
1. Acceder a Airtable
2. Ir a tabla 'Products'
3. Marcar/desmarcar campo 'Destacado'
4. Los cambios se reflejan en máximo 5 minutos (cache)

### **Monitoreo**
- Revisar logs del servidor para errores
- Verificar que las imágenes se cargan correctamente
- Confirmar que la selección aleatoria funciona

## 📈 **Métricas y Analytics**

### **KPIs Recomendados**
- Tasa de clics en productos destacados
- Conversión desde homepage a catálogo
- Tiempo de permanencia en homepage
- Productos destacados más populares

## 🚨 **Troubleshooting**

### **Problema**: No se muestran productos destacados
**Solución**: 
1. Verificar campo 'Destacado' en Airtable
2. Confirmar que hay productos marcados
3. Revisar variables de entorno
4. Verificar logs del servidor

### **Problema**: Imágenes no se cargan
**Solución**:
1. Verificar URLs públicas en Airtable
2. Confirmar campo 'Images' existe
3. Revisar mapeo en endpoint

### **Problema**: Siempre los mismos productos
**Solución**:
1. Verificar lógica de aleatorización
2. Limpiar cache del navegador
3. Confirmar que hay más de 8 productos destacados

## 📝 **Changelog**

### **v1.0.0** - Implementación Inicial
- ✅ Endpoint `/api/products/featured` creado
- ✅ Integración con Airtable
- ✅ Selección aleatoria implementada
- ✅ Mapeo de imágenes corregido
- ✅ Homepage actualizada
- ✅ Responsive design implementado
- ✅ Cache y revalidación configurados

---

**Desarrollado para Grupo Rosso** | **Fecha**: Agosto 2025 | **Estado**: ✅ Completado y Funcional
