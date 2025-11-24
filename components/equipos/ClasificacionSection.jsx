import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import CatalogSelectField from "./CatalogSelectField";

export default function ClasificacionSection({
  formData,
  handleChange,
  handleSelectChange,
  catalogos,
  showNewInput,
  setShowNewInput,
  newItemName,
  setNewItemName,
  handleAddNew,
  openCatalogoManager,
  nivelesRiesgoSugeridos,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-primary">Clasificación</h3>
        <Separator className="mt-2" />
      </div>

      {/* Categoría */}
      <CatalogSelectField
        label="Categoría *"
        fieldId="id_categoria"
        value={formData.id_categoria}
        items={catalogos.categorias}
        itemIdKey="id_categoria"
        itemNameKey="nombre_categoria"
        placeholder="Seleccionar categoría"
        showNewInput={showNewInput.categoria}
        newItemName={newItemName.categoria}
        onSelectChange={(value) =>
          handleSelectChange("id_categoria", value, "categoria")
        }
        onNewInputChange={(e) =>
          setNewItemName((prev) => ({
            ...prev,
            categoria: e.target.value,
          }))
        }
        onAddNew={() => handleAddNew("categoria")}
        onCancelNew={() => {
          setShowNewInput((prev) => ({ ...prev, categoria: false }));
          setNewItemName((prev) => ({ ...prev, categoria: "" }));
        }}
        onManageClick={() => openCatalogoManager("categoria")}
      />

      {/* Nivel de Riesgo */}
      <div className="space-y-2">
        <Label htmlFor="id_riesgo">Nivel de Riesgo *</Label>
        <Select
          value={formData.id_riesgo}
          onValueChange={(value) => handleChange("id_riesgo", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar nivel de riesgo" />
          </SelectTrigger>
          <SelectContent>
            {nivelesRiesgoSugeridos.map((nivel) => (
              <SelectItem key={nivel} value={nivel}>
                {nivel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Ejemplos: Clase I (bajo riesgo), Clase IIa, Clase IIb, Clase III (alto
          riesgo)
        </p>
      </div>
    </div>
  );
}
