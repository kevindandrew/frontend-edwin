'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Package, Search, Plus, Edit, Trash2, AlertCircle, Stethoscope } from 'lucide-react'
import { useState } from 'react'

const initialEquipos = [
  { 
    id: 1, 
    nombre_equipo: 'Monitor Cardíaco Multiparámetro', 
    modelo: 'MC-3000', 
    numero_serie: 'SN-2024-001', 
    fecha_adquisicion: '2024-01-15',
    fabricante: 'Philips Healthcare',
    categoria: 'Monitoreo',
    riesgo: 'Clase IIb',
    ubicacion: 'Hospital Central - Sala de UCI',
    estado: 'Activo',
    garantia: '24 meses'
  },
  { 
    id: 2, 
    nombre_equipo: 'Ventilador Pulmonar Invasivo', 
    modelo: 'VP-5000', 
    numero_serie: 'SN-2024-002', 
    fecha_adquisicion: '2023-11-20',
    fabricante: 'Siemens Medical',
    categoria: 'Soporte Vital',
    riesgo: 'Clase III',
    ubicacion: 'Hospital Central - Sala de UCI',
    estado: 'En Mantenimiento',
    garantia: '36 meses'
  },
  { 
    id: 3, 
    nombre_equipo: 'Ecógrafo Ultrasónico', 
    modelo: 'US-2000', 
    numero_serie: 'SN-2024-003', 
    fecha_adquisicion: '2024-02-10',
    fabricante: 'GE Healthcare',
    categoria: 'Diagnóstico',
    riesgo: 'Clase II',
    ubicacion: 'Clínica Privada - Sala de Ecografía',
    estado: 'Activo',
    garantia: '24 meses'
  },
  { 
    id: 4, 
    nombre_equipo: 'Desfibrilador Externo Automático', 
    modelo: 'DEA-X200', 
    numero_serie: 'SN-2024-004', 
    fecha_adquisicion: '2023-08-05',
    fabricante: 'Philips Healthcare',
    categoria: 'Emergencia',
    riesgo: 'Clase III',
    ubicacion: 'Almacén Central',
    estado: 'Disponible',
    garantia: '60 meses'
  },
  { 
    id: 5, 
    nombre_equipo: 'Bomba de Infusión Inteligente', 
    modelo: 'BI-700', 
    numero_serie: 'SN-2024-005', 
    fecha_adquisicion: '2024-03-01',
    fabricante: 'B. Braun',
    categoria: 'Administración',
    riesgo: 'Clase II',
    ubicacion: 'Hospital Central - Sala de Farmacología',
    estado: 'Reparación',
    garantia: '24 meses'
  },
]

export default function InventarioPage() {
  const [equipos, setEquipos] = useState(initialEquipos)
  const [search, setSearch] = useState('')

  const filteredEquipos = equipos.filter(equipo =>
    equipo.nombre_equipo.toLowerCase().includes(search.toLowerCase()) ||
    equipo.numero_serie.toLowerCase().includes(search.toLowerCase()) ||
    equipo.fabricante.toLowerCase().includes(search.toLowerCase())
  )

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'Disponible':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'En Mantenimiento':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'Reparación':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'Baja':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getRiesgoColor = (riesgo) => {
    switch (riesgo) {
      case 'Clase I':
        return 'text-green-600'
      case 'Clase II':
        return 'text-blue-600'
      case 'Clase IIb':
        return 'text-amber-600'
      case 'Clase III':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const equipoEnAlerta = equipos.filter(e => 
    e.estado === 'En Mantenimiento' || e.estado === 'Reparación'
  ).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="w-8 h-8" />
            Inventario Biomédico
          </h1>
          <p className="text-muted-foreground mt-2">Gestiona equipos biomédicos y su disponibilidad</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Equipo
        </Button>
      </div>

      {/* Búsqueda */}
      <Card className="p-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, serie o fabricante..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Alertas */}
      {equipoEnAlerta > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">Equipos en Mantenimiento</p>
            <p className="text-sm text-amber-800 dark:text-amber-200">{equipoEnAlerta} equipo(s) requieren atención</p>
          </div>
        </div>
      )}

      {/* Tabla */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Equipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Modelo / Serie</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fabricante</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ubicación</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Riesgo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEquipos.map((equipo) => (
                <tr key={equipo.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{equipo.nombre_equipo}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="font-mono">{equipo.modelo}</div>
                    <div className="text-xs text-muted-foreground">{equipo.numero_serie}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{equipo.fabricante}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground text-xs">{equipo.ubicacion}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-semibold ${getRiesgoColor(equipo.riesgo)}`}>
                      {equipo.riesgo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(equipo.estado)}`}>
                      {equipo.estado}
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
          <p className="text-sm text-muted-foreground">Total Equipos</p>
          <p className="text-3xl font-bold mt-2">{equipos.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Activos</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{equipos.filter(e => e.estado === 'Activo').length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">En Servicio</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{equipos.filter(e => e.estado === 'Disponible').length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Requieren Atención</p>
          <p className="text-3xl font-bold mt-2 text-amber-600">{equipoEnAlerta}</p>
        </Card>
      </div>
    </div>
  )
}
