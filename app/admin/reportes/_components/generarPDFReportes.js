const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
  "Enero (Prox)",
  "Febrero (Prox)",
];

// Función auxiliar para cargar librerías
const loadPDFLibs = async () => {
  const jsPDF = (await import("jspdf")).default;
  const autoTable = (await import("jspdf-autotable")).default;
  return { jsPDF, autoTable };
};

// Función auxiliar para agregar encabezado
const agregarEncabezado = async (doc, titulo) => {
  // Agregar logo
  try {
    const logo = new Image();
    logo.src = "/logocompleto.png";

    await new Promise((resolve, reject) => {
      logo.onload = () => {
        // Logo en la esquina superior derecha
        doc.addImage(logo, "PNG", 150, 10, 40, 15);
        resolve();
      };
      logo.onerror = () => resolve(); // Continuar si falla la carga del logo
    });
  } catch (error) {}

  // Título
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, 14, 20);

  // Información de empresa
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("MeidTechs - Sistema de Gestión de Equipos Biomédicos", 14, 27);

  // Fecha y hora
  doc.setFontSize(9);
  doc.text(
    `Fecha: ${new Date().toLocaleDateString(
      "es-ES"
    )}  Hora: ${new Date().toLocaleTimeString("es-ES")}`,
    14,
    32
  );

  // Línea separadora
  doc.setLineWidth(0.5);
  doc.line(14, 36, 196, 36);
};

// Función auxiliar para agregar pie de página
const agregarPiePagina = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
};

// PDF de Dashboard General
export const generarPDFDashboard = async (dashboard) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, "REPORTE DE DASHBOARD GENERAL");

  let yPos = 45;

  // Sección de Resumen
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen General", 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const resumenData = [
    ["Total de Equipos", String(dashboard.total_equipos || 0)],
    ["Ventas del Mes Actual", String(dashboard.ventas_mes_actual || 0)],
    [
      "Mantenimientos del Mes",
      String(dashboard.mantenimientos_mes_actual || 0),
    ],
    ["Repuestos con Stock Bajo", String(dashboard.repuestos_stock_bajo || 0)],
    ["Ingresos del Mes", `Bs. ${(dashboard.ingresos_mes || 0).toFixed(2)}`],
    ["Egresos del Mes", `Bs. ${(dashboard.egresos_mes || 0).toFixed(2)}`],
    ["Balance del Mes", `Bs. ${(dashboard.balance_mes || 0).toFixed(2)}`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Indicador", "Valor"]],
    body: resumenData,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // Equipos por Estado
  if (dashboard.equipos_por_estado && dashboard.equipos_por_estado.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Equipos por Estado", 14, yPos);
    yPos += 8;

    const estadoData = dashboard.equipos_por_estado.map((item) => [
      item.estado,
      String(item.total),
      `${((item.total / dashboard.total_equipos) * 100).toFixed(1)}%`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Estado", "Cantidad", "Porcentaje"]],
      body: estadoData,
      theme: "grid",
      headStyles: { fillColor: [52, 152, 219] },
    });
  }

  agregarPiePagina(doc);
  doc.save(`Dashboard_${new Date().toISOString().split("T")[0]}.pdf`);
};

