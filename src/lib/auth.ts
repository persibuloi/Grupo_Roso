// Utilidades de autenticación y encriptación
import bcrypt from 'bcryptjs';

/**
 * Encripta una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Promise<string> - Hash de la contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Nivel de seguridad alto
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verifica una contraseña contra su hash
 * @param password - Contraseña en texto plano
 * @param hash - Hash almacenado en la base de datos
 * @returns Promise<boolean> - true si la contraseña es correcta
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Genera un token de sesión aleatorio
 * @returns string - Token único para la sesión
 */
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Valida el formato de email
 * @param email - Email a validar
 * @returns boolean - true si el formato es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida la fortaleza de la contraseña
 * @param password - Contraseña a validar
 * @returns object - Resultado de la validación
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Tipos para el sistema de autenticación
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Vendedor' | 'Distribuidor';
  active: boolean;
  company?: string;
  phone?: string;
  createdTime: string;
  lastLogin?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  sessionToken: string;
  ipAddress: string;
  userAgent: string;
  expires: string;
  active: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

// Permisos del sistema
export const PERMISSIONS = {
  READ_PRODUCTS: 'read_products',
  WRITE_PRODUCTS: 'write_products',
  READ_INVENTORY: 'read_inventory',
  WRITE_INVENTORY: 'write_inventory',
  READ_USERS: 'read_users',
  WRITE_USERS: 'write_users',
  READ_REPORTS: 'read_reports',
  MANAGE_PRICES: 'manage_prices',
  ADMIN_ACCESS: 'admin_access'
} as const;

// Roles predefinidos con sus permisos
export const DEFAULT_ROLES: Omit<Role, 'id'>[] = [
  {
    name: 'Admin',
    description: 'Acceso completo al sistema',
    permissions: Object.values(PERMISSIONS)
  },
  {
    name: 'Vendedor',
    description: 'Acceso a productos y precios retail',
    permissions: [
      PERMISSIONS.READ_PRODUCTS,
      PERMISSIONS.READ_INVENTORY,
      PERMISSIONS.READ_REPORTS
    ]
  },
  {
    name: 'Distribuidor',
    description: 'Acceso a productos y precios wholesale',
    permissions: [
      PERMISSIONS.READ_PRODUCTS,
      PERMISSIONS.READ_INVENTORY,
      PERMISSIONS.READ_REPORTS,
      PERMISSIONS.MANAGE_PRICES
    ]
  }
];
