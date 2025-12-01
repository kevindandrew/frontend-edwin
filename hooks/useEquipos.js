import { useState, useEffect, useMemo } from "react";
import useFetch from "./useFetch";

export default function useEquipos() {
  const { get, post, put, del } = useFetch(
    "https://backend-edwin.onrender.com"
  );
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterUbicacion, setFilterUbicacion] = useState("");

  const fetchEquipos = async () => {
    setLoading(true);
    let endpoint = "/equipos-biomedicos/";

    // Aplicar filtros si existen
    if (filterEstado) {
      endpoint = `/equipos-biomedicos/filtrar/estado/${filterEstado}`;
    } else if (filterUbicacion) {
      endpoint = `/equipos-biomedicos/filtrar/ubicacion/${filterUbicacion}`;
    }

    const { data, error } = await get(endpoint);
    if (data && !error) {
      try {
        // Fetch all locations and clients in parallel to avoid N+1 problem
        const [ubicacionesRes, clientesRes] = await Promise.all([
          get("/ubicaciones/"),
          get("/clientes/"),
        ]);

        const ubicacionesMap = new Map(
          ubicacionesRes.data?.map((u) => [u.id_ubicacion, u]) || []
        );
        const clientesMap = new Map(
          clientesRes.data?.map((c) => [c.id_cliente, c]) || []
        );

        const equiposEnriquecidos = data.map((equipo) => {
          let ubicacion = null;
          let cliente = null;

          if (equipo.id_ubicacion) {
            ubicacion = ubicacionesMap.get(equipo.id_ubicacion);
            if (ubicacion && ubicacion.id_cliente) {
              cliente = clientesMap.get(ubicacion.id_cliente);
            }
          }

          return {
            ...equipo,
            ubicacion,
            cliente,
          };
        });
        setEquipos(equiposEnriquecidos);
      } catch (err) {
        console.error("Error enriching equipos:", err);
        setEquipos(data); // Fallback to raw data
      }
    } else {
      setEquipos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipos();
  }, [filterEstado, filterUbicacion]);

  const createEquipo = async (equipo) => {
    const { data, error } = await post("/equipos-biomedicos/", equipo);
    if (data && !error) {
      await fetchEquipos();
      return { success: true, data };
    }
    return { success: false, error };
  };

  const updateEquipo = async (id, equipo) => {
    const { data, error } = await put(`/equipos-biomedicos/${id}`, equipo);
    if (data && !error) {
      await fetchEquipos();
      return { success: true };
    }
    return { success: false, error };
  };

  const deleteEquipo = async (id) => {
    const { error } = await del(`/equipos-biomedicos/${id}`);
    if (!error) {
      await fetchEquipos();
      return { success: true };
    }
    return { success: false, error };
  };

  const searchEquipoBySerie = async (serie) => {
    if (!serie) {
      await fetchEquipos();
      return;
    }
    const { data } = await get(`/equipos-biomedicos/buscar/serie/${serie}`);
    if (data) {
      setEquipos([data]);
    }
  };

  const fetchEquipoById = async (id) => {
    try {
      const { data, error } = await get(`/equipos-biomedicos/${id}`);
      if (data && !error) {
        return data;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const filteredEquipos = useMemo(() => {
    return equipos
      .filter(
        (equipo) =>
          equipo.nombre_equipo
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          equipo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          equipo.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.id_equipo - b.id_equipo);
  }, [equipos, searchTerm]);

  return {
    equipos: filteredEquipos,
    loading,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    filterUbicacion,
    setFilterUbicacion,
    createEquipo,
    updateEquipo,
    deleteEquipo,
    searchEquipoBySerie,
    fetchEquipoById,
    refreshEquipos: fetchEquipos,
  };
}
