import { useState, useEffect } from "react";
import useFetch from "./useFetch";

export default function useEstadisticas() {
  const { get } = useFetch("https://backend-edwin.onrender.com");

  const [dashboard, setDashboard] = useState(null);
  const [equiposPorCategoria, setEquiposPorCategoria] = useState([]);
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [comprasPorMes, setComprasPorMes] = useState([]);
  const [repuestosMasUsados, setRepuestosMasUsados] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    const { data, error } = await get("/estadisticas/dashboard");
    if (data && !error) {
      setDashboard(data);
    }
    return data;
  };

  const fetchEquiposPorCategoria = async () => {
    const { data, error } = await get("/estadisticas/equipos/por-categoria");
    if (data && !error) {
      setEquiposPorCategoria(data);
    }
    return data;
  };

  const fetchVentasPorMes = async (año = new Date().getFullYear()) => {
    const { data, error } = await get(
      `/estadisticas/ventas/por-mes?año=${año}`
    );
    if (data && !error) {
      setVentasPorMes(data);
    }
    return data;
  };

  const fetchComprasPorMes = async (año = new Date().getFullYear()) => {
    const { data, error } = await get(
      `/estadisticas/compras/por-mes?año=${año}`
    );
    if (data && !error) {
      setComprasPorMes(data);
    }
    return data;
  };

  const fetchCostosMantenimientoEquipo = async (equipoId) => {
    const { data, error } = await get(
      `/estadisticas/mantenimientos/costos-por-equipo/${equipoId}`
    );
    return data;
  };

  const fetchRepuestosMasUsados = async (limit = 10) => {
    const { data, error } = await get(
      `/estadisticas/repuestos/mas-usados?limit=${limit}`
    );
    if (data && !error) {
      setRepuestosMasUsados(data);
    }
    return data;
  };

  const fetchTopClientes = async (limit = 10) => {
    const { data, error } = await get(
      `/estadisticas/clientes/top-compradores?limit=${limit}`
    );
    if (data && !error) {
      setTopClientes(data);
    }
    return data;
  };

  const fetchResumenVenta = async (ventaId) => {
    const { data, error } = await get(
      `/estadisticas/ventas/resumen/${ventaId}`
    );
    return data;
  };

  const fetchResumenCompra = async (compraId) => {
    const { data, error } = await get(
      `/estadisticas/compras/resumen/${compraId}`
    );
    return data;
  };

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboard(),
        fetchEquiposPorCategoria(),
        fetchVentasPorMes(),
        fetchComprasPorMes(),
        fetchRepuestosMasUsados(),
        fetchTopClientes(),
      ]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  return {
    dashboard,
    equiposPorCategoria,
    ventasPorMes,
    comprasPorMes,
    repuestosMasUsados,
    topClientes,
    loading,
    fetchDashboard,
    fetchEquiposPorCategoria,
    fetchVentasPorMes,
    fetchComprasPorMes,
    fetchCostosMantenimientoEquipo,
    fetchRepuestosMasUsados,
    fetchTopClientes,
    fetchResumenVenta,
    fetchResumenCompra,
    fetchAllStats,
  };
}