// PDF de Equipos por Categoría
export const generarPDFEquipos = async (equiposPorCategoria, dashboard) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, "REPORTE DE EQUIPOS POR CATEGORÍA");

  let yPos = 45;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total de Equipos: ${dashboard?.total_equipos || 0}`, 14, yPos);
  yPos += 10;

  if (equiposPorCategoria && equiposPorCategoria.length > 0) {
    const equiposData = equiposPorCategoria.map((item) => [
      item.categoria,
      String(item.total),
      `${
        dashboard?.total_equipos > 0
          ? ((item.total / dashboard.total_equipos) * 100).toFixed(1)
          : 0
      }%`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Categoría", "Cantidad", "Porcentaje"]],
      body: equiposData,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 40, halign: "center" },
        2: { cellWidth: 40, halign: "center" },
      },
    });
  } else {
    doc.text("No hay datos disponibles", 14, yPos);
  }

  agregarPiePagina(doc);
  doc.save(
    `Equipos_por_Categoria_${new Date().toISOString().split("T")[0]}.pdf`
  );
};

// PDF de Ventas por Mes
export const generarPDFVentas = async (ventasPorMes, año) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, `REPORTE DE VENTAS - AÑO ${año}`);

  let yPos = 45;

  if (ventasPorMes && ventasPorMes.length > 0) {
    const totalVentas = ventasPorMes.reduce(
      (sum, v) => sum + v.cantidad_ventas,
      0
    );
    const totalMonto = ventasPorMes.reduce((sum, v) => sum + v.total_ventas, 0);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total de Ventas: ${totalVentas}`, 14, yPos);
    yPos += 6;
    doc.text(`Monto Total: Bs. ${totalMonto.toFixed(2)}`, 14, yPos);
    yPos += 10;

    const ventasData = ventasPorMes.map((item) => [
      MESES[item.mes - 1],
      String(item.cantidad_ventas),
      `Bs. ${item.total_ventas.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Mes", "Cantidad de Ventas", "Monto Total"]],
      body: ventasData,
      theme: "striped",
      headStyles: { fillColor: [46, 204, 113] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60, halign: "center" },
        2: { cellWidth: 60, halign: "right" },
      },
    });

    // Agregar promedio
    yPos = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Promedio mensual: ${(totalVentas / ventasPorMes.length).toFixed(
        1
      )} ventas`,
      14,
      yPos
    );
    yPos += 5;
    doc.text(
      `Promedio de ingresos: Bs. ${(totalMonto / ventasPorMes.length).toFixed(
        2
      )}`,
      14,
      yPos
    );
  } else {
    doc.text("No hay ventas registradas para este año", 14, yPos);
  }

  agregarPiePagina(doc);
  doc.save(`Ventas_${año}_${new Date().toISOString().split("T")[0]}.pdf`);
};

// PDF de Compras por Mes
export const generarPDFCompras = async (comprasPorMes, año) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, `REPORTE DE COMPRAS - AÑO ${año}`);

  let yPos = 45;

  if (comprasPorMes && comprasPorMes.length > 0) {
    const totalCompras = comprasPorMes.reduce(
      (sum, c) => sum + c.cantidad_compras,
      0
    );
    const totalMonto = comprasPorMes.reduce(
      (sum, c) => sum + c.total_compras,
      0
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total de Compras: ${totalCompras}`, 14, yPos);
    yPos += 6;
    doc.text(`Monto Total: Bs. ${totalMonto.toFixed(2)}`, 14, yPos);
    yPos += 10;

    const comprasData = comprasPorMes.map((item) => [
      MESES[item.mes - 1],
      String(item.cantidad_compras),
      `Bs. ${item.total_compras.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Mes", "Cantidad de Compras", "Monto Total"]],
      body: comprasData,
      theme: "striped",
      headStyles: { fillColor: [230, 126, 34] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60, halign: "center" },
        2: { cellWidth: 60, halign: "right" },
      },
    });

    // Agregar promedio
    yPos = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Promedio mensual: ${(totalCompras / comprasPorMes.length).toFixed(
        1
      )} compras`,
      14,
      yPos
    );
    yPos += 5;
    doc.text(
      `Promedio de egresos: Bs. ${(totalMonto / comprasPorMes.length).toFixed(
        2
      )}`,
      14,
      yPos
    );
  } else {
    doc.text("No hay compras registradas para este año", 14, yPos);
  }

  agregarPiePagina(doc);
  doc.save(`Compras_${año}_${new Date().toISOString().split("T")[0]}.pdf`);
};

// PDF de Repuestos Más Usados
export const generarPDFRepuestos = async (
  repuestosMasUsados,
  repuestosStockBajo
) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, "REPORTE DE REPUESTOS");

  let yPos = 45;

  // Sección de Stock Bajo
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Stock Bajo", 14, yPos);
  yPos += 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Repuestos con stock bajo: ${repuestosStockBajo || 0}`, 14, yPos);
  yPos += 10;

  // Sección de Repuestos Más Usados
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Repuestos Más Usados", 14, yPos);
  yPos += 8;

  if (repuestosMasUsados && repuestosMasUsados.length > 0) {
    const repuestosData = repuestosMasUsados.map((item, index) => [
      String(index + 1),
      item.nombre_repuesto,
      String(item.total_usado),
      String(item.veces_usado),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["#", "Repuesto", "Cantidad Usada", "Veces Usado"]],
      body: repuestosData,
      theme: "striped",
      headStyles: { fillColor: [155, 89, 182] },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 100 },
        2: { cellWidth: 35, halign: "center" },
        3: { cellWidth: 35, halign: "center" },
      },
    });
  } else {
    doc.text("No hay datos de uso de repuestos disponibles", 14, yPos);
  }

  agregarPiePagina(doc);
  doc.save(`Repuestos_${new Date().toISOString().split("T")[0]}.pdf`);
};

