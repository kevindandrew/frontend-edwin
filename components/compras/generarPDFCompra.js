import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDFCompra = (compra, detalles) => {
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
    doc.text("Orden de Compra", pageWidth - 15, 20, {
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
  doc.text("ORDEN DE COMPRA", pageWidth / 2, yPos, {
    align: "center",
  });
  yPos += 10;

  // Información de la Compra
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("INFORMACIÓN DE LA COMPRA", 15, yPos);
  doc.setFont(undefined, "normal");
  yPos += 7;

  const infoCompra = [
    ["ID Compra", `#${compra.id_compra}`],
    ["Fecha Solicitud", String(compra.fecha_solicitud || "N/A")],
    ["Fecha Aprobación", String(compra.fecha_aprobacion || "Pendiente")],
    ["Estado", String(compra.estado_compra || "N/A")],
    ["Monto Total", `Bs. ${parseFloat(compra.monto_total || 0).toFixed(2)}`],
  ];

  const columnWidth = (pageWidth - 40) / 2;
  const leftX = 15;
  const rightX = leftX + columnWidth + 10;
  let currentY = yPos;

  for (let i = 0; i < infoCompra.length; i++) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);

    if (i % 2 === 0) {
      // Columna izquierda
      doc.text(infoCompra[i][0], leftX, currentY);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text(String(infoCompra[i][1]), leftX, currentY + 4);
      doc.setFont(undefined, "normal");
    } else {
      // Columna derecha
      doc.text(infoCompra[i][0], rightX, currentY);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text(String(infoCompra[i][1]), rightX, currentY + 4);
      doc.setFont(undefined, "normal");
      currentY += 10;
    }
  }

  yPos = currentY + 10;

  // Tabla de Detalles
  if (detalles && detalles.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("ITEMS DE COMPRA", 15, yPos);
    doc.setFont(undefined, "normal");
    yPos += 5;

    const detallesData = detalles.map((d) => [
      String(d.equipo?.nombre_equipo || d.repuesto?.nombre || "N/A"),
      d.id_equipo ? "Equipo" : "Repuesto",
      d.cantidad,
      `Bs. ${parseFloat(d.precio_unitario || 0).toFixed(2)}`,
      `Bs. ${(d.cantidad * parseFloat(d.precio_unitario || 0)).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Item", "Tipo", "Cantidad", "Precio Unit.", "Subtotal"]],
      body: detallesData,
      theme: "striped",
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 30, halign: "right" },
      },
    });

    yPos = doc.lastAutoTable.finalY + 10;
  }

  // Total Final
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0);
  const totalText = `TOTAL: Bs. ${parseFloat(compra.monto_total || 0).toFixed(
    2
  )}`;
  doc.text(totalText, pageWidth - 15, yPos, { align: "right" });

  // Pie de página
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont(undefined, "normal");
  doc.text(
    "Documento generado electrónicamente - Sistema de Gestión de Equipos Biomédicos",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Descargar
  doc.save(
    `Compra_${compra.id_compra}_${new Date().toISOString().split("T")[0]}.pdf`
  );
};
