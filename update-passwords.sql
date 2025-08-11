UPDATE users 
SET password_hash = '7ecd13d8cb7dd26c8c816fd571971e59996d4c5523d656e80ccf037ec4878a4ac' 
WHERE email = 'admin@gruporosso.com';

UPDATE users 
SET password_hash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f' 
WHERE email = 'vendedor@gruporosso.com';

UPDATE users 
SET password_hash = '2c70e12b7a0646f92279f427c7b38e7334d8e5389cff167a1dc30e73f826b683' 
WHERE email = 'distribuidor@gruporosso.com';

SELECT email, role, password_hash FROM users ORDER BY role;
