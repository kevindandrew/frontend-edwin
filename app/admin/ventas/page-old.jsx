'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TrendingUp, Search, Plus, Eye, Trash2 } from 'lucide-react'
import { useState } from 'react'

const initialVentas = [
  { id: 1, cliente: 'Hospital Central San José', fecha: '2024-01-15', equipos: ['Monitor Cardíaco', 'Desfibrilador'], total: 45000.00, estado: 'Completada' },
  { id: 2, cliente: 'Clínica Medisalud', fecha: '2024-01-18', equipos: ['Ventilador Pulmonar', 'Monitor ECG'], total: 120000.50, estado: 'Completada' },
  { id: 3, cliente: 'Centro Médico del Occidente', fecha: '2024-01-20', equipos: ['Ecógrafo Ultrasónico'], total: 75000.00, estado: 'Pendiente' },
  { id: 4, cliente: 'Laboratorio Biotech', fecha: '2024-01-22', equipos: ['Incubadora Neonatal', 'Monitor'], total: 32000.99, estado: 'Completada' },
  { id: 5, cliente: 'Fundación Salud Integral', fecha: '2024-01-25', equipos: ['Bomba de Infusión', 'Monitor Multiparámetro'], total: 89000.50, estado: 'En Proceso' },
]

export default function VentasPage() {
  const [ventas, setVentas] = useState(initialVentas)
  const [search, setSearch] = useState('')

  const filteredVentas = ventas.filter(v =>
    v.cliente.toLowerCase().includes(search.toLowerCase())
  )

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completada':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'En Proceso':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      case 'Pendiente':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'Cancelada':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0)
  const ventasCompletadas = ventas.filter(v => v.estado === 'Completada').reduce((sum, v) => sum + v.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
          <p className="text-muted-foreground mt-2">Gestiona las ventas de equipos biomédicos</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Venta
        </Button>
      </div>

      {/* Búsqueda */}
      <Card className="p-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Ventas</p>
          <p className="text-3xl font-bold mt-2">${totalVentas.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Completadas</p>
          <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">${ventasCompletadas.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Número de Transacciones</p>
          <p className="text-3xl font-bold mt-2">{ventas.length}</p>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cliente</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Equipos</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredVentas.map((venta) => (
                <tr key={venta.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{venta.cliente}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="max-w-xs">
                      {venta.equipos.map((equipo, idx) => (
                        <span key={idx} className="inline-block bg-secondary/70 px-2 py-1 rounded text-xs mr-1 mb-1">
                          {equipo}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{venta.fecha}</td>
                  <td className="px-6 py-4 text-sm text-foreground font-medium">${venta.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(venta.estado)}`}>
                      {venta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Eye className="w-4 h-4" />
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
    </div>
  )
}
