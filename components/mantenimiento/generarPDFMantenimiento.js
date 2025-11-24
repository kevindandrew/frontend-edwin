import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDFMantenimiento = (
  mantenimiento,
  equipo,
  tecnico,
  repuestos
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Función para agregar membretada
  const agregarMembretada = () => {
    // Logo (si existe)
    try {
      const img = new Image();
      img.src = "/logocompleto.png";
      doc.addImage(img, "PNG", 15, 10, 40, 15);
    } catch (e) {}

    // Información de la empresa
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Sistema de Gestión de Equipos Biomédicos", pageWidth - 15, 15, {
      align: "right",
    });
    doc.text("Reporte de Mantenimiento", pageWidth - 15, 20, {
      align: "right",
    });
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth - 15, 25, {
      align: "right",
    });

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 30, pageWidth - 15, 30);

    return 35;
  };

  yPos = agregarMembretada();

  // Título
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("REGISTRO DE MANTENIMIENTO", pageWidth / 2, yPos, {
    align: "center",
  });
  yPos += 10;

  // Función para agregar sección con dos columnas
  const agregarSeccionDosColumnas = (titulo, data, startY) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text(titulo, 15, startY);
    doc.setFont(undefined, "normal");

    const columnWidth = (pageWidth - 40) / 2;
    const leftX = 15;
    const rightX = leftX + columnWidth + 10;
    let currentY = startY + 7;

    const leftData = [];
    const rightData = [];

    Object.entries(data).forEach(([key, value], index) => {
      if (index % 2 === 0) {
        leftData.push([key, value]);
      } else {
        rightData.push([key, value]);
      }
    });

    const maxRows = Math.max(leftData.length, rightData.length);

    for (let i = 0; i < maxRows; i++) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);

      if (leftData[i]) {
        doc.text(leftData[i][0], leftX, currentY);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, "bold");
        doc.text(leftData[i][1], leftX, currentY + 4);
        doc.setFont(undefined, "normal");
      }

      if (rightData[i]) {
        doc.setTextColor(100, 100, 100);
        doc.text(rightData[i][0], rightX, currentY);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, "bold");
        doc.text(rightData[i][1], rightX, currentY + 4);
        doc.setFont(undefined, "normal");
      }

      currentY += 10;
    }

    return currentY + 5;
  };

  // Función para agregar sección de texto largo
  const agregarSeccionTextoLargo = (titulo, texto, startY) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text(titulo, 15, startY);
    doc.setFont(undefined, "normal");

    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const splitText = doc.splitTextToSize(texto || "N/A", pageWidth - 30);
    doc.text(splitText, 15, startY + 7);

    const textHeight = splitText.length * 4;
    return startY + textHeight + 10;
  };

  // Calcular estado
  const calcularEstado = () => {
    if (mantenimiento.fecha_realizacion) return "Completado";
    const fechaProgramada = new Date(mantenimiento.fecha_programada);
    const hoy = new Date();
    if (fechaProgramada < hoy) return "Pendiente";
    if (fechaProgramada.toDateString() === hoy.toDateString())
      return "En Progreso";
    return "Programado";
  };

  // Sección: Información del Mantenimiento
  yPos = agregarSeccionDosColumnas(
    "INFORMACIÓN DEL MANTENIMIENTO",
    {
      "ID Mantenimiento": `#${mantenimiento.id_mantenimiento}`,
      Tipo: String(mantenimiento.tipo_mantenimiento || "N/A"),
      Estado: calcularEstado(),
      "Fecha Programada": String(mantenimiento.fecha_programada || "N/A"),
      "Fecha Realización": String(
        mantenimiento.fecha_realizacion || "Pendiente"
      ),
      "Costo Total": `Bs. ${parseFloat(mantenimiento.costo_total || 0).toFixed(
        2
      )}`,
    },
    yPos
  );

  // Sección: Información del Equipo
  const ubicacionCompleta =
    equipo?.cliente?.nombre_institucion && equipo?.ubicacion
      ? `${equipo.cliente.nombre_institucion} - ${
          equipo.ubicacion.nombre_ubicacion || equipo.ubicacion.nombre || "N/A"
        }`
      : equipo?.cliente?.nombre_institucion || "N/A";

  yPos = agregarSeccionDosColumnas(
    "EQUIPO INTERVENIDO",
    {
      Nombre: String(equipo?.nombre_equipo || "N/A"),
      Serie: String(equipo?.numero_serie || "N/A"),
      Modelo: String(equipo?.modelo || "N/A"),
      Fabricante: String(equipo?.fabricante?.nombre || "N/A"),
      Ubicación: String(ubicacionCompleta),
      Estado: String(equipo?.estado || "N/A"),
    },
    yPos
  );

  // Sección: Técnico Responsable
  yPos = agregarSeccionDosColumnas(
    "TÉCNICO RESPONSABLE",
    {
      Nombre: String(tecnico?.nombre_completo || "N/A"),
    },
    yPos
  );

  // Sección: Descripción del Trabajo
  yPos = agregarSeccionTextoLargo(
    "DESCRIPCIÓN DEL TRABAJO",
    mantenimiento.descripcion_trabajo,
    yPos
  );

  // Tabla de Repuestos Utilizados
  if (repuestos && repuestos.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("REPUESTOS UTILIZADOS", 15, yPos);
    doc.setFont(undefined, "normal");
    yPos += 5;

    const repuestosData = repuestos.map((r) => [
      r.repuesto?.nombre || "N/A",
      r.cantidad_usada,
      r.repuesto?.stock || "N/A",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Repuesto", "Cantidad Usada", "Stock Disponible"]],
      body: repuestosData,
      theme: "striped",
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
      },
      margin: { left: 15, right: 15 },
    });

    yPos = doc.previousAutoTable
      ? doc.previousAutoTable.finalY + 10
      : yPos + 10;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("No se utilizaron repuestos en este mantenimiento", 15, yPos);
    yPos += 10;
  }

  // Pie de página
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Guardar PDF
  const nombreArchivo = `Mantenimiento_${mantenimiento.id_mantenimiento}_${
    equipo?.nombre_equipo || "Equipo"
  }.pdf`;
  doc.save(nombreArchivo);
};

