import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export default function useVentas() {
  const { get, post, put, del } = useFetch(
    "https://backend-edwin.onrender.com"
  );
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVentas = async () => {
    setLoading(true);
    try {
      const { data, error } = await get("/ventas/?skip=0&limit=100");
      if (data && !error) {
        setVentas(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchVentasByCliente = async (clienteId) => {
    try {
      const { data, error } = await get(`/ventas/filtrar/cliente/${clienteId}`);
      return data && !error ? data : [];
    } catch (error) {
      return [];
    }
  };

  const fetchVentasByEstado = async (estado) => {
    try {
      const { data, error } = await get(`/ventas/filtrar/estado/${estado}`);
      return data && !error ? data : [];
    } catch (error) {
      return [];
    }
  };

  const crearVenta = async (venta) => {
    try {
      const { data, error } = await post("/ventas/", venta);
      if (data && !error) {
        await fetchVentas();
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const actualizarVenta = async (id, venta) => {
    try {
      const { data, error } = await put(`/ventas/${id}`, venta);
      if (data && !error) {
        await fetchVentas();
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const eliminarVenta = async (id) => {
    try {
      const { error } = await del(`/ventas/${id}`);
      if (!error) {
        await fetchVentas();
      } else {
        throw new Error(error);
      }
    } catch (error) {
      throw error;
    }
  };

  // Detalles de venta
  const fetchDetallesPorVenta = async (ventaId) => {
    try {
      const { data, error } = await get(`/detalles-venta/venta/${ventaId}`);
      return data && !error ? data : [];
    } catch (error) {
      return [];
    }
  };

  const crearDetalleVenta = async (detalle) => {
    try {
      const { data, error } = await post("/detalles-venta/", detalle);
      if (data && !error) {
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const actualizarDetalleVenta = async (id, detalle) => {
    try {
      const { data, error } = await put(`/detalles-venta/${id}`, detalle);
      if (data && !error) {
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const eliminarDetalleVenta = async (id) => {
    try {
      const { error } = await del(`/detalles-venta/${id}`);
      if (!error) {
        return true;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return {
    ventas,
    loading,
    fetchVentas,
    fetchVentasByCliente,
    fetchVentasByEstado,
    crearVenta,
    actualizarVenta,
    eliminarVenta,
    fetchDetallesPorVenta,
    crearDetalleVenta,
    actualizarDetalleVenta,
    eliminarDetalleVenta,
  };
}
