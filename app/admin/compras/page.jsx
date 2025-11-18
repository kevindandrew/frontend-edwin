'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Search, Plus, Eye, Trash2 } from 'lucide-react'
import { useState } from 'react'

const initialCompras = [
  { id: 1, proveedor: 'MedTech Solutions', fecha: '2024-01-15', total: 15500.00, estado: 'Entregado', items: 2, equipo: 'Monitores Cardíacos' },
  { id: 2, proveedor: 'BiomedEquip Inc.', fecha: '2024-01-18', total: 8350.50, estado: 'En Tránsito', items: 1, equipo: 'Ventilador Pulmonar' },
  { id: 3, proveedor: 'Diagnostic Systems', fecha: '2024-01-20', total: 22945.99, estado: 'Pendiente', items: 3, equipo: 'Ecógrafos Ultrasónicos' },
  { id: 4, proveedor: 'MedTech Solutions', fecha: '2024-01-22', total: 9200.00, estado: 'Entregado', items: 4, equipo: 'Desfibriladores Externos' },
  { id: 5, proveedor: 'Clinical Instruments', fecha: '2024-01-25', total: 5500.00, estado: 'Cancelado', items: 2, equipo: 'Analizador Bioquímico' },
]

export default function ComprasPage() {
  const [compras, setCompras] = useState(initialCompras)
  const [search, setSearch] = useState('')

  const filteredCompras = compras.filter(c =>
    c.proveedor.toLowerCase().includes(search.toLowerCase()) ||
    c.equipo.toLowerCase().includes(search.toLowerCase())
  )

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Entregado':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'En Tránsito':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Cancelado':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const totalCompras = compras.reduce((sum, c) => sum + c.total, 0)
  const comprasEntregadas = compras.filter(c => c.estado === 'Entregado').reduce((sum, c) => sum + c.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compras de Equipos Biomédicos</h1>
          <p className="text-muted-foreground mt-2">Gestiona las órdenes de equipos médicos a proveedores especializados</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Compra
        </Button>
      </div>

      {/* Búsqueda */}
      <Card className="p-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por proveedor o equipo..."
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
          <p className="text-sm text-muted-foreground">Total en Compras</p>
          <p className="text-3xl font-bold mt-2">${totalCompras.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Equipos Entregados</p>
          <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">${comprasEntregadas.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Órdenes Activas</p>
          <p className="text-3xl font-bold mt-2">{compras.length}</p>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Proveedor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Equipo Biomédico</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cantidad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCompras.map((compra) => (
                <tr key={compra.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{compra.proveedor}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{compra.equipo}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{compra.fecha}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{compra.items}</td>
                  <td className="px-6 py-4 text-sm text-foreground font-medium">${compra.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(compra.estado)}`}>
                      {compra.estado}
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
