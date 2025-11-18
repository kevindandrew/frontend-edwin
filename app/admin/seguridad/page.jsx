'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Eye, EyeOff, User, Save } from 'lucide-react'
import { useState } from 'react'

export default function SecurityPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userInfo, setUserInfo] = useState({
    nombreCompleto: 'Juan Pérez García',
    nombreUsuario: 'jpgarcia',
    email: 'juan.perez@hospitalcentral.com',
    rol: 'Administrador',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userInfo)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    actual: '',
    nueva: '',
    confirmar: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    setUserInfo(formData)
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    if (passwordForm.nueva === passwordForm.confirmar) {
      setShowPasswordForm(false)
      setPasswordForm({ actual: '', nueva: '', confirmar: '' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Seguridad</h1>
        <p className="text-muted-foreground mt-2">Gestiona tu información de usuario y contraseña</p>
      </div>

      {/* Información del Usuario */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Información del Usuario</h2>
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre Completo</label>
              <Input
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de Usuario</label>
              <Input
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleInputChange}
                placeholder="Tu nombre de usuario"
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Tu email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <Input
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => {
                setFormData(userInfo)
                setIsEditing(false)
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile} className="gap-2">
                <Save className="w-4 h-4" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Nombre Completo</p>
                <p className="font-medium text-foreground mt-1">{userInfo.nombreCompleto}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Usuario</p>
                <p className="font-medium text-foreground mt-1">{userInfo.nombreUsuario}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="font-medium text-foreground mt-1">{userInfo.email}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Rol</p>
                <p className="font-medium text-foreground mt-1">{userInfo.rol}</p>
              </div>
            </div>
            <Button onClick={() => {
              setFormData(userInfo)
              setIsEditing(true)
            }} className="w-full">
              Editar Información
            </Button>
          </div>
        )}
      </Card>

      {/* Contraseña */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Contraseña</h2>
        </div>
        
        {showPasswordForm ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña Actual</label>
              <div className="relative">
                <Input
                  name="actual"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.actual}
                  onChange={handlePasswordChange}
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
              <div className="relative">
                <Input
                  name="nueva"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.nueva}
                  onChange={handlePasswordChange}
                  placeholder="Ingresa la nueva contraseña"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
              <div className="relative">
                <Input
                  name="confirmar"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.confirmar}
                  onChange={handlePasswordChange}
                  placeholder="Confirma la nueva contraseña"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            {passwordForm.nueva && passwordForm.confirmar && passwordForm.nueva !== passwordForm.confirmar && (
              <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
            )}
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => {
                setShowPasswordForm(false)
                setPasswordForm({ actual: '', nueva: '', confirmar: '' })
                setShowPassword(false)
              }}>
                Cancelar
              </Button>
              <Button onClick={handleChangePassword} disabled={!passwordForm.actual || !passwordForm.nueva || passwordForm.nueva !== passwordForm.confirmar}>
                Cambiar Contraseña
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4">Actualiza tu contraseña regularmente para mantener tu cuenta segura</p>
            <Button onClick={() => setShowPasswordForm(true)}>
              Cambiar Contraseña
            </Button>
          </div>
        )}
      </Card>

      {/* Rol y Permisos */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Rol y Permisos</h2>
        <div className="space-y-3">
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="font-medium text-foreground mb-2">Rol: {userInfo.rol}</p>
            <p className="text-sm text-muted-foreground">Tienes acceso a todos los módulos del sistema</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
