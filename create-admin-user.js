// Script simplificado para crear el primer usuario administrador
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  console.log('🚀 Creando usuario administrador inicial\n');
  
  try {
    // Verificar variables de entorno básicas
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      console.log('❌ Variables de entorno faltantes:');
      console.log('   • AIRTABLE_API_KEY');
      console.log('   • AIRTABLE_BASE_ID');
      return;
    }
    
    console.log('✅ Variables básicas configuradas');
    
    // Configurar Airtable
    const Airtable = require('airtable');
    Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    // Datos del administrador
    const adminData = {
      email: 'admin@gruporoso.com',
      password: 'Admin123!',
      name: 'Administrador Grupo Roso',
      role: 'Admin',
      company: 'Grupo Roso',
      phone: '+50588793873'
    };
    
    console.log('🔍 Verificando si el usuario ya existe...');
    
    // Verificar si ya existe
    try {
      const existingUsers = await base('Users').select({
        filterByFormula: `{Email} = "${adminData.email}"`,
        maxRecords: 1
      }).all();
      
      if (existingUsers.length > 0) {
        console.log('✅ Usuario administrador ya existe');
        console.log(`   Email: ${existingUsers[0].fields.Email}`);
        console.log(`   Nombre: ${existingUsers[0].fields.Name}`);
        console.log(`   Rol: ${existingUsers[0].fields.Role}`);
        return;
      }
    } catch (error) {
      console.log('⚠️  Error verificando usuario existente (puede ser que la tabla Users no exista)');
      console.log('💡 Asegúrate de haber creado la tabla "Users" en Airtable');
      return;
    }
    
    console.log('🔄 Encriptando contraseña...');
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    console.log('✅ Contraseña encriptada');
    
    console.log('🔄 Creando usuario en Airtable...');
    
    const records = await base('Users').create([
      {
        fields: {
          Email: adminData.email,
          Password: hashedPassword,
          Name: adminData.name,
          Role: adminData.role,
          Active: true,
          Company: adminData.company,
          Phone: adminData.phone
        }
      }
    ]);
    
    const createdUser = records[0];
    
    console.log('✅ Usuario administrador creado exitosamente');
    console.log(`   ID: ${createdUser.id}`);
    console.log(`   Email: ${createdUser.fields.Email}`);
    console.log(`   Nombre: ${createdUser.fields.Name}`);
    console.log(`   Rol: ${createdUser.fields.Role}`);
    
    // Probar verificación de contraseña
    console.log('\n🔍 Probando verificación de contraseña...');
    const isValid = await bcrypt.compare(adminData.password, hashedPassword);
    console.log(`${isValid ? '✅' : '❌'} Verificación de contraseña: ${isValid ? 'EXITOSA' : 'FALLIDA'}`);
    
    console.log('\n--- CONFIGURACIÓN COMPLETADA ---');
    console.log('🎉 Usuario administrador configurado exitosamente');
    console.log('\n📋 Credenciales de acceso:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Contraseña: ${adminData.password}`);
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    
    console.log('\n🔗 Variables de entorno que necesitas agregar a .env.local:');
    console.log('AIRTABLE_USERS_TABLE=Users');
    console.log('AIRTABLE_ROLES_TABLE=Roles');
    console.log('AIRTABLE_SESSIONS_TABLE=User Sessions');
    console.log('AIRTABLE_ACTIVITY_LOG_TABLE=Activity Log');
    console.log('NEXTAUTH_SECRET=grupo_roso_secret_2024_cambiar_en_produccion');
    console.log('NEXTAUTH_URL=http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error durante la creación del usuario:', error.message);
    
    if (error.message.includes('NOT_FOUND')) {
      console.log('\n💡 Posibles causas:');
      console.log('   • La tabla "Users" no existe en Airtable');
      console.log('   • El nombre de la tabla es diferente');
      console.log('   • Los campos de la tabla no coinciden');
    } else if (error.message.includes('AUTHENTICATION_REQUIRED')) {
      console.log('\n💡 Problema de autenticación:');
      console.log('   • Verifica tu AIRTABLE_API_KEY');
      console.log('   • Verifica tu AIRTABLE_BASE_ID');
    }
  }
}

// Ejecutar creación
createAdminUser().catch(console.error);