// PDF de Top Clientes
export const generarPDFClientes = async (topClientes) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, "REPORTE DE TOP CLIENTES");

  let yPos = 45;

  if (topClientes && topClientes.length > 0) {
    const totalVentas = topClientes.reduce((sum, c) => sum + c.total_ventas, 0);
    const totalMonto = topClientes.reduce((sum, c) => sum + c.monto_total, 0);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total de Clientes: ${topClientes.length}`, 14, yPos);
    yPos += 6;
    doc.text(`Total Ventas Acumuladas: ${totalVentas}`, 14, yPos);
    yPos += 6;
    doc.text(`Monto Total: Bs. ${totalMonto.toFixed(2)}`, 14, yPos);
    yPos += 10;

    const clientesData = topClientes.map((item, index) => [
      String(index + 1),
      item.nombre_cliente,
      String(item.total_ventas),
      `Bs. ${item.monto_total.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Ranking", "Cliente", "Cantidad de Ventas", "Monto Total"]],
      body: clientesData,
      theme: "striped",
      headStyles: { fillColor: [52, 73, 94] },
      columnStyles: {
        0: { cellWidth: 25, halign: "center" },
        1: { cellWidth: 80 },
        2: { cellWidth: 40, halign: "center" },
        3: { cellWidth: 40, halign: "right" },
      },
    });
  } else {
    doc.text("No hay datos de clientes disponibles", 14, yPos);
  }

  agregarPiePagina(doc);
  doc.save(`Top_Clientes_${new Date().toISOString().split("T")[0]}.pdf`);
};

// PDF de Proyecciones de Mantenimiento
export const generarPDFProyecciones = async (proyecciones) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, "REPORTE DE PROYECCIONES DE MANTENIMIENTO");

  let yPos = 45;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total de Mantenimientos Programados: ${proyecciones.length}`,
    14,
    yPos
  );
  yPos += 10;

  if (proyecciones && proyecciones.length > 0) {
    const data = proyecciones.map((m) => [
      m.fecha_programada,
      m.equipo_nombre || "N/A",
      m.tipo_mantenimiento,
      m.tecnico_nombre || "Sin asignar",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Fecha", "Equipo", "Tipo", "Técnico"]],
      body: data,
      theme: "striped",
      headStyles: { fillColor: [243, 156, 18] },
    });
  } else {
    doc.text("No hay mantenimientos futuros programados", 14, yPos);
  }

  agregarPiePagina(doc);
  doc.save(
    `Proyecciones_Mantenimiento_${new Date().toISOString().split("T")[0]}.pdf`
  );
};

// PDF de Equipos Críticos
export const generarPDFEquiposCriticos = async (equiposCriticos) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, "REPORTE DE EQUIPOS CRÍTICOS");

  let yPos = 45;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total de Equipos Críticos: ${equiposCriticos.length}`, 14, yPos);
  yPos += 10;

  if (equiposCriticos && equiposCriticos.length > 0) {
    const data = equiposCriticos.map((e) => [
      e.nombre_equipo,
      e.marca || "N/A",
      e.modelo || "N/A",
      e.estado,
      e.ubicacion || "N/A",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Equipo", "Marca", "Modelo", "Estado", "Ubicación"]],
      body: data,
      theme: "striped",
      headStyles: { fillColor: [192, 57, 43] },
    });
  } else {
    doc.text("No se encontraron equipos críticos", 14, yPos);
  }

  agregarPiePagina(doc);
  doc.save(`Equipos_Criticos_${new Date().toISOString().split("T")[0]}.pdf`);
};

