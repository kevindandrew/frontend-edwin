import { useState, useEffect } from "react";
import useFetch from "./useFetch";

export default function useClientes() {
  const { get, post, put, del } = useFetch(
    "https://backend-edwin.onrender.com"
  );
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClientes = async () => {
    setLoading(true);
    const { data, error } = await get("/clientes/");
    if (data && !error) {
      setClientes(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const createCliente = async (cliente) => {
    const { data, error } = await post("/clientes/", cliente);
    if (data && !error) {
      await fetchClientes();
      return { success: true };
    }
    return { success: false, error };
  };

  const updateCliente = async (id, cliente) => {
    const { data, error } = await put(`/clientes/${id}`, cliente);
    if (data && !error) {
      await fetchClientes();
      return { success: true };
    }
    return { success: false, error };
  };

  const deleteCliente = async (id) => {
    const { error } = await del(`/clientes/${id}`);
    if (!error) {
      await fetchClientes();
      return { success: true };
    }
    return { success: false, error };
  };

  const searchClienteByNit = async (nit) => {
    if (!nit) {
      await fetchClientes();
      return;
    }
    const { data } = await get(`/clientes/buscar/nit/${nit}`);
    if (data) {
      setClientes([data]);
    }
  };

  const fetchClienteById = async (id) => {
    const { data, error } = await get(`/clientes/${id}`);
    if (data && !error) {
      return data;
    }
    return null;
  };

  const filteredClientes = clientes
    .filter(
      (cliente) =>
        cliente.nombre_institucion
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        cliente.nit_ruc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.persona_contacto &&
          cliente.persona_contacto
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.id_cliente - b.id_cliente);

  return {
    clientes: filteredClientes,
    loading,
    searchTerm,
    setSearchTerm,
    createCliente,
    updateCliente,
    deleteCliente,
    searchClienteByNit,
    fetchClienteById,
    refreshClientes: fetchClientes,
  };
}
