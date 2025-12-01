import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Plus } from "lucide-react";

export default function CatalogSelectField({
  label,
  fieldId,
  value,
  items,
  itemIdKey,
  itemNameKey,
  placeholder,
  showNewInput,
  newItemName,
  onSelectChange,
  onNewInputChange,
  onAddNew,
  onCancelNew,
  onManageClick,
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={fieldId}>{label}</Label>
        <Button type="button" variant="ghost" size="sm" onClick={onManageClick}>
          <Settings className="h-4 w-4 mr-1" />
          Gestionar
        </Button>
      </div>
      {!showNewInput ? (
        <Select value={value} onValueChange={onSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {items?.map((item) => (
              <SelectItem
                key={item[itemIdKey]}
                value={item[itemIdKey]?.toString() || ""}
              >
                {item[itemNameKey]}
              </SelectItem>
            ))}
            <SelectItem value="nuevo">+ Agregar nuevo</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex gap-2">
          <Input
            value={newItemName}
            onChange={onNewInputChange}
            placeholder={`Nombre del ${label.toLowerCase()}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAddNew();
              }
            }}
          />
          <Button onClick={onAddNew}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={onCancelNew}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}
