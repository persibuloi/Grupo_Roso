// Demostración de encriptación de contraseñas con bcrypt
const bcrypt = require('bcryptjs');

async function demoPasswordEncryption() {
  console.log('🔐 Demostración de Encriptación de Contraseñas\n');
  
  // Contraseña original del usuario
  const originalPassword = "MiContraseñaSegura123";
  console.log(`📝 Contraseña original: "${originalPassword}"`);
  
  // PASO 1: ENCRIPTAR (al registrar usuario)
  console.log('\n--- PASO 1: REGISTRO DE USUARIO ---');
  console.log('🔄 Encriptando contraseña...');
  
  const saltRounds = 12; // Nivel de seguridad (más alto = más seguro pero más lento)
  const hashedPassword = await bcrypt.hash(originalPassword, saltRounds);
  
  console.log(`✅ Hash generado: "${hashedPassword}"`);
  console.log(`📏 Longitud del hash: ${hashedPassword.length} caracteres`);
  console.log('💾 Este hash es lo que se guarda en Airtable (NO la contraseña original)');
  
  // PASO 2: VERIFICAR (al hacer login)
  console.log('\n--- PASO 2: LOGIN DE USUARIO ---');
  
  // Simulamos diferentes intentos de login
  const loginAttempts = [
    { password: "MiContraseñaSegura123", description: "Contraseña correcta" },
    { password: "MiContraseñaSegura124", description: "Contraseña incorrecta (número diferente)" },
    { password: "micontraseñasegura123", description: "Contraseña incorrecta (mayúsculas diferentes)" },
    { password: "", description: "Contraseña vacía" }
  ];
  
  for (const attempt of loginAttempts) {
    console.log(`\n🔍 Probando: "${attempt.password}" (${attempt.description})`);
    const isValid = await bcrypt.compare(attempt.password, hashedPassword);
    console.log(`${isValid ? '✅' : '❌'} Resultado: ${isValid ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO'}`);
  }
  
  // PASO 3: DEMOSTRAR UNICIDAD
  console.log('\n--- PASO 3: UNICIDAD DE HASHES ---');
  console.log('🔄 Generando múltiples hashes de la misma contraseña...');
  
  for (let i = 1; i <= 3; i++) {
    const hash = await bcrypt.hash(originalPassword, saltRounds);
    console.log(`Hash ${i}: ${hash}`);
  }
  
  console.log('💡 Nota: Cada hash es diferente, pero todos validan la misma contraseña');
  
  // PASO 4: SEGURIDAD
  console.log('\n--- PASO 4: CARACTERÍSTICAS DE SEGURIDAD ---');
  console.log('🛡️  Características del hash bcrypt:');
  console.log('   • $2b$ = Versión de bcrypt');
  console.log('   • $12$ = Número de rondas (2^12 = 4,096 iteraciones)');
  console.log('   • Siguientes 22 chars = Salt aleatorio');
  console.log('   • Resto = Hash de la contraseña + salt');
  console.log('   • IMPOSIBLE de revertir a la contraseña original');
  console.log('   • Resistente a ataques de diccionario y rainbow tables');
}

// Ejecutar la demostración
demoPasswordEncryption().catch(console.error);
