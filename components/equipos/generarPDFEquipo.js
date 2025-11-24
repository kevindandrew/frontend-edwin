import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Genera un PDF con toda la información del equipo médico
 * @param {Object} equipo - Datos completos del equipo
 * @param {Object} cliente - Información del cliente/institución
 * @param {Object} ubicacion - Información de la ubicación
 * @param {Object} catalogos - Catálogos para mostrar nombres en lugar de IDs
 */
export const generarPDFEquipo = async (
  equipo,
  cliente,
  ubicacion,
  catalogos
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // ==================== HOJA MEMBRETADA ====================

  // Logo en la parte superior centrado
  try {
    const logo = "/logocompleto.png";
    const logoWidth = 40;
    const logoHeight = 20;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logo, "PNG", logoX, 10, logoWidth, logoHeight);
  } catch (error) {}

  // Línea decorativa debajo del logo
  doc.setDrawColor(41, 128, 185); // Color azul
  doc.setLineWidth(0.5);
  doc.line(margin, 35, pageWidth - margin, 35);

  // ==================== TÍTULO Y FECHA ====================

  let yPos = 42;

  // Título principal
  doc.setFontSize(14);
  doc.setTextColor(33, 37, 41);
  doc.setFont("helvetica", "bold");
  doc.text("REGISTRO DE EQUIPO MÉDICO", pageWidth / 2, yPos, {
    align: "center",
  });

  yPos += 5;

  // Fecha de generación
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Fecha de generación: ${fechaActual}`, pageWidth / 2, yPos, {
    align: "center",
  });

  yPos += 7;

  // ==================== FUNCIÓN AUXILIAR PARA SECCIONES EN DOS COLUMNAS ====================

  const agregarSeccionDosColumnas = (titulo, datos) => {
    // Verificar si necesitamos nueva página
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }

    // Título de la sección
    doc.setFillColor(41, 128, 185);
    doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, margin + 3, yPos);
    yPos += 8;

    // Configuración de columnas
    const columnWidth = (pageWidth - 2 * margin - 10) / 2; // 10 es el espacio entre columnas
    const leftColumnX = margin + 3;
    const rightColumnX = margin + columnWidth + 10;
    let leftColumnY = yPos;
    let rightColumnY = yPos;
    let isLeftColumn = true;

    doc.setTextColor(33, 37, 41);
    doc.setFontSize(9);

    datos.forEach(({ label, valor }, index) => {
      const currentX = isLeftColumn ? leftColumnX : rightColumnX;
      let currentY = isLeftColumn ? leftColumnY : rightColumnY;

      // Verificar si necesitamos nueva página
      if (currentY > pageHeight - 25) {
        doc.addPage();
        yPos = margin;
        leftColumnY = yPos;
        rightColumnY = yPos;
        currentY = yPos;
      }

      // Label en negrita
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, currentX, currentY);
      currentY += 5;

      // Valor
      doc.setFont("helvetica", "normal");
      const valorTexto = valor || "N/A";
      const lineasValor = doc.splitTextToSize(valorTexto, columnWidth - 5);
      doc.text(lineasValor, currentX, currentY);
      currentY += lineasValor.length * 4 + 3;

      // Actualizar posición de la columna
      if (isLeftColumn) {
        leftColumnY = currentY;
      } else {
        rightColumnY = currentY;
      }

      // Alternar columna
      isLeftColumn = !isLeftColumn;
    });

    // Actualizar yPos al máximo de ambas columnas
    yPos = Math.max(leftColumnY, rightColumnY) + 5;
  };

  const agregarSeccionTextoLargo = (titulo, datos) => {
    // Verificar si necesitamos nueva página
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }

    // Título de la sección
    doc.setFillColor(41, 128, 185);
    doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, margin + 3, yPos);
    yPos += 10;

    // Contenido de la sección
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(9);

    datos.forEach(({ label, valor }) => {
      if (yPos > pageHeight - 25) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, margin + 3, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      const valorTexto = valor || "N/A";
      const maxWidth = pageWidth - 2 * margin - 6;
      const lineasValor = doc.splitTextToSize(valorTexto, maxWidth);
      doc.text(lineasValor, margin + 3, yPos);
      yPos += lineasValor.length * 4 + 5;
    });

    yPos += 3;
  };

  // ==================== OBTENER NOMBRES DE CATÁLOGOS ====================

  const obtenerNombreCatalogo = (tipo, id) => {
    if (!id) return "N/A";

    const mapas = {
      categoria: {
        items: catalogos?.categorias || [],
        key: "id_categoria",
        name: "nombre_categoria",
      },
      fabricante: {
        items: catalogos?.fabricantes || [],
        key: "id_fabricante",
        name: "nombre_fabricante",
      },
      tecnologia: {
        items: catalogos?.tecnologias || [],
        key: "id_tecnologia",
        name: "nombre_tecnologia",
      },
    };

    const mapa = mapas[tipo];
    if (!mapa) return id.toString();

    const item = mapa.items.find((i) => i[mapa.key] === id);
    return item ? item[mapa.name] : id.toString();
  };

  // ==================== SECCIONES DEL DOCUMENTO ====================

  // 1. DATOS DEL EQUIPO MÉDICO
  agregarSeccionDosColumnas("DATOS DEL EQUIPO MÉDICO", [
    { label: "Nombre del Equipo", valor: equipo.nombre_equipo },
    { label: "Modelo", valor: equipo.modelo },
    { label: "Número de Serie", valor: equipo.numero_serie },
    { label: "Fecha de Adquisición", valor: equipo.fecha_adquisicion },
    { label: "Garantía", valor: equipo.garantia },
    { label: "Proveedor", valor: equipo.proveedor },
    {
      label: "Tipo de Tecnología",
      valor: obtenerNombreCatalogo("tecnologia", equipo.id_tecnologia),
    },
    { label: "Estado", valor: equipo.estado },
  ]);

  // 2. UBICACIÓN
  agregarSeccionDosColumnas("UBICACIÓN", [
    { label: "Institución", valor: cliente?.nombre_institucion },
    { label: "Ubicación/Sala", valor: ubicacion?.nombre_ubicacion },
  ]);

  // 3. FABRICANTE
  agregarSeccionDosColumnas("FABRICANTE", [
    {
      label: "Fabricante",
      valor: obtenerNombreCatalogo("fabricante", equipo.id_fabricante),
    },
  ]);

  // 4. CLASIFICACIÓN
  agregarSeccionDosColumnas("CLASIFICACIÓN", [
    {
      label: "Categoría",
      valor: obtenerNombreCatalogo("categoria", equipo.id_categoria),
    },
    { label: "Nivel de Riesgo", valor: equipo.id_riesgo },
  ]);

  // 5. INFORMACIÓN ADICIONAL
  agregarSeccionTextoLargo("INFORMACIÓN ADICIONAL", [
    { label: "Descripción", valor: equipo.descripcion },
    { label: "Observaciones", valor: equipo.observaciones },
  ]);

  // 6. DATOS TÉCNICOS
  const dt = equipo.datos_tecnicos || {};
  agregarSeccionDosColumnas("DATOS TÉCNICOS", [
    { label: "Voltaje de Operación", valor: dt.voltaje_operacion },
    { label: "Potencia", valor: dt.potencia },
    { label: "Frecuencia", valor: dt.frecuencia },
    { label: "Peso", valor: dt.peso },
    { label: "Dimensiones", valor: dt.dimensiones },
    { label: "Vida Útil", valor: dt.vida_util },
  ]);

  // 7. DATOS TÉCNICOS ADICIONALES (Textos largos)
  if (dt.manual_operacion || dt.observaciones) {
    agregarSeccionTextoLargo("DATOS TÉCNICOS ADICIONALES", [
      { label: "Manual de Operación", valor: dt.manual_operacion },
      { label: "Observaciones Técnicas", valor: dt.observaciones },
    ]);
  }

  // ==================== PIE DE PÁGINA ====================

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Línea superior del pie
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    // Texto del pie
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Registro de Equipo Médico - Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // ==================== GUARDAR PDF ====================

  const nombreArchivo = `Equipo_${
    equipo.nombre_equipo?.replace(/\s+/g, "_") || "Medico"
  }_${new Date().getTime()}.pdf`;
  doc.save(nombreArchivo);
};
