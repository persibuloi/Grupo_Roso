// Script para configurar el primer usuario administrador
require('dotenv').config({ path: '.env.local' });
const { UserManager, RoleManager, ActivityLogger } = require('./src/lib/airtable-admin.ts');
const { DEFAULT_ROLES } = require('./src/lib/auth.ts');

async function setupAdmin() {
  console.log('🚀 Configuración inicial del Panel de Administración\n');
  
  try {
    // PASO 1: Verificar variables de entorno
    console.log('--- PASO 1: Verificando configuración ---');
    const requiredVars = [
      'AIRTABLE_API_KEY',
      'AIRTABLE_BASE_ID',
      'AIRTABLE_USERS_TABLE',
      'AIRTABLE_ROLES_TABLE'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Variables de entorno faltantes:');
      missingVars.forEach(varName => console.log(`   • ${varName}`));
      console.log('\n💡 Agrega estas variables a tu .env.local:');
      console.log('AIRTABLE_USERS_TABLE=Users');
      console.log('AIRTABLE_ROLES_TABLE=Roles');
      console.log('AIRTABLE_SESSIONS_TABLE=User Sessions');
      console.log('AIRTABLE_ACTIVITY_LOG_TABLE=Activity Log');
      console.log('NEXTAUTH_SECRET=grupo_roso_secret_2024_cambiar_en_produccion');
      console.log('NEXTAUTH_URL=http://localhost:3000');
      return;
    }
    
    console.log('✅ Variables de entorno configuradas correctamente');
    
    // PASO 2: Crear roles predefinidos
    console.log('\n--- PASO 2: Configurando roles del sistema ---');
    
    for (const roleData of DEFAULT_ROLES) {
      try {
        const existingRole = await RoleManager.getRoleByName(roleData.name);
        if (existingRole) {
          console.log(`✅ Rol "${roleData.name}" ya existe`);
        } else {
          // Aquí necesitaríamos crear el rol en Airtable
          console.log(`🔄 Creando rol "${roleData.name}"...`);
          console.log(`   Permisos: ${roleData.permissions.join(', ')}`);
          // TODO: Implementar creación de roles
        }
      } catch (error) {
        console.log(`⚠️  Error verificando rol "${roleData.name}": ${error.message}`);
      }
    }
    
    // PASO 3: Crear usuario administrador
    console.log('\n--- PASO 3: Creando usuario administrador ---');
    
    const adminEmail = 'admin@gruporoso.com';
    const adminPassword = 'Admin123!'; // Cambiar después del primer login
    
    try {
      // Verificar si ya existe
      const existingAdmin = await UserManager.getUserByEmail(adminEmail);
      
      if (existingAdmin) {
        console.log('✅ Usuario administrador ya existe');
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   Nombre: ${existingAdmin.name}`);
        console.log(`   Rol: ${existingAdmin.role}`);
      } else {
        console.log('🔄 Creando usuario administrador...');
        
        const admin = await UserManager.createUser({
          email: adminEmail,
          password: adminPassword,
          name: 'Administrador Grupo Roso',
          role: 'Admin',
          company: 'Grupo Roso',
          phone: '+50588793873'
        });
        
        console.log('✅ Usuario administrador creado exitosamente');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Nombre: ${admin.name}`);
        console.log(`   Rol: ${admin.role}`);
        
        // Registrar actividad
        await ActivityLogger.logActivity(
          admin.id,
          'create',
          'user',
          admin.id,
          'Usuario administrador inicial creado',
          '127.0.0.1'
        );
      }
    } catch (error) {
      console.log(`❌ Error creando administrador: ${error.message}`);
      return;
    }
    
    // PASO 4: Probar autenticación
    console.log('\n--- PASO 4: Probando autenticación ---');
    
    try {
      const user = await UserManager.verifyCredentials(adminEmail, adminPassword);
      
      if (user) {
        console.log('✅ Autenticación funcionando correctamente');
        console.log(`   Usuario autenticado: ${user.name} (${user.email})`);
        
        // Registrar login de prueba
        await ActivityLogger.logActivity(
          user.id,
          'login',
          'system',
          undefined,
          'Login de prueba durante setup',
          '127.0.0.1'
        );
      } else {
        console.log('❌ Error en la autenticación');
      }
    } catch (error) {
      console.log(`❌ Error probando autenticación: ${error.message}`);
    }
    
    // PASO 5: Mostrar información de acceso
    console.log('\n--- CONFIGURACIÓN COMPLETADA ---');
    console.log('🎉 Panel de administración configurado exitosamente');
    console.log('\n📋 Credenciales de acceso:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Contraseña: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    console.log('\n🔗 Próximos pasos:');
    console.log('   1. Configurar NextAuth.js');
    console.log('   2. Crear páginas del panel (/admin)');
    console.log('   3. Implementar middleware de autenticación');
    console.log('   4. Crear interfaces de gestión');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
  }
}

// Ejecutar configuración
setupAdmin().catch(console.error);
