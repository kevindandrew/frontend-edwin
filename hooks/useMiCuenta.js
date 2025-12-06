import { useState, useEffect } from "react";
import useFetch from "./useFetch";

export default function useMiCuenta() {
  const { get, put } = useFetch("https://backend-edwin.onrender.com");
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMiCuenta = async () => {
    setLoading(true);
    setError(null);

    try {
      const usuarioGuardado = localStorage.getItem("user");
      if (!usuarioGuardado) {
        throw new Error("No hay usuario logueado");
      }

      const usuarioData = JSON.parse(usuarioGuardado);
      const response = await get(`/usuarios/${usuarioData.id_usuario}`);

      if (response.data && !response.error) {
        setUsuario(response.data);
      } else {
        setError(response.error || "Error al cargar usuario");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMiCuenta = async (datosActualizados) => {
    try {
      const usuarioGuardado = localStorage.getItem("user");
      if (!usuarioGuardado) {
        throw new Error("No hay usuario logueado");
      }

      const usuarioData = JSON.parse(usuarioGuardado);
      const response = await put(
        `/usuarios/${usuarioData.id_usuario}`,
        datosActualizados
      );

      if (response.data && !response.error) {
        setUsuario(response.data);
        // Actualizar localStorage con nueva información
        const updatedUser = {
          ...usuarioData,
          fullName: response.data.nombre_completo || usuarioData.fullName,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          message: response.error || "Error al actualizar",
        };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    fetchMiCuenta();
  }, []);

  return {
    usuario,
    loading,
    error,
    updateMiCuenta,
    refetch: fetchMiCuenta,
  };
}
