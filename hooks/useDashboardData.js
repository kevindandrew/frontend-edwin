import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import Cookies from "js-cookie";

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

export const useDashboardData = () => {
  const {
    get,
    loading,
    error: fetchError,
  } = useFetch("https://backend-edwin.onrender.com");
  const [dashboardData, setDashboardData] = useState(null);
  const [ventasMesActual, setVentasMesActual] = useState({
    total: 0,
    cantidad: 0,
    mes: "",
    porcentaje: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [equiposPorCategoria, setEquiposPorCategoria] = useState([]);
  const [actividadReciente, setActividadReciente] = useState([]);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    // Verificar si existe el token antes de hacer las peticiones
    const checkToken = () => {
      const token = Cookies.get("token");
      if (!token) {
        setAuthError(true);
        return false;
      }
      return true;
    };

    const fetchData = async () => {
      // Verificar token primero
      if (!checkToken()) {
        return;
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      // 1. Obtener datos del dashboard
      const { data: dashData } = await get("/estadisticas/dashboard");
      if (dashData) {
        setDashboardData(dashData);
      }

      // 2. Obtener ventas por mes para el mes actual y anterior
      const { data: ventasData } = await get(
        `/estadisticas/ventas/por-mes?año=${currentYear}`
      );
      if (ventasData && ventasData.length > 0) {
        const mesActual = ventasData.find((v) => v.mes === currentMonth);
        const mesAnterior = ventasData.find((v) => v.mes === currentMonth - 1);

        if (mesActual) {
          const totalActual = mesActual.total || 0;
          const totalAnterior = mesAnterior?.total || 0;
          const porcentaje =
            totalAnterior > 0
              ? (((totalActual - totalAnterior) / totalAnterior) * 100).toFixed(
                  1
                )
              : 0;

          setVentasMesActual({
            total: totalActual,
            cantidad: mesActual.cantidad || 0,
            mes: MESES[currentMonth - 1],
            porcentaje: porcentaje > 0 ? `+${porcentaje}%` : `${porcentaje}%`,
          });
        }
      }

      // 3. Obtener ventas y compras del año para el gráfico
      const { data: ventasAnuales } = await get(
        `/estadisticas/ventas/por-mes?año=${currentYear}`
      );
      const { data: comprasAnuales } = await get(
        `/estadisticas/compras/por-mes?año=${currentYear}`
      );

      if (ventasAnuales || comprasAnuales) {
        const chartDataTemp = MESES.map((mes, index) => {
          const mesNum = index + 1;
          const ventaMes = ventasAnuales?.find((v) => v.mes === mesNum);
          const compraMes = comprasAnuales?.find((c) => c.mes === mesNum);

          return {
            name: mes,
            ventas: ventaMes?.total || 0,
            compras: compraMes?.total || 0,
          };
        });
        setChartData(chartDataTemp);
      }

      // 4. Obtener equipos por categoría
      const { data: equiposData } = await get(
        "/estadisticas/equipos/por-categoria"
      );
      if (equiposData && equiposData.length > 0) {
        const equiposFormateados = equiposData.map((e) => ({
          name: e.categoria || "Sin categoría",
          value: e.total || 0,
        }));
        setEquiposPorCategoria(equiposFormateados);
      }

      // 5. Obtener actividad reciente del usuario (ID hardcodeado por ahora)
      const { data: auditoriaData } = await get(
        "/auditoria/usuario/1?skip=0&limit=5"
      );
      if (auditoriaData && auditoriaData.length > 0) {
        setActividadReciente(auditoriaData);
      }
    };

    fetchData();
  }, [get]);

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diff = Math.floor((ahora - fecha) / 1000); // diferencia en segundos

    if (diff < 60) return "hace unos segundos";
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} horas`;
    if (diff < 604800) return `hace ${Math.floor(diff / 86400)} días`;

    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  };

  const getOperacionTexto = (operacion) => {
    const operaciones = {
      CREATE: "Creó",
      UPDATE: "Actualizó",
      DELETE: "Eliminó",
      LOGIN: "Inició sesión",
      LOGOUT: "Cerró sesión",
    };
    return operaciones[operacion] || operacion;
  };

  return {
    loading,
    authError,
    dashboardData,
    ventasMesActual,
    chartData,
    equiposPorCategoria,
    actividadReciente,
    formatearFecha,
    getOperacionTexto,
  };
};
