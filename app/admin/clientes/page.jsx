'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Search, Plus, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

const initialClientes = [
  { id: 1, nombreInstitucion: 'Hospital Central San José', nit: '800123456', direccion: 'Cra 5 #20-50, Bogotá', telefonoContacto: '555-0101', emailContacto: 'contacto@hospitalcentral.com', personaContacto: 'Dr. Juan Pérez' },
  { id: 2, nombreInstitucion: 'Clínica Medisalud', nit: '800234567', direccion: 'Cra 7 #45-30, Medellín', telefonoContacto: '555-0102', emailContacto: 'info@medisalud.com', personaContacto: 'Ing. María García' },
  { id: 3, nombreInstitucion: 'Centro Médico del Occidente', nit: '800345678', direccion: 'Cra 10 #15-80, Cali', telefonoContacto: '555-0103', emailContacto: 'admin@centromedico.com', personaContacto: 'Dr. Carlos López' },
  { id: 4, nombreInstitucion: 'Laboratorio Biotech', nit: '800456789', direccion: 'Cra 3 #60-40, Barranquilla', telefonoContacto: '555-0104', emailContacto: 'lab@biotech.com', personaContacto: 'Dra. Ana Martínez' },
  { id: 5, nombreInstitucion: 'Fundación Salud Integral', nit: '800567890', direccion: 'Cra 8 #32-15, Bucaramanga', telefonoContacto: '555-0105', emailContacto: 'contacto@saludintegral.com', personaContacto: 'Ing. Roberto González' },
]

export default function ClientesPage() {
  const [clientes, setClientes] = useState(initialClientes)
  const [search, setSearch] = useState('')

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombreInstitucion.toLowerCase().includes(search.toLowerCase()) ||
    cliente.nit.toLowerCase().includes(search.toLowerCase()) ||
    cliente.personaContacto.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-2">Gestiona las instituciones clientes</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Institución
        </Button>
      </div>

      {/* Búsqueda */}
      <Card className="p-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, NIT o persona de contacto..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Institución</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">NIT</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Contacto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Teléfono</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{cliente.nombreInstitucion}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{cliente.nit}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{cliente.personaContacto}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{cliente.emailContacto}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{cliente.telefonoContacto}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total de Instituciones</p>
          <p className="text-3xl font-bold mt-2">{clientes.length}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Direcciones Activas</p>
              <p className="text-3xl font-bold mt-2">{clientes.length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
