import { useState, useEffect } from "react";
import useFetch from "./useFetch";

export default function useAuditoria() {
  const { get } = useFetch("https://backend-edwin.onrender.com");

  const [auditorias, setAuditorias] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAuditorias = async (skip = 0, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await get(
        `/auditoria/?skip=${skip}&limit=${limit}`
      );
      if (fetchError) {
        setError(fetchError);
        setAuditorias([]);
        return null;
      }
      if (data) {
        setAuditorias(data);
        return data;
      }
      return null;
    } catch (err) {
      setError(err.message);
      setAuditorias([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditoriasPorTabla = async (nombreTabla) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await get(
        `/auditoria/tabla/${nombreTabla}`
      );
      if (fetchError) {
        setError(fetchError);
        setAuditorias([]);
        return null;
      }
      if (data) {
        setAuditorias(data);
        return data;
      }
      return null;
    } catch (err) {
      setError(err.message);
      setAuditorias([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditoriasPorUsuario = async (usuarioId) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await get(
        `/auditoria/usuario/${usuarioId}`
      );
      if (fetchError) {
        setError(fetchError);
        setAuditorias([]);
        return null;
      }
      if (data) {
        setAuditorias(data);
        return data;
      }
      return null;
    } catch (err) {
      setError(err.message);
      setAuditorias([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorialRegistro = async (tabla, idRegistro) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await get(
        `/auditoria/registro/${tabla}/${idRegistro}`
      );
      if (fetchError) {
        setError(fetchError);
        return null;
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditoriasPorOperacion = async (tipoOperacion) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await get(
        `/auditoria/operacion/${tipoOperacion}`
      );
      if (fetchError) {
        setError(fetchError);
        setAuditorias([]);
        return null;
      }
      if (data) {
        setAuditorias(data);
        return data;
      }
      return null;
    } catch (err) {
      setError(err.message);
      setAuditorias([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditoriasPorFecha = async (
    fechaInicio,
    fechaFin,
    skip = 0,
    limit = 100
  ) => {
    try {
      setLoading(true);
      setError(null);
      let endpoint = `/auditoria/fecha?skip=${skip}&limit=${limit}`;
      if (fechaInicio) endpoint += `&fecha_inicio=${fechaInicio}`;
      if (fechaFin) endpoint += `&fecha_fin=${fechaFin}`;

      const { data, error: fetchError } = await get(endpoint);
      if (fetchError) {
        setError(fetchError);
        setAuditorias([]);
        return null;
      }
      if (data) {
        setAuditorias(data);
        return data;
      }
      return null;
    } catch (err) {
      setError(err.message);
      setAuditorias([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticas = async (fechaInicio, fechaFin) => {
    try {
      setError(null);
      let endpoint = "/auditoria/estadisticas?skip=0&limit=100";
      if (fechaInicio) endpoint += `&fecha_inicio=${fechaInicio}`;
      if (fechaFin) endpoint += `&fecha_fin=${fechaFin}`;

      const { data, error: fetchError } = await get(endpoint);
      if (fetchError) {
        setError(fetchError);
        return null;
      }
      if (data) {
        setEstadisticas(data);
        return data;
      }
      return null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return {
    auditorias,
    estadisticas,
    loading,
    error,
    fetchAuditorias,
    fetchAuditoriasPorTabla,
    fetchAuditoriasPorUsuario,
    fetchHistorialRegistro,
    fetchAuditoriasPorOperacion,
    fetchAuditoriasPorFecha,
    fetchEstadisticas,
  };
}