// PDF de Lista de Usuarios
export const generarPDFUsuarios = async (usuarios) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, "REPORTE DE USUARIOS DEL SISTEMA");

  let yPos = 45;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total de Usuarios: ${usuarios.length}`, 14, yPos);
  yPos += 10;

  if (usuarios && usuarios.length > 0) {
    const data = usuarios.map((u) => [
      u.nombre_completo,
      u.username,
      u.rol?.nombre_rol || "N/A",
      u.email || "N/A",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Nombre Completo", "Usuario", "Rol", "Email"]],
      body: data,
      theme: "striped",
      headStyles: { fillColor: [44, 62, 80] },
    });
  } else {
    doc.text("No hay usuarios registrados", 14, yPos);
  }

  agregarPiePagina(doc);
  doc.save(`Lista_Usuarios_${new Date().toISOString().split("T")[0]}.pdf`);
};

// PDF de Auditoría
export const generarPDFAuditoria = async (auditorias, usuarios = []) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, "REPORTE DE AUDITORÍA DEL SISTEMA");

  let yPos = 45;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total de Registros: ${auditorias.length}`, 14, yPos);
  yPos += 10;

  if (auditorias && auditorias.length > 0) {
    const data = auditorias.map((a) => [
      new Date(a.fecha_operacion).toLocaleString(),
      a.usuario?.nombre_completo ||
        (usuarios &&
          usuarios.find((u) => u.id_usuario === a.id_usuario)
            ?.nombre_completo) ||
        (a.id_usuario ? a.id_usuario : "Sistema"),
      a.operacion,
      a.tabla,
      a.detalles ? JSON.stringify(a.detalles).substring(0, 50) + "..." : "N/A",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Fecha", "Usuario", "Operación", "Tabla", "Detalles"]],
      body: data,
      theme: "striped",
      headStyles: { fillColor: [52, 73, 94] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 60 },
      },
      styles: { fontSize: 8 },
    });
  } else {
    doc.text("No hay registros de auditoría para mostrar", 14, yPos);
  }

  agregarPiePagina(doc);
  doc.save(`Auditoria_${new Date().toISOString().split("T")[0]}.pdf`);
};

