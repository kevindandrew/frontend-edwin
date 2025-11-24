import { useState, useEffect } from "react";
import useFetch from "./useFetch";

export default function useUbicaciones(clienteId = null) {
  const { get, post, put, del } = useFetch(
    "https://backend-edwin.onrender.com"
  );
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUbicaciones = async () => {
    setLoading(true);
    let endpoint = "/ubicaciones/";
    if (clienteId) {
      endpoint = `/ubicaciones/cliente/${clienteId}`;
    }
    const { data, error } = await get(endpoint);
    if (data && !error) {
      setUbicaciones(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (clienteId) {
      fetchUbicaciones();
    }
  }, [clienteId]);

  const createUbicacion = async (ubicacion) => {
    const { data, error } = await post("/ubicaciones/", ubicacion);
    if (data && !error) {
      await fetchUbicaciones();
      return { success: true };
    }
    return { success: false, error };
  };

  const updateUbicacion = async (id, ubicacion) => {
    const { data, error } = await put(`/ubicaciones/${id}`, ubicacion);
    if (data && !error) {
      await fetchUbicaciones();
      return { success: true };
    }
    return { success: false, error };
  };

  const deleteUbicacion = async (id) => {
    const { error } = await del(`/ubicaciones/${id}`);
    if (!error) {
      await fetchUbicaciones();
      return { success: true };
    }
    return { success: false, error };
  };

  const fetchUbicacionesByCliente = async (clienteId) => {
    try {
      const { data, error } = await get(`/ubicaciones/cliente/${clienteId}`);
      if (data && !error) {
        return data;
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  const filteredUbicaciones = ubicaciones.filter((ubicacion) =>
    ubicacion.nombre_ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    ubicaciones: filteredUbicaciones,
    loading,
    searchTerm,
    setSearchTerm,
    createUbicacion,
    updateUbicacion,
    deleteUbicacion,
    refreshUbicaciones: fetchUbicaciones,
    fetchUbicacionesByCliente,
  };
}
