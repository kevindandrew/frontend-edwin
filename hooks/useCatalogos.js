import { useState, useEffect } from "react";
import useFetch from "./useFetch";

export default function useCatalogos() {
  const { get, post, put, del } = useFetch(
    "https://backend-edwin.onrender.com"
  );

  const [categorias, setCategorias] = useState([]);
  const [riesgos, setRiesgos] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [tecnologias, setTecnologias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCatalogos = async () => {
    setLoading(true);
    try {
      const [catRes, riesRes, fabRes, tecRes, ubicRes] = await Promise.all([
        get("/categorias-equipo/"),
        get("/niveles-riesgo/"),
        get("/fabricantes/"),
        get("/tipos-tecnologia/"),
        get("/ubicaciones/"),
      ]);

      if (catRes.data && !catRes.error) setCategorias(catRes.data);
      if (riesRes.data && !riesRes.error) setRiesgos(riesRes.data);
      if (fabRes.data && !fabRes.error) setFabricantes(fabRes.data);
      if (tecRes.data && !tecRes.error) setTecnologias(tecRes.data);
      if (ubicRes.data && !ubicRes.error) setUbicaciones(ubicRes.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogos();
  }, []);

  // CRUD Categorías
  const createCategoria = async (data) => {
    const { data: result, error } = await post("/categorias-equipo/", data);
    if (result && !error) {
      await fetchCatalogos();
      return result;
    }
    throw new Error(error || "Error al crear categoría");
  };

  const updateCategoria = async (id, data) => {
    const { data: result, error } = await put(
      `/categorias-equipo/${id}/`,
      data
    );
    if (result && !error) {
      await fetchCatalogos();
      return result;
    }
    throw new Error(error || "Error al actualizar categoría");
  };

  const deleteCategoria = async (id) => {
    const { error } = await del(`/categorias-equipo/${id}/`);
    if (!error) {
      await fetchCatalogos();
      return { success: true };
    }
    throw new Error(error || "Error al eliminar categoría");
  };

  // CRUD Fabricantes
  const fetchFabricanteById = async (id) => {
    const { data, error } = await get(`/fabricantes/${id}/`);
    if (data && !error) {
      return data;
    }
    return null;
  };

  const createFabricante = async (data) => {
    const { data: result, error } = await post("/fabricantes/", data);
    if (result && !error) {
      await fetchCatalogos();
      return result;
    }
    throw new Error(error || "Error al crear fabricante");
  };

  const updateFabricante = async (id, data) => {
    const { data: result, error } = await put(`/fabricantes/${id}/`, data);
    if (result && !error) {
      await fetchCatalogos();
      return result;
    }
    throw new Error(error || "Error al actualizar fabricante");
  };

  const deleteFabricante = async (id) => {
    const { error } = await del(`/fabricantes/${id}/`);
    if (!error) {
      await fetchCatalogos();
      return { success: true };
    }
    throw new Error(error || "Error al eliminar fabricante");
  };

  // CRUD Niveles de Riesgo
  const createRiesgo = async (data) => {
    const { data: result, error } = await post("/niveles-riesgo/", data);
    if (result && !error) {
      await fetchCatalogos();
      return result;
    }
    throw new Error(error || "Error al crear nivel de riesgo");
  };

  const updateRiesgo = async (id, data) => {
    const { data: result, error } = await put(`/niveles-riesgo/${id}/`, data);
    if (result && !error) {
      await fetchCatalogos();
      return result;
    }
    throw new Error(error || "Error al actualizar nivel de riesgo");
  };

  const deleteRiesgo = async (id) => {
    const { error } = await del(`/niveles-riesgo/${id}/`);
    if (!error) {
      await fetchCatalogos();
      return { success: true };
    }
    throw new Error(error || "Error al eliminar nivel de riesgo");
  };

  // CRUD Tipos de Tecnología
  const createTecnologia = async (data) => {
    const { data: result, error } = await post("/tipos-tecnologia/", data);
    if (result && !error) {
      await fetchCatalogos();
      return result;
    }
    throw new Error(error || "Error al crear tipo de tecnología");
  };

  const updateTecnologia = async (id, data) => {
    const { data: result, error } = await put(`/tipos-tecnologia/${id}/`, data);
    if (result && !error) {
      await fetchCatalogos();
      return result;
    }
    throw new Error(error || "Error al actualizar tipo de tecnología");
  };

  const deleteTecnologia = async (id) => {
    const { error } = await del(`/tipos-tecnologia/${id}/`);
    if (!error) {
      await fetchCatalogos();
      return { success: true };
    }
    throw new Error(error || "Error al eliminar tipo de tecnología");
  };

  return {
    categorias,
    riesgos,
    fabricantes,
    tecnologias,
    ubicaciones,
    loading,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    fetchFabricanteById,
    createFabricante,
    updateFabricante,
    deleteFabricante,
    createRiesgo,
    updateRiesgo,
    deleteRiesgo,
    createTecnologia,
    updateTecnologia,
    deleteTecnologia,
    refreshCatalogos: fetchCatalogos,
  };
}
