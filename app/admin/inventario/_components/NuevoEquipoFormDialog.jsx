import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CatalogoManager from "./CatalogoManager";
import useClientesYUbicaciones from "@/hooks/useClientesYUbicaciones";
import DatosEquipoSection from "./DatosEquipoSection";
import UbicacionSection from "./UbicacionSection";
import FabricanteSection from "./FabricanteSection";
import ClasificacionSection from "./ClasificacionSection";
import InformacionAdicionalSection from "./InformacionAdicionalSection";
import DatosTecnicosSection from "./DatosTecnicosSection";
import {
  INITIAL_FORM_DATA,
  ESTADOS,
  NIVELES_RIESGO,
  FIELD_MAP,
  ID_FIELD_MAP,
  mapEquipoToFormData,
  preparePayload,
  getCatalogoItems,
} from "./formHelpers";

export default function NuevoEquipoFormDialog({
  open,
  onOpenChange,
  equipo,
  catalogos,
  onSubmit,
  isEditing,
  onCatalogoUpdate,
}) {
  const { clientes, fetchUbicacionesPorCliente } = useClientesYUbicaciones();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [catalogoManagerOpen, setCatalogoManagerOpen] = useState(false);
  const [catalogoTipo, setCatalogoTipo] = useState(null);
  const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([]);
  const [showNewInput, setShowNewInput] = useState({
    categoria: false,
    fabricante: false,
    tecnologia: false,
  });
  const [newItemName, setNewItemName] = useState({
    categoria: "",
    fabricante: "",
    tecnologia: "",
  });

  useEffect(() => {
    if (equipo && isEditing) {
      setFormData(mapEquipoToFormData(equipo));
      if (equipo.id_cliente) {
        fetchUbicacionesPorCliente(equipo.id_cliente).then((ubicaciones) =>
          setUbicacionesDisponibles(ubicaciones || [])
        );
      }
    } else {
      setFormData(INITIAL_FORM_DATA);
      setUbicacionesDisponibles([]);
    }
  }, [equipo, isEditing, open]);

  const handleClienteChange = async (clienteId) => {
    setFormData((prev) => ({
      ...prev,
      id_cliente: clienteId,
      id_ubicacion: "",
    }));
    const ubicaciones = await fetchUbicacionesPorCliente(clienteId);
    setUbicacionesDisponibles(ubicaciones || []);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field, value, tipo) => {
    if (value === "nuevo") {
      setShowNewInput((prev) => ({ ...prev, [tipo]: true }));
      setFormData((prev) => ({ ...prev, [field]: "" }));
    } else {
      setShowNewInput((prev) => ({ ...prev, [tipo]: false }));
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddNew = async (tipo) => {
    const nombre = newItemName[tipo].trim();
    if (!nombre) return;

    try {
      const payload = { [FIELD_MAP[tipo]]: nombre };
      const result = await onCatalogoUpdate(tipo, null, payload);

      if (result && result[ID_FIELD_MAP[tipo]]) {
        setFormData((prev) => ({
          ...prev,
          [ID_FIELD_MAP[tipo]]: result[ID_FIELD_MAP[tipo]].toString(),
        }));
      }

      setShowNewInput((prev) => ({ ...prev, [tipo]: false }));
      setNewItemName((prev) => ({ ...prev, [tipo]: "" }));
    } catch (error) {}
  };

  const openCatalogoManager = (tipo) => {
    setCatalogoTipo(tipo);
    setCatalogoManagerOpen(true);
  };

  const handleSubmit = () => {
    onSubmit(preparePayload(formData));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto"
          style={{ width: "900px", maxWidth: "95vw" }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isEditing ? "Editar Equipo" : "Crear Equipo"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <DatosEquipoSection
              formData={formData}
              handleChange={handleChange}
              estados={ESTADOS}
              catalogos={catalogos}
              getCatalogoItems={getCatalogoItems}
            />

            <UbicacionSection
              formData={formData}
              handleChange={handleChange}
              handleClienteChange={handleClienteChange}
              clientes={clientes}
              ubicacionesDisponibles={ubicacionesDisponibles}
            />

            <FabricanteSection
              formData={formData}
              handleChange={handleChange}
              catalogos={catalogos}
              getCatalogoItems={getCatalogoItems}
              handleOpenCatalogo={openCatalogoManager}
              handleCatalogoSave={onCatalogoUpdate}
              handleCatalogoDelete={onCatalogoUpdate}
            />

            <ClasificacionSection
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              catalogos={catalogos}
              showNewInput={showNewInput}
              setShowNewInput={setShowNewInput}
              newItemName={newItemName}
              setNewItemName={setNewItemName}
              handleAddNew={handleAddNew}
              openCatalogoManager={openCatalogoManager}
              nivelesRiesgoSugeridos={NIVELES_RIESGO}
            />

            <InformacionAdicionalSection
              formData={formData}
              handleChange={handleChange}
            />

            <DatosTecnicosSection
              formData={formData}
              handleChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? "Actualizar" : "Crear"} Equipo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de gestión de catálogos */}
      <CatalogoManager
        open={catalogoManagerOpen}
        onOpenChange={setCatalogoManagerOpen}
        tipo={catalogoTipo}
        items={getCatalogoItems(catalogos, catalogoTipo)}
        onSave={(id, payload) => onCatalogoUpdate(catalogoTipo, id, payload)}
        onDelete={(id) => onCatalogoUpdate(catalogoTipo, id, null)}
      />
    </>
  );
}
