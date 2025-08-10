# Guía de Deployment - Proyecto Grupo Roso

## Variables de Entorno Críticas para Vercel

### Variables Obligatorias
```env
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_PRODUCTS_TABLE=Products
```

### Variables Opcionales
```env
AIRTABLE_CATEGORIES_TABLE=Categories
AIRTABLE_BRANDS_TABLE=Brands
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
```

## Problema Común: Error 500 en API

### Síntomas
- Catálogo no carga en producción
- API `/api/products` devuelve error 500
- Error: "You are not authorized to perform this operation"

### Causa Principal
**Variable faltante**: `AIRTABLE_PRODUCTS_TABLE`

### Solución
1. Agregar `AIRTABLE_PRODUCTS_TABLE=Products` en Vercel
2. Redeploy automático se ejecuta
3. Catálogo funciona inmediatamente

## Diferencias de Arquitectura

### Enfoque Dinámico (Grupo Roso)
```typescript
const tableName = process.env.AIRTABLE_PRODUCTS_TABLE || 'Products';
const records = await base(tableName).select({...}).all();
```
- ✅ Flexible para múltiples entornos
- ❌ Requiere todas las variables configuradas

### Enfoque Hardcodeado (Alternativo)
```typescript
const records = await base('Products').select({...}).all();
```
- ✅ Simple, menos configuración
- ❌ Menos flexible para cambios

## Checklist de Deployment

### Pre-deployment
- [ ] Variables de entorno configuradas en Vercel
- [ ] Código subido a GitHub
- [ ] Build local exitoso (`pnpm build`)
- [ ] TypeScript sin errores (`pnpm type-check`)

### Post-deployment
- [ ] Verificar `/api/products` responde 200
- [ ] Catálogo carga productos
- [ ] Filtros funcionan correctamente
- [ ] WhatsApp integration operativa

## Comandos de Diagnóstico

### Test local de API
```bash
node diagnose-vercel.js
```

### Test de autenticación Airtable
```bash
node simple-airtable-test.js
```

## URLs del Proyecto
- **Producción**: https://grupo-roso.vercel.app
- **Catálogo**: https://grupo-roso.vercel.app/catalogo
- **GitHub**: https://github.com/persibuloi/Grupo_Roso

## Contacto WhatsApp
- **Número**: +50588793873
- **Integración**: Carrito → "Consultar por WhatsApp"
