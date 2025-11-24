import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export default function useCompras() {
  const { get, post, put, del } = useFetch(
    "https://backend-edwin.onrender.com"
  );
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCompras = async () => {
    setLoading(true);
    try {
      const { data, error } = await get("/compras/?skip=0&limit=100");
      if (data && !error) {
        setCompras(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchComprasByEstado = async (estado) => {
    try {
      const { data, error } = await get(`/compras/estado/${estado}`);
      return data && !error ? data : [];
    } catch (error) {
      return [];
    }
  };

  const crearCompra = async (compra) => {
    try {
      const { data, error } = await post("/compras/", compra);
      if (data && !error) {
        await fetchCompras();
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const actualizarCompra = async (id, compra) => {
    try {
      const { data, error } = await put(`/compras/${id}`, compra);
      if (data && !error) {
        await fetchCompras();
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const eliminarCompra = async (id) => {
    try {
      const { error } = await del(`/compras/${id}`);
      if (!error) {
        await fetchCompras();
      } else {
        throw new Error(error);
      }
    } catch (error) {
      throw error;
    }
  };

  // Detalles de compra
  const fetchDetallesPorCompra = async (compraId) => {
    try {
      const { data, error } = await get(`/detalles-compra/compra/${compraId}`);
      return data && !error ? data : [];
    } catch (error) {
      return [];
    }
  };

  const crearDetalleCompra = async (detalle) => {
    try {
      const { data, error } = await post("/detalles-compra/", detalle);
      if (data && !error) {
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const actualizarDetalleCompra = async (id, detalle) => {
    try {
      const { data, error } = await put(`/detalles-compra/${id}`, detalle);
      if (data && !error) {
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const eliminarDetalleCompra = async (id) => {
    try {
      const { error } = await del(`/detalles-compra/${id}`);
      if (!error) {
        return true;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  return {
    compras,
    loading,
    fetchCompras,
    fetchComprasByEstado,
    crearCompra,
    actualizarCompra,
    eliminarCompra,
    fetchDetallesPorCompra,
    crearDetalleCompra,
    actualizarDetalleCompra,
    eliminarDetalleCompra,
  };
}