// PDF de Lista de Compras
export const generarPDFListaCompras = async (compras) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();
  await agregarEncabezado(doc, "REPORTE DE COMPRAS");

  let yPos = 45;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total de Compras: ${compras.length}`, 14, yPos);
  yPos += 10;

  if (compras && compras.length > 0) {
    const data = compras.map((c) => [
      c.id_compra,
      c.fecha_solicitud,
      c.fecha_aprobacion || "-",
      `Bs. ${parseFloat(c.monto_total || 0).toFixed(2)}`,
      c.estado_compra,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [
        ["ID", "Fecha Solicitud", "Fecha Aprobación", "Monto Total", "Estado"],
      ],
      body: data,
      theme: "striped",
      headStyles: { fillColor: [52, 152, 219] },
    });
  } else {
    doc.text("No hay compras registradas", 14, yPos);
  }

  agregarPiePagina(doc);
  doc.save(`Lista_Compras_${new Date().toISOString().split("T")[0]}.pdf`);
};

// PDF Completo con todos los reportes
export const generarPDFCompleto = async (
  dashboard,
  equiposPorCategoria,
  ventasPorMes,
  comprasPorMes,
  repuestosMasUsados,
  topClientes,
  año,
  proyecciones = [],
  equiposCriticos = [],
  usuarios = []
) => {
  const { jsPDF, autoTable } = await loadPDFLibs();
  const doc = new jsPDF();

  // Página 1: Dashboard
  await agregarEncabezado(doc, "REPORTE COMPLETO DEL SISTEMA");

  let yPos = 45;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("1. Resumen General", 14, yPos);
  yPos += 8;

  const resumenData = [
    ["Total de Equipos", String(dashboard?.total_equipos || 0)],
    ["Ventas del Mes", String(dashboard?.ventas_mes_actual || 0)],
    ["Mantenimientos", String(dashboard?.mantenimientos_mes_actual || 0)],
    ["Balance del Mes", `Bs. ${(dashboard?.balance_mes || 0).toFixed(2)}`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Indicador", "Valor"]],
    body: resumenData,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Nueva página: Equipos
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("2. Equipos por Categoría", 14, yPos);
  yPos += 8;

  if (equiposPorCategoria && equiposPorCategoria.length > 0) {
    const equiposData = equiposPorCategoria.map((item) => [
      item.categoria,
      String(item.total),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Categoría", "Cantidad"]],
      body: equiposData,
      theme: "grid",
    });
  }

  // Nueva página: Ventas
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`3. Ventas - Año ${año}`, 14, yPos);
  yPos += 8;

  if (ventasPorMes && ventasPorMes.length > 0) {
    const ventasData = ventasPorMes.map((item) => [
      MESES[item.mes - 1],
      String(item.cantidad_ventas),
      `Bs. ${item.total_ventas.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Mes", "Cantidad", "Monto"]],
      body: ventasData,
      theme: "grid",
    });
  }

  // Nueva página: Top Clientes
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("4. Top Clientes", 14, yPos);
  yPos += 8;

  if (topClientes && topClientes.length > 0) {
    const clientesData = topClientes.map((item, idx) => [
      String(idx + 1),
      item.nombre_cliente,
      `Bs. ${item.monto_total.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["#", "Cliente", "Monto Total"]],
      body: clientesData,
      theme: "grid",
    });
  }

  // Nueva página: Proyecciones
  if (proyecciones.length > 0) {
    doc.addPage();
    yPos = 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("5. Proyecciones de Mantenimiento", 14, yPos);
    yPos += 8;

    const proyeccionesData = proyecciones.map((m) => [
      m.fecha_programada,
      m.equipo_nombre || "N/A",
      m.tipo_mantenimiento,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Fecha", "Equipo", "Tipo"]],
      body: proyeccionesData,
      theme: "grid",
    });
  }

  // Nueva página: Equipos Críticos
  if (equiposCriticos.length > 0) {
    doc.addPage();
    yPos = 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("6. Equipos Críticos", 14, yPos);
    yPos += 8;

    const criticosData = equiposCriticos.map((e) => [
      e.nombre_equipo,
      e.estado,
      e.ubicacion || "N/A",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Equipo", "Estado", "Ubicación"]],
      body: criticosData,
      theme: "grid",
      headStyles: { fillColor: [192, 57, 43] },
    });
  }

  // Nueva página: Usuarios
  if (usuarios.length > 0) {
    doc.addPage();
    yPos = 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("7. Usuarios del Sistema", 14, yPos);
    yPos += 8;

    const usuariosData = usuarios.map((u) => [
      u.nombre_completo,
      u.username,
      u.rol?.nombre_rol || "N/A",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Nombre", "Usuario", "Rol"]],
      body: usuariosData,
      theme: "grid",
    });
  }

  agregarPiePagina(doc);
  doc.save(`Reporte_Completo_${new Date().toISOString().split("T")[0]}.pdf`);
};
