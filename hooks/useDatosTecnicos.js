import { useState, useEffect } from "react";
import useFetch from "./useFetch";

export default function useDatosTecnicos(equipoId = null) {
  const { get, post, put, del } = useFetch(
    "https://backend-edwin.onrender.com"
  );
  const [datosTecnicos, setDatosTecnicos] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDatosTecnicos = async () => {
    if (!equipoId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await get(`/datos-tecnicos/equipo/${equipoId}`);
    if (data && !error) {
      setDatosTecnicos(Array.isArray(data) ? data[0] : data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (equipoId) {
      fetchDatosTecnicos();
    }
  }, [equipoId]);

  const createDatosTecnicos = async (datos) => {
    const { data, error } = await post("/datos-tecnicos/", datos);
    if (data && !error) {
      await fetchDatosTecnicos();
      return { success: true };
    }
    return { success: false, error };
  };

  const updateDatosTecnicos = async (id, datos) => {
    const { data, error } = await put(`/datos-tecnicos/${id}`, datos);
    if (data && !error) {
      await fetchDatosTecnicos();
      return { success: true };
    }
    return { success: false, error };
  };

  return {
    datosTecnicos,
    loading,
    createDatosTecnicos,
    updateDatosTecnicos,
    refreshDatosTecnicos: fetchDatosTecnicos,
  };
}
