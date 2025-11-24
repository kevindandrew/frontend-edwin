import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export default function useMantenimientos() {
  const { get, post, put, del } = useFetch(
    "https://backend-edwin.onrender.com"
  );
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMantenimientos = async () => {
    setLoading(true);
    try {
      const { data, error } = await get("/mantenimientos/?skip=0&limit=100");
      if (data && !error) {
        setMantenimientos(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchMantenimientosByEquipo = async (equipoId) => {
    try {
      const { data, error } = await get(`/mantenimientos/equipo/${equipoId}`);
      return data && !error ? data : [];
    } catch (error) {
      return [];
    }
  };

  const fetchMantenimientosByTipo = async (tipo) => {
    try {
      const { data, error } = await get(`/mantenimientos/tipo/${tipo}`);
      return data && !error ? data : [];
    } catch (error) {
      return [];
    }
  };

  const crearMantenimiento = async (mantenimiento) => {
    try {
      const { data, error } = await post("/mantenimientos/", mantenimiento);
      if (data && !error) {
        await fetchMantenimientos();
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const actualizarMantenimiento = async (id, mantenimiento) => {
    try {
      const { data, error } = await put(`/mantenimientos/${id}`, mantenimiento);
      if (data && !error) {
        await fetchMantenimientos();
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const eliminarMantenimiento = async (id) => {
    try {
      const { error } = await del(`/mantenimientos/${id}`);
      if (!error) {
        await fetchMantenimientos();
      } else {
        throw new Error(error);
      }
    } catch (error) {
      throw error;
    }
  };

  // Funciones para uso de repuestos
  const fetchRepuestosPorMantenimiento = async (mantenimientoId) => {
    try {
      const { data, error } = await get(
        `/uso-repuestos/mantenimiento/${mantenimientoId}`
      );
      return data && !error ? data : [];
    } catch (error) {
      return [];
    }
  };

  const registrarUsoRepuesto = async (usoRepuesto) => {
    try {
      const { data, error } = await post("/uso-repuestos/", usoRepuesto);
      if (data && !error) {
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const actualizarUsoRepuesto = async (
    mantenimientoId,
    repuestoId,
    cantidadUsada
  ) => {
    try {
      const { data, error } = await put(
        `/uso-repuestos/${mantenimientoId}/${repuestoId}`,
        { cantidad_usada: cantidadUsada }
      );
      if (data && !error) {
        return data;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  const eliminarUsoRepuesto = async (mantenimientoId, repuestoId) => {
    try {
      const { error } = await del(
        `/uso-repuestos/${mantenimientoId}/${repuestoId}`
      );
      if (!error) {
        return true;
      }
      throw new Error(error);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchMantenimientos();
  }, []);

  return {
    mantenimientos,
    loading,
    fetchMantenimientos,
    fetchMantenimientosByEquipo,
    fetchMantenimientosByTipo,
    crearMantenimiento,
    actualizarMantenimiento,
    eliminarMantenimiento,
    fetchRepuestosPorMantenimiento,
    registrarUsoRepuesto,
    actualizarUsoRepuesto,
    eliminarUsoRepuesto,
  };
}
