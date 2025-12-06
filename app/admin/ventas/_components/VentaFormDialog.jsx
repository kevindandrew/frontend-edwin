import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import useClientes from "@/hooks/useClientes";
import Cookies from "js-cookie";

export default function VentaFormDialog({
  open,
  onOpenChange,
  venta,
  onSubmit,
  loading,
}) {
  const { clientes, refreshClientes } = useClientes();
  const [formData, setFormData] = useState({
    id_cliente: "",
    fecha_venta: new Date().toISOString().split("T")[0],
    estado_venta: "Pendiente",
    monto_total: 0,
    id_usuario_vendedor: "",
  });

  useEffect(() => {
    if (open) {
      refreshClientes();
      // Obtener ID del vendedor del usuario logueado
      const userStr = Cookies.get("user") || localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          // Intentar obtener id_usuario o id, según cómo esté guardado
          const userId = user.id_usuario || user.id;
          if (userId) {
            setFormData((prev) => ({ ...prev, id_usuario_vendedor: userId }));
          }
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      }

      if (venta) {
        setFormData({
          id_cliente: venta.id_cliente?.toString() || "",
          fecha_venta:
            venta.fecha_venta || new Date().toISOString().split("T")[0],
          estado_venta: venta.estado_venta || "Pendiente",
          monto_total: venta.monto_total || 0,
          id_usuario_vendedor:
            venta.id_usuario_vendedor || formData.id_usuario_vendedor,
        });
      } else {
        // Reset form for new entry, keeping the salesperson ID
        setFormData((prev) => ({
          ...prev,
          id_cliente: "",
          fecha_venta: new Date().toISOString().split("T")[0],
          estado_venta: "Pendiente",
          monto_total: 0,
        }));
      }
    }
  }, [open, venta]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar tipo de datos según la API
    const payload = {
      ...formData,
      id_cliente: parseInt(formData.id_cliente),
      id_usuario_vendedor: parseInt(formData.id_usuario_vendedor),
      monto_total: parseFloat(formData.monto_total),
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{venta ? "Editar Venta" : "Nueva Venta"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente</Label>
            <Select
              value={formData.id_cliente.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, id_cliente: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem
                    key={cliente.id_cliente}
                    value={cliente.id_cliente.toString()}
                  >
                    {cliente.nombre_institucion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de Venta</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha_venta}
              onChange={(e) =>
                setFormData({ ...formData, fecha_venta: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado_venta}
              onValueChange={(value) =>
                setFormData({ ...formData, estado_venta: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Entregada">Entregada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto_total">Monto Total</Label>
            <Input
              id="monto_total"
              type="number"
              step="0.01"
              value={formData.monto_total}
              onChange={(e) =>
                setFormData({ ...formData, monto_total: e.target.value })
              }
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.id_usuario_vendedor}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
