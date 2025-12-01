import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";

export default function useProveedores() {
  const { get, post, put, del } = useFetch(
    "https://backend-edwin.onrender.com"
  );
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProveedores = async () => {
    setLoading(true);
    try {
      // Asumiendo que existe este endpoint, si no, se deberá ajustar
      const { data, error } = await get("/proveedores/");
      if (data && !error) {
        setProveedores(data);
      }
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    } finally {
      setLoading(false);
    }
  };

  const crearProveedor = async (proveedor) => {
    try {
      const { data, error } = await post("/proveedores/", proveedor);
      if (data && !error) {
        await fetchProveedores();
        return { success: true, data };
      }
      return { success: false, error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const actualizarProveedor = async (id, proveedor) => {
    try {
      const { data, error } = await put(`/proveedores/${id}`, proveedor);
      if (data && !error) {
        await fetchProveedores();
        return { success: true, data };
      }
      return { success: false, error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const eliminarProveedor = async (id) => {
    try {
      const { error } = await del(`/proveedores/${id}`);
      if (!error) {
        await fetchProveedores();
        return { success: true };
      }
      return { success: false, error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return {
    proveedores,
    loading,
    fetchProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
  };
}
