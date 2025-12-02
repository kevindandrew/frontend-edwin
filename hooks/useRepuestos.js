import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export default function useRepuestos() {
  const { get, post, put, del } = useFetch(
    "https://backend-edwin.onrender.com"
  );
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchRepuestos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await get(
        "/repuestos/?skip=0&limit=100"
      );
      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setRepuestos(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepuestosStockBajo = async () => {
    try {
      const { data, error } = await get("/repuestos/stock/bajo");
      return data && !error ? data : [];
    } catch (error) {
      return [];
    }
  };

  const crearRepuesto = async (repuesto) => {
    try {
      const { data, error } = await post("/repuestos/", repuesto);
      if (data && !error) {
        await fetchRepuestos();
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const actualizarRepuesto = async (id, repuesto) => {
    try {
      const { data, error } = await put(`/repuestos/${id}`, repuesto);
      if (data && !error) {
        await fetchRepuestos();
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const eliminarRepuesto = async (id) => {
    try {
      const { error } = await del(`/repuestos/${id}`);
      if (!error) {
        await fetchRepuestos();
      } else {
        throw new Error(error);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const actualizarStock = async (id, cantidad) => {
    try {
      const repuesto = repuestos.find((r) => r.id_repuesto === id);
      if (!repuesto) throw new Error("Repuesto no encontrado");

      const nuevoStock = repuesto.stock - cantidad;
      if (nuevoStock < 0) throw new Error("Stock insuficiente");

      const { data, error } = await put(`/repuestos/${id}`, {
        ...repuesto,
        stock: nuevoStock,
      });
      if (data && !error) {
        await fetchRepuestos();
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  return {
    repuestos,
    loading,
    error,
    fetchRepuestos,
    fetchRepuestosStockBajo,
    crearRepuesto,
    actualizarRepuesto,
    eliminarRepuesto,
    actualizarStock,
  };
}
