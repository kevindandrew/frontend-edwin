'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react'

const chartData = [
  { name: 'Ene', ventas: 4000, compras: 2400 },
  { name: 'Feb', ventas: 3000, compras: 1398 },
  { name: 'Mar', ventas: 2000, compras: 9800 },
  { name: 'Abr', ventas: 2780, compras: 3908 },
  { name: 'May', ventas: 1890, compras: 4800 },
  { name: 'Jun', ventas: 2390, compras: 3800 },
]

const pieData = [
  { name: 'Producto A', value: 400 },
  { name: 'Producto B', value: 300 },
  { name: 'Producto C', value: 300 },
  { name: 'Producto D', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const StatCard = ({ icon: Icon, title, value, change }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className="text-xs text-green-600 mt-1">{change}</p>
      </div>
      <div className="bg-primary/10 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  </Card>
)

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bienvenido al Dashboard</h1>
        <p className="text-muted-foreground mt-2">Aquí puedes ver un resumen de tu negocio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          title="Ventas Totales"
          value="$45,231.89"
          change="+20.1% desde el mes pasado"
        />
        <StatCard
          icon={Users}
          title="Clientes"
          value="1,234"
          change="+5% nuevos clientes"
        />
        <StatCard
          icon={Package}
          title="Productos"
          value="456"
          change="+12 nuevos productos"
        />
        <StatCard
          icon={TrendingUp}
          title="Ingresos"
          value="$12,345"
          change="+8% este período"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4">Ventas vs Compras</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#0088FE" />
              <Bar dataKey="compras" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Productos Vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          {[
            { action: 'Venta registrada', detail: 'Venta a Cliente XYZ', time: 'hace 2 horas' },
            { action: 'Producto agregado', detail: 'Nuevo producto en inventario', time: 'hace 4 horas' },
            { action: 'Compra realizada', detail: 'Compra a Proveedor ABC', time: 'hace 1 día' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between pb-3 border-b last:border-0">
              <div>
                <p className="font-medium text-foreground">{item.action}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
