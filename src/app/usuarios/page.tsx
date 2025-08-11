'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'vendedor' | 'distribuidor'
  active: boolean
  created_at: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'vendedor' as 'admin' | 'vendedor' | 'distribuidor',
    active: true
  })

  // Load users from Supabase
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await loadUsers()
        setShowForm(false)
        setEditingUser(null)
        setFormData({ email: '', name: '', password: '', role: 'vendedor', active: true })
        alert(editingUser ? 'Usuario actualizado' : 'Usuario creado')
      } else {
        alert('Error al guardar usuario')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Error de conexión')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name,
      password: '',
      role: user.role,
      active: user.active
    })
    setShowForm(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadUsers()
        alert('Usuario eliminado')
      } else {
        alert('Error al eliminar usuario')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error de conexión')
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      })

      if (response.ok) {
        await loadUsers()
        alert(`Usuario ${!currentStatus ? 'activado' : 'desactivado'}`)
      } else {
        alert('Error al cambiar estado')
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('Error de conexión')
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Cargando usuarios...</div>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#dc2626' }}>👥 Control de Usuarios</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Gestión de usuarios en Supabase</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingUser(null)
            setFormData({ email: '', name: '', password: '', role: 'vendedor', active: true })
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Usuario'}
        </button>
      </div>

      {/* User Form */}
      {showForm && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0' }}>
            {editingUser ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Nombre:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {editingUser ? 'Nueva Contraseña (dejar vacío para no cambiar):' : 'Contraseña:'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Rol:
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              >
                <option value="vendedor">🛍️ Vendedor</option>
                <option value="distribuidor">📦 Distribuidor</option>
                <option value="admin">👑 Admin</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                style={{ transform: 'scale(1.2)' }}
              />
              <label style={{ fontWeight: 'bold' }}>Usuario activo</label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {editingUser ? '💾 Actualizar' : '➕ Crear Usuario'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingUser(null)
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0' }}>📋 Lista de Usuarios ({users.length})</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Rol</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Creado</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} style={{ 
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                }}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    <strong>{user.email}</strong>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    {user.name}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: 
                        user.role === 'admin' ? '#fef2f2' : 
                        user.role === 'vendedor' ? '#eff6ff' : '#f0fdf4',
                      color: 
                        user.role === 'admin' ? '#dc2626' : 
                        user.role === 'vendedor' ? '#2563eb' : '#059669'
                    }}>
                      {user.role === 'admin' ? '👑 Admin' : 
                       user.role === 'vendedor' ? '🛍️ Vendedor' : '📦 Distribuidor'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: user.active ? '#dcfce7' : '#fef2f2',
                      color: user.active ? '#166534' : '#dc2626'
                    }}>
                      {user.active ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✏️
                      </button>
                      
                      <button
                        onClick={() => toggleUserStatus(user.id, user.active)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: user.active ? '#dc2626' : '#059669',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        {user.active ? '🚫' : '✅'}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#666'
          }}>
            <p>No hay usuarios registrados</p>
            <p>Haz click en "Nuevo Usuario" para agregar el primero</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px', 
        padding: '20px',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>👥 Control de Usuarios - Supabase</p>
        <p>Gestión completa de usuarios del sistema</p>
      </div>
    </div>
  )
}
