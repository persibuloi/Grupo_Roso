-- ACTUALIZAR CON NUEVAS CONTRASEÑAS CONOCIDAS
-- Ejecutar en Supabase SQL Editor

UPDATE users 
SET password_hash = '7ecd13d8cb7dd26c8c816fd571971e59996d4c5523d656e80ccf037ec4878a4ac' 
WHERE email = 'admin@gruporosso.com';

UPDATE users 
SET password_hash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f' 
WHERE email = 'vendedor@gruporosso.com';

UPDATE users 
SET password_hash = '387674f6de23d8aa43bb39537b980d8ba7cb99e0b26b1e24f140eafe73d38c18' 
WHERE email = 'distribuidor@gruporosso.com';

-- Verificar que se actualizaron
SELECT email, role, password_hash FROM users ORDER BY role;
