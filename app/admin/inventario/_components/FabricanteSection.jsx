import { Separator } from "@/components/ui/separator";
import CatalogSelectField from "./CatalogSelectField";

export default function FabricanteSection({
  formData,
  handleChange,
  catalogos,
  getCatalogoItems,
  handleOpenCatalogo,
  handleCatalogoSave,
  handleCatalogoDelete,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-primary">Fabricante</h3>
        <Separator className="mt-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CatalogSelectField
          label="Fabricante"
          fieldId="id_fabricante"
          value={formData.id_fabricante}
          items={getCatalogoItems(catalogos, "fabricante")}
          itemIdKey="id_fabricante"
          itemNameKey="nombre_fabricante"
          placeholder="Seleccionar fabricante"
          showNewInput={false}
          newItemName=""
          onSelectChange={(value) => handleChange("id_fabricante", value)}
          onNewInputChange={() => {}}
          onAddNew={() => {}}
          onCancelNew={() => {}}
          onManageClick={() => handleOpenCatalogo("fabricante")}
        />
      </div>
    </div>
  );
}
