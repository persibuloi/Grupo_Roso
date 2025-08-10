# Esquema de Base de Datos - Panel de Administración

## Tablas Nuevas en Airtable

### 1. **Users** (Usuarios del sistema)
```
Campos:
- ID (Primary Key) - Autonumber
- Email (Single line text) - UNIQUE, REQUIRED
- Password (Single line text) - Hash bcrypt
- Name (Single line text) - Nombre completo
- Role (Single select) - Admin, Vendedor, Distribuidor
- Active (Checkbox) - Usuario activo/inactivo
- Company (Single line text) - Empresa (para distribuidores)
- Phone (Phone number) - Teléfono de contacto
- Created (Created time) - Fecha de creación
- Last Login (Date) - Último acceso
- Notes (Long text) - Notas administrativas
```

### 2. **Roles** (Definición de permisos)
```
Campos:
- ID (Primary Key) - Autonumber
- Name (Single line text) - Admin, Vendedor, Distribuidor
- Description (Long text) - Descripción del rol
- Permissions (Multiple select) - Lista de permisos
  * read_products
  * write_products
  * read_inventory
  * write_inventory
  * read_users
  * write_users
  * read_reports
  * manage_prices
- Created (Created time)
```

### 3. **Price Lists** (Listas de precios personalizadas)
```
Campos:
- ID (Primary Key) - Autonumber
- Name (Single line text) - Nombre de la lista
- Type (Single select) - Retail, Wholesale, Special
- User (Link to Users) - Usuario asignado (opcional)
- Role (Link to Roles) - Rol asignado (opcional)
- Discount Percentage (Number) - Descuento general
- Active (Checkbox) - Lista activa
- Valid From (Date) - Fecha inicio
- Valid Until (Date) - Fecha fin
- Created (Created time)
```

### 4. **Product Prices** (Precios específicos por lista)
```
Campos:
- ID (Primary Key) - Autonumber
- Product (Link to Products) - Producto
- Price List (Link to Price Lists) - Lista de precios
- Custom Price (Currency) - Precio personalizado
- Discount Percentage (Number) - Descuento específico
- Active (Checkbox) - Precio activo
- Created (Created time)
- Updated (Last modified time)
```

### 5. **User Sessions** (Control de sesiones)
```
Campos:
- ID (Primary Key) - Autonumber
- User (Link to Users) - Usuario
- Session Token (Single line text) - Token de sesión
- IP Address (Single line text) - IP del usuario
- User Agent (Long text) - Navegador/dispositivo
- Created (Created time) - Inicio de sesión
- Expires (Date) - Expiración
- Active (Checkbox) - Sesión activa
```

### 6. **Activity Log** (Registro de actividades)
```
Campos:
- ID (Primary Key) - Autonumber
- User (Link to Users) - Usuario que realizó la acción
- Action (Single select) - login, logout, create, update, delete, view
- Resource (Single line text) - Recurso afectado (product, user, etc.)
- Resource ID (Single line text) - ID del recurso
- Details (Long text) - Detalles de la acción
- IP Address (Single line text) - IP del usuario
- Timestamp (Created time) - Momento de la acción
```

## Modificaciones a Tablas Existentes

### **Products** (Agregar campos para inventario)
```
Nuevos campos:
- Min Stock (Number) - Stock mínimo para alertas
- Max Stock (Number) - Stock máximo recomendado
- Reorder Point (Number) - Punto de reorden
- Supplier (Single line text) - Proveedor principal
- Cost Price (Currency) - Precio de costo
- Last Updated (Last modified time) - Última actualización
- Updated By (Link to Users) - Usuario que actualizó
```

## Configuración de Seguridad

### Encriptación de Contraseñas
```typescript
// utils/auth.ts
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

### Variables de Entorno Adicionales
```env
# Autenticación
NEXTAUTH_SECRET=tu_secret_muy_seguro_aqui
NEXTAUTH_URL=https://grupo-roso.vercel.app

# Tablas adicionales
AIRTABLE_USERS_TABLE=Users
AIRTABLE_ROLES_TABLE=Roles
AIRTABLE_PRICE_LISTS_TABLE=Price Lists
AIRTABLE_PRODUCT_PRICES_TABLE=Product Prices
AIRTABLE_SESSIONS_TABLE=User Sessions
AIRTABLE_ACTIVITY_LOG_TABLE=Activity Log
```

## Roles y Permisos Predefinidos

### Admin
- Acceso completo a todas las funciones
- Gestión de usuarios y roles
- Configuración del sistema

### Vendedor
- Ver productos y precios retail
- Consultar inventario
- Generar cotizaciones
- Ver reportes básicos

### Distribuidor
- Ver productos y precios wholesale
- Acceso a descuentos especiales
- Historial de pedidos
- Reportes de ventas

## Flujo de Autenticación

1. **Registro**: Admin crea usuario → Password se hashea → Se guarda en Airtable
2. **Login**: Usuario ingresa credenciales → Se verifica hash → Se crea sesión
3. **Autorización**: Cada request verifica permisos según rol
4. **Logout**: Se invalida sesión en base de datos

## Próximos Pasos

1. Crear tablas en Airtable con esta estructura
2. Instalar dependencias de autenticación
3. Configurar NextAuth.js
4. Implementar middleware de autorización
5. Crear interfaces de administración
