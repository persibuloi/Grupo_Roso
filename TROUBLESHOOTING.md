# Troubleshooting - Proyecto Grupo Roso

## Problema: Catálogo no aparece en Vercel

### Diagnóstico paso a paso

1. **Verificar API directamente**
   ```
   https://grupo-roso.vercel.app/api/products
   ```
   - ✅ Status 200 → Variables correctas
   - ❌ Status 500 → Variables faltantes/incorrectas

2. **Errores comunes y soluciones**

   | Error | Causa | Solución |
   |-------|-------|----------|
   | "You are not authorized" | Variable `AIRTABLE_PRODUCTS_TABLE` faltante | Agregar en Vercel |
   | "NOT_FOUND" | Base ID incorrecto | Verificar `AIRTABLE_BASE_ID` |
   | "AUTHENTICATION_REQUIRED" | API Key inválido | Verificar `AIRTABLE_API_KEY` |

3. **Variables críticas en Vercel**
   ```
   AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
   AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
   AIRTABLE_PRODUCTS_TABLE=Products  ← CRÍTICA
   ```

## Lecciones Aprendidas

### Variables de Entorno: Dinámicas vs Hardcodeadas

**Proyecto Grupo Roso (Dinámico)**:
```typescript
// Requiere variable de entorno
const table = process.env.AIRTABLE_PRODUCTS_TABLE || 'Products';
await base(table).select({...}).all();
```

**Otros proyectos (Hardcodeado)**:
```typescript
// No requiere variable de entorno
await base('Products').select({...}).all();
```

### Ventajas de cada enfoque

**Dinámico**:
- ✅ Flexible para múltiples entornos
- ✅ Fácil cambio de nombres de tablas
- ❌ Más configuración requerida

**Hardcodeado**:
- ✅ Setup más simple
- ✅ Menos variables de entorno
- ❌ Menos flexible

## Scripts de Diagnóstico

### 1. Test completo de API
```bash
node diagnose-vercel.js
```

### 2. Test de autenticación local
```bash
node simple-airtable-test.js
```

### 3. Test detallado de errores
```bash
node diagnose-error.js
```

## Proceso de Resolución Exitoso

1. **Identificación**: API devuelve error 500
2. **Diagnóstico**: "You are not authorized"
3. **Verificación local**: Credenciales funcionan
4. **Comparación**: Variables locales vs Vercel
5. **Solución**: Agregar `AIRTABLE_PRODUCTS_TABLE`
6. **Resultado**: Catálogo funcional ✅

## Contacto y URLs

- **Producción**: https://grupo-roso.vercel.app/catalogo
- **GitHub**: https://github.com/persibuloi/Grupo_Roso
- **WhatsApp**: +50588793873
