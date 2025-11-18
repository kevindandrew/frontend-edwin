'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wrench, Search, Plus, Edit, Trash2, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const initialMantenimientos = [
  { id: 1, equipo: 'Monitor Cardíaco', tipo: 'Preventivo', fecha: '2024-01-15', fechaRealizacion: '2024-01-15', estado: 'Completado', costo: 500.00 },
  { id: 2, equipo: 'Ventilador Pulmonar', tipo: 'Correctivo', fecha: '2024-01-18', fechaRealizacion: null, estado: 'Pendiente', costo: 0 },
  { id: 3, equipo: 'Desfibrilador', tipo: 'Preventivo', fecha: '2024-01-20', fechaRealizacion: '2024-01-21', estado: 'En Progreso', costo: 350.00 },
  { id: 4, equipo: 'Ecógrafo Ultrasónico', tipo: 'Preventivo', fecha: '2024-02-10', fechaRealizacion: null, estado: 'Programado', costo: 0 },
  { id: 5, equipo: 'Incubadora Neonatal', tipo: 'Correctivo', fecha: '2024-01-25', fechaRealizacion: '2024-01-26', estado: 'Completado', costo: 1200.00 },
]

export default function MantenimientoPage() {
  const [mantenimientos, setMantenimientos] = useState(initialMantenimientos)
  const [search, setSearch] = useState('')

  const filteredMantenimientos = mantenimientos.filter(m =>
    m.equipo.toLowerCase().includes(search.toLowerCase())
  )

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'Pendiente':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      case 'En Progreso':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      case 'Programado':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mantenimiento</h1>
          <p className="text-muted-foreground mt-2">Gestiona el mantenimiento de equipos biomédicos</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Mantenimiento
        </Button>
      </div>

      {/* Búsqueda */}
      <Card className="p-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por equipo..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Alertas */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-900 dark:text-red-300">Mantenimiento Pendiente</p>
          <p className="text-sm text-red-800 dark:text-red-200">1 equipo requiere mantenimiento correctivo urgente</p>
        </div>
      </div>

      {/* Tabla */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Equipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha Programada</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Costo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMantenimientos.map((m) => (
                <tr key={m.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{m.equipo}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{m.tipo}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{m.fecha}</td>
                  <td className="px-6 py-4 text-sm text-foreground font-medium">${m.costo.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(m.estado)}`}>
                      {m.estado}
                    </span>
                  </td>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Registros</p>
          <p className="text-3xl font-bold mt-2">{mantenimientos.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Completados</p>
          <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">{mantenimientos.filter(m => m.estado === 'Completado').length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">En Progreso</p>
          <p className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">{mantenimientos.filter(m => m.estado === 'En Progreso').length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">{mantenimientos.filter(m => m.estado === 'Pendiente').length}</p>
        </Card>
      </div>
    </div>
  )
}
