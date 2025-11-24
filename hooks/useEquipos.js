import { useState, useEffect } from "react";
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
      // Enriquecer equipos con datos del cliente a través de la ubicación
      const equiposEnriquecidos = await Promise.all(
        data.map(async (equipo) => {
          if (equipo.id_ubicacion) {
            const { data: ubicacionData } = await get(
              `/ubicaciones/${equipo.id_ubicacion}/`
            );
            if (ubicacionData && ubicacionData.id_cliente) {
              const { data: clienteData } = await get(
                `/clientes/${ubicacionData.id_cliente}/`
              );
              return {
                ...equipo,
                ubicacion: ubicacionData,
                cliente: clienteData,
              };
            }
            return { ...equipo, ubicacion: ubicacionData };
          }
          return equipo;
        })
      );
      setEquipos(equiposEnriquecidos);
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

  const filteredEquipos = equipos
    .filter(
      (equipo) =>
        equipo.nombre_equipo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        equipo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.id_equipo - b.id_equipo);

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
