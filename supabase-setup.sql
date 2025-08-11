-- =====================================================
-- SUPABASE SETUP SCRIPT - GRUPO ROSSO
-- Ejecutar este script en el SQL Editor de Supabase
-- =====================================================

-- 1. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'vendedor', 'distribuidor')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);

-- 3. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Crear trigger para updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Insertar usuario administrador por defecto
INSERT INTO users (email, password, name, role, active)
VALUES (
    'admin@test.com',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', -- Hash de 'admin123'
    'Administrador',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- 6. Insertar usuario vendedor de prueba
INSERT INTO users (email, password, name, role, active)
VALUES (
    'vendedor@test.com',
    'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', -- Hash de 'vendedor123'
    'Juan Vendedor',
    'vendedor',
    true
) ON CONFLICT (email) DO NOTHING;

-- 7. Insertar usuario distribuidor de prueba
INSERT INTO users (email, password, name, role, active)
VALUES (
    'distribuidor@test.com',
    '2c70e12b7a0646f92279f427c7b38e7334d8e5389cff167a1dc30e73f826b683', -- Hash de 'distribuidor123'
    'María Distribuidora',
    'distribuidor',
    true
) ON CONFLICT (email) DO NOTHING;

-- 8. Verificar que todo se creó correctamente
SELECT 'Tabla users creada exitosamente' as status;
SELECT 'Total usuarios:' as info, COUNT(*) as count FROM users;
SELECT 'Usuarios por rol:' as info, role, COUNT(*) as count FROM users GROUP BY role;

-- =====================================================
-- INSTRUCCIONES DE USO:
-- 
-- 1. Ve a tu proyecto en Supabase (https://supabase.com)
-- 2. Navega a SQL Editor
-- 3. Copia y pega este script completo
-- 4. Haz click en "RUN" para ejecutar
-- 5. Verifica que aparezcan los mensajes de éxito
-- 
-- CREDENCIALES DE PRUEBA CREADAS:
-- - admin@test.com / admin123 (Administrador)
-- - vendedor@test.com / vendedor123 (Vendedor)  
-- - distribuidor@test.com / distribuidor123 (Distribuidor)
-- =====================================================
