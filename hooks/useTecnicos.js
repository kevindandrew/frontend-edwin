import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export default function useTecnicos() {
  const { get } = useFetch("https://backend-edwin.onrender.com");
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTecnicos = async () => {
    setLoading(true);
    try {
      const { data, error } = await get("/usuarios/?skip=0&limit=100");
      if (data && !error) {
        // Filtrar solo técnicos (id_rol = 2)
        const tecnicosFiltrados = data.filter((u) => u.id_rol === 2);
        setTecnicos(tecnicosFiltrados);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const fetchTecnicoById = async (id) => {
    const { data, error } = await get(`/usuarios/${id}`);
    if (data && !error) {
      return data;
    }
    return null;
  };

  return {
    tecnicos,
    loading,
    fetchTecnicos,
    fetchTecnicoById,
  };
}
