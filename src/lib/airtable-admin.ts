// Funciones para interactuar con las tablas de administración en Airtable
import Airtable from 'airtable';
import { User, UserSession, Role } from './auth';
import { hashPassword, verifyPassword } from './auth';

// Configuración de Airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID!);

// Nombres de las tablas
const TABLES = {
  USERS: process.env.AIRTABLE_USERS_TABLE || 'Users',
  ROLES: process.env.AIRTABLE_ROLES_TABLE || 'Roles',
  SESSIONS: process.env.AIRTABLE_SESSIONS_TABLE || 'User Sessions',
  ACTIVITY_LOG: process.env.AIRTABLE_ACTIVITY_LOG_TABLE || 'Activity Log'
};

/**
 * Funciones para gestión de usuarios
 */
export class UserManager {
  
  /**
   * Crear un nuevo usuario
   */
  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    company?: string;
    phone?: string;
  }): Promise<User> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Encriptar contraseña
      const hashedPassword = await hashPassword(userData.password);

      // Crear registro en Airtable
      const records = await base(TABLES.USERS).create([
        {
          fields: {
            Email: userData.email,
            Password: hashedPassword,
            Name: userData.name,
            Role: userData.role,
            Active: true,
            Company: userData.company || '',
            Phone: userData.phone || ''
          }
        }
      ]);

      const record = records[0];
      return this.formatUserRecord(record);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Obtener usuario por email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const records = await base(TABLES.USERS)
        .select({
          filterByFormula: `{Email} = "${email}"`,
          maxRecords: 1
        })
        .all();

      if (records.length === 0) return null;
      return this.formatUserRecord(records[0]);
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  /**
   * Obtener usuario por ID
   */
  static async getUserById(id: string): Promise<User | null> {
    try {
      const record = await base(TABLES.USERS).find(id);
      return this.formatUserRecord(record);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  /**
   * Verificar credenciales de login
   */
  static async verifyCredentials(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) return null;

      // Obtener el hash de la contraseña desde Airtable
      const records = await base(TABLES.USERS)
        .select({
          filterByFormula: `{Email} = "${email}"`,
          maxRecords: 1
        })
        .all();

      if (records.length === 0) return null;

      const hashedPassword = records[0].fields.Password as string;
      const isValid = await verifyPassword(password, hashedPassword);

      if (!isValid) return null;

      // Actualizar último login
      await this.updateLastLogin(user.id);

      return user;
    } catch (error) {
      console.error('Error verifying credentials:', error);
      return null;
    }
  }

  /**
   * Actualizar último login
   */
  static async updateLastLogin(userId: string): Promise<void> {
    try {
      await base(TABLES.USERS).update([
        {
          id: userId,
          fields: {
            'Last Login': new Date().toISOString()
          }
        }
      ]);
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Obtener todos los usuarios
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const records = await base(TABLES.USERS)
        .select({
          sort: [{ field: 'Name', direction: 'asc' }]
        })
        .all();

      return records.map(record => this.formatUserRecord(record));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  /**
   * Formatear registro de Airtable a objeto User
   */
  private static formatUserRecord(record: any): User {
    return {
      id: record.id,
      email: record.fields.Email || '',
      name: record.fields.Name || '',
      role: record.fields.Role || 'Vendedor',
      active: record.fields.Active || false,
      company: record.fields.Company || '',
      phone: record.fields.Phone || '',
      createdTime: record.fields.Created || (record as any).createdTime,
      lastLogin: record.fields['Last Login'] || undefined
    };
  }
}

/**
 * Funciones para gestión de roles
 */
export class RoleManager {
  
  /**
   * Obtener rol por nombre
   */
  static async getRoleByName(name: string): Promise<Role | null> {
    try {
      const records = await base(TABLES.ROLES)
        .select({
          filterByFormula: `{Name} = "${name}"`,
          maxRecords: 1
        })
        .all();

      if (records.length === 0) return null;
      return this.formatRoleRecord(records[0]);
    } catch (error) {
      console.error('Error getting role by name:', error);
      return null;
    }
  }

  /**
   * Obtener todos los roles
   */
  static async getAllRoles(): Promise<Role[]> {
    try {
      const records = await base(TABLES.ROLES)
        .select({
          sort: [{ field: 'Name', direction: 'asc' }]
        })
        .all();

      return records.map(record => this.formatRoleRecord(record));
    } catch (error) {
      console.error('Error getting all roles:', error);
      return [];
    }
  }

  /**
   * Formatear registro de Airtable a objeto Role
   */
  private static formatRoleRecord(record: any): Role {
    return {
      id: record.id,
      name: record.fields.Name || '',
      description: record.fields.Description || '',
      permissions: record.fields.Permissions || []
    };
  }
}

/**
 * Funciones para logging de actividades
 */
export class ActivityLogger {
  
  /**
   * Registrar actividad del usuario
   */
  static async logActivity(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: string,
    ipAddress?: string
  ): Promise<void> {
    try {
      await base(TABLES.ACTIVITY_LOG).create([
        {
          fields: {
            User: [userId],
            Action: action,
            Resource: resource,
            'Resource ID': resourceId || '',
            Details: details || '',
            'IP Address': ipAddress || ''
          }
        }
      ]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Obtener actividades de un usuario
   */
  static async getUserActivities(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const records = await base(TABLES.ACTIVITY_LOG)
        .select({
          filterByFormula: `FIND("${userId}", ARRAYJOIN({User}))`,
          sort: [{ field: 'Timestamp', direction: 'desc' }],
          maxRecords: limit
        })
        .all();

      return records.map(record => ({
        id: record.id,
        action: record.fields.Action,
        resource: record.fields.Resource,
        resourceId: record.fields['Resource ID'],
        details: record.fields.Details,
        ipAddress: record.fields['IP Address'],
        timestamp: record.fields.Timestamp || (record as any).createdTime
      }));
    } catch (error) {
      console.error('Error getting user activities:', error);
      return [];
    }
  }
}
