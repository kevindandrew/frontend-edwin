import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export const useUsuarios = () => {
  const { get, post, put, del, loading } = useFetch(
    "https://backend-edwin.onrender.com"
  );
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsuarios = async () => {
    const { data } = await get("/usuarios/?skip=0&limit=100");
    if (data) {
      setUsuarios(data);
    }
  };

  const fetchRoles = async () => {
    const { data } = await get("/roles/?skip=0&limit=100");
    if (data) {
      setRoles(data);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const createUsuario = async (usuario) => {
    const { data, error } = await post("/usuarios/", usuario);
    if (data && !error) {
      await fetchUsuarios();
      return { success: true };
    }
    return { success: false, error };
  };

  const updateUsuario = async (id, usuario) => {
    const { data, error } = await put(`/usuarios/${id}`, usuario);
    if (data && !error) {
      await fetchUsuarios();
      return { success: true };
    }
    return { success: false, error };
  };

  const deleteUsuario = async (id) => {
    const { error } = await del(`/usuarios/${id}`);
    if (!error) {
      await fetchUsuarios();
      return { success: true };
    }
    return { success: false, error };
  };

  const searchUsuario = async (username) => {
    if (!username) {
      await fetchUsuarios();
      return;
    }
    const { data } = await get(`/usuarios/username/${username}`);
    if (data) {
      setUsuarios([data]);
    }
  };

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre_completo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      usuario.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    usuarios: filteredUsuarios,
    roles,
    loading,
    searchTerm,
    setSearchTerm,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    searchUsuario,
    refreshUsuarios: fetchUsuarios,
  };
};