export const previsualizarPDFMantenimiento = (
  mantenimiento,
  equipo,
  tecnico,
  repuestos
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Función para agregar membretada
  const agregarMembretada = () => {
    try {
      const img = new Image();
      img.src = "/logocompleto.png";
      doc.addImage(img, "PNG", 15, 10, 40, 15);
    } catch (e) {}

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Sistema de Gestión de Equipos Biomédicos", pageWidth - 15, 15, {
      align: "right",
    });
    doc.text("Reporte de Mantenimiento", pageWidth - 15, 20, {
      align: "right",
    });
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth - 15, 25, {
      align: "right",
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(15, 30, pageWidth - 15, 30);

    return 35;
  };

  yPos = agregarMembretada();

  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("REGISTRO DE MANTENIMIENTO", pageWidth / 2, yPos, {
    align: "center",
  });
  yPos += 10;

  const agregarSeccionDosColumnas = (titulo, data, startY) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text(titulo, 15, startY);
    doc.setFont(undefined, "normal");

    const columnWidth = (pageWidth - 40) / 2;
    const leftX = 15;
    const rightX = leftX + columnWidth + 10;
    let currentY = startY + 7;

    const leftData = [];
    const rightData = [];

    Object.entries(data).forEach(([key, value], index) => {
      if (index % 2 === 0) {
        leftData.push([key, value]);
      } else {
        rightData.push([key, value]);
      }
    });

    const maxRows = Math.max(leftData.length, rightData.length);

    for (let i = 0; i < maxRows; i++) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);

      if (leftData[i]) {
        doc.text(leftData[i][0], leftX, currentY);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, "bold");
        doc.text(leftData[i][1], leftX, currentY + 4);
        doc.setFont(undefined, "normal");
      }

      if (rightData[i]) {
        doc.setTextColor(100, 100, 100);
        doc.text(rightData[i][0], rightX, currentY);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, "bold");
        doc.text(rightData[i][1], rightX, currentY + 4);
        doc.setFont(undefined, "normal");
      }

      currentY += 10;
    }

    return currentY + 5;
  };

  const agregarSeccionTextoLargo = (titulo, texto, startY) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text(titulo, 15, startY);
    doc.setFont(undefined, "normal");

    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const splitText = doc.splitTextToSize(texto || "N/A", pageWidth - 30);
    doc.text(splitText, 15, startY + 7);

    const textHeight = splitText.length * 4;
    return startY + textHeight + 10;
  };

  const calcularEstado = () => {
    if (mantenimiento.fecha_realizacion) return "Completado";
    const fechaProgramada = new Date(mantenimiento.fecha_programada);
    const hoy = new Date();
    if (fechaProgramada < hoy) return "Pendiente";
    if (fechaProgramada.toDateString() === hoy.toDateString())
      return "En Progreso";
    return "Programado";
  };

  yPos = agregarSeccionDosColumnas(
    "INFORMACIÓN DEL MANTENIMIENTO",
    {
      "ID Mantenimiento": `#${mantenimiento.id_mantenimiento}`,
      Tipo: mantenimiento.tipo_mantenimiento,
      Estado: calcularEstado(),
      "Fecha Programada": mantenimiento.fecha_programada || "N/A",
      "Fecha Realización": mantenimiento.fecha_realizacion || "Pendiente",
      "Costo Total": `Bs. ${parseFloat(mantenimiento.costo_total || 0).toFixed(
        2
      )}`,
    },
    yPos
  );

  yPos = agregarSeccionDosColumnas(
    "EQUIPO INTERVENIDO",
    {
      Nombre: equipo?.nombre_equipo || "N/A",
      Serie: equipo?.numero_serie || "N/A",
      Modelo: equipo?.modelo || "N/A",
      Fabricante: equipo?.fabricante?.nombre || "N/A",
      Ubicación: equipo?.ubicacion?.nombre || "N/A",
      Estado: equipo?.estado || "N/A",
    },
    yPos
  );

  yPos = agregarSeccionDosColumnas(
    "TÉCNICO RESPONSABLE",
    {
      Nombre: tecnico?.nombre_completo || "N/A",
      Email: tecnico?.email || "N/A",
      Rol: tecnico?.rol || "N/A",
    },
    yPos
  );

  yPos = agregarSeccionTextoLargo(
    "DESCRIPCIÓN DEL TRABAJO",
    mantenimiento.descripcion_trabajo,
    yPos
  );

  if (repuestos && repuestos.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("REPUESTOS UTILIZADOS", 15, yPos);
    doc.setFont(undefined, "normal");
    yPos += 5;

    const repuestosData = repuestos.map((r) => [
      r.repuesto?.nombre || "N/A",
      r.cantidad_usada,
      r.repuesto?.stock || "N/A",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Repuesto", "Cantidad Usada", "Stock Disponible"]],
      body: repuestosData,
      theme: "striped",
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
      },
      margin: { left: 15, right: 15 },
    });
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Retornar data URI para previsualización
  return doc.output("datauristring");
};
