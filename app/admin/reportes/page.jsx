"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  Wrench,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import useEstadisticas from "@/hooks/useEstadisticas";
import useEquipos from "@/hooks/useEquipos";
import useMantenimientos from "@/hooks/useMantenimientos";
import { useUsuarios } from "@/hooks/useUsuarios";
import {
  generarPDFDashboard,
  generarPDFEquipos,
  generarPDFVentas,
  generarPDFCompras,
  generarPDFRepuestos,
  generarPDFClientes,
  generarPDFCompleto,
  generarPDFProyecciones,
  generarPDFEquiposCriticos,
  generarPDFUsuarios,
} from "./_components/generarPDFReportes";

const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export default function ReportesPage() {
  const [añoSeleccionado, setAñoSeleccionado] = useState(
    new Date().getFullYear()
  );

  const {
    dashboard,
    equiposPorCategoria,
    ventasPorMes,
    comprasPorMes,
    repuestosMasUsados,
    topClientes,
    loading: loadingStats,
    fetchVentasPorMes,
    fetchComprasPorMes,
    fetchAllStats,
  } = useEstadisticas();

  const { equipos, refreshEquipos } = useEquipos();
  const { mantenimientos, fetchMantenimientos } = useMantenimientos();
  const { usuarios, refreshUsuarios } = useUsuarios();

  useEffect(() => {
    refreshEquipos();
    fetchMantenimientos();
    refreshUsuarios();
  }, []);

  const handleAñoChange = async (año) => {
    setAñoSeleccionado(parseInt(año));
    await fetchVentasPorMes(parseInt(año));
    await fetchComprasPorMes(parseInt(año));
  };

  const handleRefresh = async () => {
    await fetchAllStats();
    await refreshEquipos();
    await fetchMantenimientos();
    await refreshUsuarios();
  };

  // Logic for new reports
  const getProyecciones = () => {
    const hoy = new Date();
    return mantenimientos
      .filter((m) => new Date(m.fecha_programada) > hoy && !m.fecha_realizacion)
      .sort(
        (a, b) => new Date(a.fecha_programada) - new Date(b.fecha_programada)
      )
      .map((m) => ({
        ...m,
        equipo_nombre:
          equipos.find((e) => e.id_equipo === m.id_equipo)?.nombre_equipo ||
          "N/A",
        tecnico_nombre: m.tecnico?.nombre_completo || "Sin asignar",
      }));
  };

  const getEquiposCriticos = () => {
    // Define critical status
    const criticalStatuses = ["Malo", "En Reparación", "Fuera de Servicio"];
    return equipos.filter((e) => criticalStatuses.includes(e.estado));
  };

  const proyecciones = getProyecciones();
  const equiposCriticos = getEquiposCriticos();

  const handleGenerarPDFCompleto = () => {
    generarPDFCompleto(
      dashboard,
      equiposPorCategoria,
      ventasPorMes,
      comprasPorMes,
      repuestosMasUsados,
      topClientes,
      añoSeleccionado,
      proyecciones,
      equiposCriticos,
      usuarios
    );
  };

  if (loadingStats) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground mt-2">
            Visualiza y analiza datos del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerarPDFCompleto} className="gap-2">
            <Download className="w-4 h-4" />
            Descargar Reporte Completo
          </Button>
          <Select
            value={añoSeleccionado.toString()}
            onValueChange={handleAñoChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Equipos</p>
              <p className="text-2xl font-bold">
                {dashboard?.total_equipos || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ventas del Mes</p>
              <p className="text-2xl font-bold">
                {dashboard?.ventas_mes_actual || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mantenimientos</p>
              <p className="text-2xl font-bold">
                {dashboard?.mantenimientos_mes_actual || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance del Mes</p>
              <p
                className={`text-2xl font-bold ${
                  (dashboard?.balance_mes || 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Bs. {dashboard?.balance_mes?.toFixed(2) || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="equipos" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-2">
          <TabsTrigger value="equipos">Equipos</TabsTrigger>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="compras">Compras</TabsTrigger>
          <TabsTrigger value="repuestos">Repuestos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="proyecciones" className="gap-2">
            <Calendar className="w-4 h-4" />
            Proyecciones
          </TabsTrigger>
          <TabsTrigger value="criticos" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Críticos
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="gap-2">
            <UserCheck className="w-4 h-4" />
            Usuarios
          </TabsTrigger>
        </TabsList>

        {/* Tab Equipos */}
        <TabsContent value="equipos" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generarPDFEquipos(equiposPorCategoria, dashboard)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Equipos por Estado */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Equipos por Estado</h3>
              <div className="space-y-3">
                {dashboard?.equipos_por_estado?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{item.estado}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              (item.total / dashboard.total_equipos) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">
                        {item.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Equipos por Categoría */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Equipos por Categoría
              </h3>
              <div className="space-y-3">
                {equiposPorCategoria?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{item.categoria}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (item.total / dashboard?.total_equipos || 0) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">
                        {item.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Ventas */}
        <TabsContent value="ventas" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Ventas por Mes - {añoSeleccionado}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    generarPDFVentas(ventasPorMes, añoSeleccionado)
                  }
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                  <span>Ventas</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {MESES.map((mes, index) => {
                const venta = ventasPorMes?.find((v) => v.mes === index + 1);
                const maxVenta = Math.max(
                  ...(ventasPorMes?.map((v) => v.total_ventas) || [1])
                );
                return (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm w-12">{mes}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                        {venta && (
                          <div
                            className="bg-green-600 h-8 rounded-full flex items-center justify-end pr-2"
                            style={{
                              width: `${
                                (venta.total_ventas / maxVenta) * 100
                              }%`,
                            }}
                          >
                            <span className="text-xs text-white font-medium">
                              Bs. {venta.total_ventas.toFixed(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm w-16 text-right">
                        {venta?.cantidad_ventas || 0} ventas
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Tab Compras */}
        <TabsContent value="compras" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Compras por Mes - {añoSeleccionado}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    generarPDFCompras(comprasPorMes, añoSeleccionado)
                  }
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-orange-600 rounded"></div>
                  <span>Compras</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {MESES.map((mes, index) => {
                const compra = comprasPorMes?.find((c) => c.mes === index + 1);
                const maxCompra = Math.max(
                  ...(comprasPorMes?.map((c) => c.total_compras) || [1])
                );
                return (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm w-12">{mes}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                        {compra && (
                          <div
                            className="bg-orange-600 h-8 rounded-full flex items-center justify-end pr-2"
                            style={{
                              width: `${
                                (compra.total_compras / maxCompra) * 100
                              }%`,
                            }}
                          >
                            <span className="text-xs text-white font-medium">
                              Bs. {compra.total_compras.toFixed(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm w-16 text-right">
                        {compra?.cantidad_compras || 0} compras
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Tab Repuestos */}
        <TabsContent value="repuestos" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                generarPDFRepuestos(
                  repuestosMasUsados,
                  dashboard?.repuestos_stock_bajo
                )
              }
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Repuestos Más Usados
              </h3>
              <div className="space-y-3">
                {repuestosMasUsados?.map((item, index) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium">
                        {item.nombre_repuesto}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {item.total_usado}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              (item.total_usado /
                                Math.max(
                                  ...repuestosMasUsados.map(
                                    (r) => r.total_usado
                                  )
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.veces_usado} usos
                      </span>
                    </div>
                  </div>
                ))}
                {(!repuestosMasUsados || repuestosMasUsados.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay datos disponibles
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Stock Bajo</h3>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-600">
                    {dashboard?.repuestos_stock_bajo || 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Repuestos con stock bajo
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Clientes */}
        <TabsContent value="clientes" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Clientes</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generarPDFClientes(topClientes)}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
            </div>
            <div className="space-y-3">
              {topClientes?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b pb-3 last:border-0"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.nombre_cliente}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.total_ventas}{" "}
                      {item.total_ventas === 1 ? "venta" : "ventas"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      Bs. {item.monto_total?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {(!topClientes || topClientes.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay datos disponibles
                </p>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tab Proyecciones */}
        <TabsContent value="proyecciones" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Proyecciones de Mantenimiento
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generarPDFProyecciones(proyecciones)}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
            </div>
            <div className="space-y-3">
              {proyecciones.length > 0 ? (
                proyecciones.map((m, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{m.equipo_nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {m.tipo_mantenimiento}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{m.fecha_programada}</p>
                      <p className="text-sm text-muted-foreground">
                        {m.tecnico_nombre}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay mantenimientos futuros programados
                </p>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tab Equipos Críticos */}
        <TabsContent value="criticos" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Equipos Críticos</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generarPDFEquiposCriticos(equiposCriticos)}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
            </div>
            <div className="space-y-3">
              {equiposCriticos.length > 0 ? (
                equiposCriticos.map((e, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{e.nombre_equipo}</p>
                      <p className="text-sm text-muted-foreground">
                        {e.marca} - {e.modelo}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        {e.estado}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {e.ubicacion}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No se encontraron equipos críticos
                </p>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tab Usuarios */}
        <TabsContent value="usuarios" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Lista de Usuarios</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generarPDFUsuarios(usuarios)}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
            </div>
            <div className="space-y-3">
              {usuarios.length > 0 ? (
                usuarios.map((u, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{u.nombre_completo}</p>
                      <p className="text-sm text-muted-foreground">
                        {u.username}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {u.rol?.nombre_rol || "N/A"}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {u.email || "Sin email"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay usuarios registrados
                </p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
