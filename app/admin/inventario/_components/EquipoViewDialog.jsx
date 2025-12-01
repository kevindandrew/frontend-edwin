import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { FileDown } from "lucide-react";
import { generarPDFEquipo } from "./generarPDFEquipo";

const estadoColors = {
  Activo: "default",
  Inactivo: "secondary",
  "En Mantenimiento": "outline",
  "Fuera de Servicio": "destructive",
};

export default function EquipoViewDialog({
  open,
  onOpenChange,
  equipo,
  catalogos,
}) {
  if (!equipo) return null;

  const categoria = catalogos.categorias.find(
    (c) => c.id_categoria === equipo.id_categoria
  );
  const riesgo = catalogos.riesgos?.find(
    (r) => r.id_riesgo === equipo.id_riesgo
  );
  const fabricante = catalogos.fabricantes.find(
    (f) => f.id_fabricante === equipo.id_fabricante
  );
  const tecnologia = catalogos.tecnologias.find(
    (t) => t.id_tecnologia === equipo.id_tecnologia
  );
  const ubicacion = catalogos.ubicaciones?.find(
    (u) => u.id_ubicacion === equipo.id_ubicacion
  );

  // Buscar el cliente asociado a la ubicación
  const cliente = catalogos.clientes?.find(
    (c) => ubicacion && c.id_cliente === ubicacion.id_cliente
  );

  const handleGenerarPDF = () => {
    generarPDFEquipo(equipo, cliente, ubicacion, catalogos);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        style={{ width: "1400px", maxWidth: "95vw" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalles del Equipo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Datos del Equipo Médico */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">
              Datos del Equipo Médico
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">
                  Nombre del Equipo
                </Label>
                <p className="font-medium">{equipo.nombre_equipo || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Modelo</Label>
                <p className="font-medium">{equipo.modelo || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Número de Serie</Label>
                <p className="font-medium">{equipo.numero_serie || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Fecha de Adquisición
                </Label>
                <p className="font-medium">
                  {equipo.fecha_adquisicion || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Garantía</Label>
                <p className="font-medium">{equipo.garantia || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Proveedor</Label>
                <p className="font-medium">{equipo.proveedor || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Tipo de Tecnología
                </Label>
                <p className="font-medium">
                  {tecnologia?.nombre_tecnologia || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Estado</Label>
                <div className="mt-1">
                  <Badge variant={estadoColors[equipo.estado] || "default"}>
                    {equipo.estado}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Institución/Sala
                </Label>
                <p className="font-medium">
                  {cliente?.nombre_institucion && ubicacion?.nombre_ubicacion
                    ? `${cliente.nombre_institucion} - ${ubicacion.nombre_ubicacion}`
                    : ubicacion?.nombre_ubicacion || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Fabricante */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">
              Fabricante
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Nombre</Label>
                <p className="font-medium">
                  {fabricante?.nombre_fabricante || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">País de Origen</Label>
                <p className="font-medium">
                  {fabricante?.pais_origen || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Contacto</Label>
                <p className="font-medium">{fabricante?.contacto || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Teléfono</Label>
                <p className="font-medium">{fabricante?.telefono || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Correo</Label>
                <p className="font-medium">{fabricante?.correo || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Sitio Web</Label>
                <p className="font-medium">
                  {fabricante?.sitio_web ? (
                    <a
                      href={fabricante.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {fabricante.sitio_web}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Clasificación */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">
              Clasificación
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Categoría</Label>
                <p className="font-medium">
                  {categoria?.nombre_categoria || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Nivel de Riesgo</Label>
                <p className="font-medium">{equipo.id_riesgo || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">
              Información Adicional
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Descripción</Label>
                <p className="font-medium">{equipo.descripcion || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Observaciones</Label>
                <p className="font-medium">{equipo.observaciones || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Datos Técnicos */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">
              Datos Técnicos
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-muted-foreground">
                  Voltaje de Operación
                </Label>
                <p className="font-medium">
                  {equipo.datos_tecnicos?.voltaje_operacion || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Potencia</Label>
                <p className="font-medium">
                  {equipo.datos_tecnicos?.potencia || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Frecuencia</Label>
                <p className="font-medium">
                  {equipo.datos_tecnicos?.frecuencia || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Peso</Label>
                <p className="font-medium">
                  {equipo.datos_tecnicos?.peso || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Dimensiones</Label>
                <p className="font-medium">
                  {equipo.datos_tecnicos?.dimensiones || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Vida Útil</Label>
                <p className="font-medium">
                  {equipo.datos_tecnicos?.vida_util || "N/A"}
                </p>
              </div>
              <div className="col-span-3">
                <Label className="text-muted-foreground">
                  Manual de Operación
                </Label>
                <p className="font-medium">
                  {equipo.datos_tecnicos?.manual_operacion || "N/A"}
                </p>
              </div>
              <div className="col-span-3">
                <Label className="text-muted-foreground">
                  Observaciones Técnicas
                </Label>
                <p className="font-medium">
                  {equipo.datos_tecnicos?.observaciones || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleGenerarPDF} className="gap-2">
            <FileDown className="w-4 h-4" />
            Generar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
