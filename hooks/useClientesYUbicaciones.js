import { useState, useEffect } from "react";
import useFetch from "./useFetch";

export default function useClientesYUbicaciones() {
  const { get } = useFetch("https://backend-edwin.onrender.com");

  const [clientes, setClientes] = useState([]);
  const [ubicacionesPorCliente, setUbicacionesPorCliente] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data, error } = await get("/clientes/?skip=0&limit=100");
      if (data && !error) {
        setClientes(data.sort((a, b) => a.id_cliente - b.id_cliente));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchUbicacionesPorCliente = async (clienteId) => {
    if (ubicacionesPorCliente[clienteId]) {
      return ubicacionesPorCliente[clienteId];
    }

    try {
      const { data, error } = await get(`/ubicaciones/cliente/${clienteId}`);
      if (data && !error) {
        setUbicacionesPorCliente((prev) => ({
          ...prev,
          [clienteId]: data.sort((a, b) => a.id_ubicacion - b.id_ubicacion),
        }));
        return data;
      }
    } catch (error) {}
    return [];
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    ubicacionesPorCliente,
    loading,
    fetchUbicacionesPorCliente,
  };
}
