const crypto = require('crypto');

// Hash function used in the system
function hashPassword(password) {
  const salt = 'grupo-rosso-2024';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// The hash from your Supabase table
const existingHash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';

// Common passwords to test
const commonPasswords = [
  'admin123',
  'vendedor123', 
  'distribuidor123',
  'password',
  '123456',
  'admin',
  'vendedor',
  'distribuidor',
  'gruporosso',
  'grupo123',
  'rosso123',
  'test123',
  'password123',
  '12345678'
];

console.log('🔍 Buscando la contraseña que corresponde al hash...');
console.log('Hash objetivo:', existingHash);
console.log('');

let found = false;

for (const password of commonPasswords) {
  const hash = hashPassword(password);
  console.log(`Probando "${password}" -> ${hash}`);
  
  if (hash === existingHash) {
    console.log('');
    console.log('✅ ¡CONTRASEÑA ENCONTRADA!');
    console.log(`La contraseña es: "${password}"`);
    console.log('');
    console.log('🎯 Credenciales de login:');
    console.log('- admin@gruporosso.com /', password);
    console.log('- vendedor@gruporosso.com /', password);
    console.log('- distribuidor@gruporosso.com /', password);
    found = true;
    break;
  }
}

if (!found) {
  console.log('');
  console.log('❌ No se encontró la contraseña entre las comunes.');
  console.log('');
  console.log('💡 Solución: Actualizar las contraseñas en Supabase');
  console.log('Ejecuta este SQL en Supabase:');
  console.log('');
  console.log('-- Actualizar contraseñas conocidas');
  console.log(`UPDATE users SET password_hash = '${hashPassword('admin123')}' WHERE email = 'admin@gruporosso.com';`);
  console.log(`UPDATE users SET password_hash = '${hashPassword('vendedor123')}' WHERE email = 'vendedor@gruporosso.com';`);
  console.log(`UPDATE users SET password_hash = '${hashPassword('distribuidor123')}' WHERE email = 'distribuidor@gruporosso.com';`);
  console.log('');
  console.log('Después podrás usar:');
  console.log('- admin@gruporosso.com / admin123');
  console.log('- vendedor@gruporosso.com / vendedor123');
  console.log('- distribuidor@gruporosso.com / distribuidor123');
}
