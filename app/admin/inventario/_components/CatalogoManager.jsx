import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CatalogoManager({
  open,
  onOpenChange,
  tipo,
  items,
  onSave,
  onDelete,
}) {
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState("");

  const getTitulo = () => {
    switch (tipo) {
      case "categoria":
        return "Gestionar Categorías";
      case "riesgo":
        return "Gestionar Niveles de Riesgo";
      case "fabricante":
        return "Gestionar Fabricantes";
      case "tecnologia":
        return "Gestionar Tipos de Tecnología";
      default:
        return "Gestionar Catálogo";
    }
  };

  const getFieldName = () => {
    switch (tipo) {
      case "categoria":
        return "nombre_categoria";
      case "riesgo":
        return "nivel";
      case "fabricante":
        return "nombre_fabricante";
      case "tecnologia":
        return "nombre_tecnologia";
      default:
        return "nombre";
    }
  };

  const getIdField = () => {
    switch (tipo) {
      case "categoria":
        return "id_categoria";
      case "riesgo":
        return "id_riesgo";
      case "fabricante":
        return "id_fabricante";
      case "tecnologia":
        return "id_tecnologia";
      default:
        return "id";
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item[getFieldName()]);
  };

  const handleSave = async () => {
    if (!formData.trim()) return;

    const fieldName = getFieldName();
    const payload = { [fieldName]: formData.trim() };

    await onSave(editingItem ? editingItem[getIdField()] : null, payload);
    setEditingItem(null);
    setFormData("");
  };

  const handleDeleteConfirm = async () => {
    await onDelete(deleteItem[getIdField()]);
    setDeleteItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getTitulo()}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Formulario para crear/editar */}
            <div className="border rounded-lg p-4 space-y-3">
              <Label>{editingItem ? "Editar" : "Agregar Nuevo"}</Label>
              <div className="flex gap-2">
                <Input
                  value={formData}
                  onChange={(e) => setFormData(e.target.value)}
                  placeholder={`Nombre del ${tipo}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSave();
                    }
                  }}
                />
                <Button onClick={handleSave} disabled={!formData.trim()}>
                  {editingItem ? (
                    "Actualizar"
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" /> Agregar
                    </>
                  )}
                </Button>
                {editingItem && (
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                )}
              </div>
            </div>

            {/* Lista de items */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items && items.length > 0 ? (
                    items.map((item, index) => (
                      <TableRow key={item[getIdField()]}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item[getFieldName()]}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteItem(item)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        No hay registros
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente{" "}
              <strong>{deleteItem?.[getFieldName()]}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
