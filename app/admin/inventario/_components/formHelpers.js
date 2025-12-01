// Configuración de campos del formulario
export const INITIAL_FORM_DATA = {
  nombre_equipo: "",
  modelo: "",
  numero_serie: "",
  fecha_adquisicion: "",
  garantia: "",
  proveedor: "",
  estado: "Disponible",
  id_cliente: "",
  id_ubicacion: "",
  id_categoria: "",
  id_riesgo: "",
  id_fabricante: "",
  id_tecnologia: "",
  // Datos Técnicos
  voltaje_operacion: "",
  potencia: "",
  frecuencia: "",
  peso: "",
  dimensiones: "",
  vida_util: "",
  manual_operacion: "",
  observaciones: "",
};

export const ESTADOS = [
  "Disponible",
  "En Uso",
  "En Mantenimiento",
  "Fuera de Servicio",
];

export const NIVELES_RIESGO = [
  "Clase I",
  "Clase IIa",
  "Clase IIb",
  "Clase III",
];

export const FIELD_MAP = {
  categoria: "nombre_categoria",
  riesgo: "nivel",
  fabricante: "nombre_fabricante",
  tecnologia: "nombre_tecnologia",
};

export const ID_FIELD_MAP = {
  categoria: "id_categoria",
  riesgo: "id_riesgo",
  fabricante: "id_fabricante",
  tecnologia: "id_tecnologia",
};

// Helper para mapear datos del equipo al formulario
export const mapEquipoToFormData = (equipo) => {
  if (!equipo) return INITIAL_FORM_DATA;

  return Object.keys(INITIAL_FORM_DATA).reduce((acc, key) => {
    const value = equipo[key];
    acc[key] = value?.toString() || "";
    return acc;
  }, {});
};

// Helper para preparar el payload antes de enviar
export const preparePayload = (formData) => {
  const {
    nombre_equipo,
    modelo,
    numero_serie,
    fecha_adquisicion,
    garantia,
    proveedor,
    estado,
    id_ubicacion,
    id_categoria,
    id_riesgo,
    id_fabricante,
    id_tecnologia,
    voltaje_operacion,
    potencia,
    frecuencia,
    peso,
    dimensiones,
    vida_util,
    manual_operacion,
    observaciones,
  } = formData;

  return {
    nombre_equipo,
    modelo,
    numero_serie,
    fecha_adquisicion,
    garantia,
    proveedor,
    estado,
    id_ubicacion: id_ubicacion ? parseInt(id_ubicacion) : null,
    id_categoria: id_categoria ? parseInt(id_categoria) : null,
    id_riesgo: id_riesgo ? parseInt(id_riesgo) : null,
    id_fabricante: id_fabricante ? parseInt(id_fabricante) : null,
    id_tecnologia: id_tecnologia ? parseInt(id_tecnologia) : null,
    datos_tecnicos: {
      voltaje_operacion,
      potencia,
      frecuencia,
      peso,
      dimensiones,
      vida_util,
      manual_operacion,
      observaciones,
    },
  };
};

// Helper para obtener items del catálogo
export const getCatalogoItems = (catalogos, tipo) => {
  const catalogoMap = {
    categoria: catalogos?.categorias || [],
    fabricante: catalogos?.fabricantes || [],
    tecnologia: catalogos?.tecnologias || [],
  };
  return catalogoMap[tipo] || [];
};
