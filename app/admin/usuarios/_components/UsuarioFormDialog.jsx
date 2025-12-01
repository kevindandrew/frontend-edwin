import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UsuarioFormDialog = ({
  open,
  onClose,
  onSubmit,
  usuario,
  roles,
  loading,
}) => {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    nombre_usuario: "",
    id_rol: "",
    contrasena: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre_completo: usuario.nombre_completo,
        nombre_usuario: usuario.nombre_usuario,
        id_rol: usuario.id_rol.toString(),
        contrasena: "",
      });
    } else {
      setFormData({
        nombre_completo: "",
        nombre_usuario: "",
        id_rol: "",
        contrasena: "",
      });
    }
    setErrors({});
  }, [usuario, open]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre_completo.trim())
      newErrors.nombre_completo = "Campo requerido";
    if (!formData.nombre_usuario.trim())
      newErrors.nombre_usuario = "Campo requerido";
    if (!formData.id_rol) newErrors.id_rol = "Campo requerido";
    if (!usuario && !formData.contrasena.trim())
      newErrors.contrasena = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        id_rol: parseInt(formData.id_rol),
      };
      if (usuario && !formData.contrasena) {
        delete submitData.contrasena;
      }
      onSubmit(submitData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {usuario ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre_completo">Nombre Completo</Label>
            <Input
              id="nombre_completo"
              value={formData.nombre_completo}
              onChange={(e) =>
                setFormData({ ...formData, nombre_completo: e.target.value })
              }
              className={errors.nombre_completo ? "border-destructive" : ""}
            />
            {errors.nombre_completo && (
              <p className="text-xs text-destructive mt-1">
                {errors.nombre_completo}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="nombre_usuario">Nombre de Usuario</Label>
            <Input
              id="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={(e) =>
                setFormData({ ...formData, nombre_usuario: e.target.value })
              }
              className={errors.nombre_usuario ? "border-destructive" : ""}
            />
            {errors.nombre_usuario && (
              <p className="text-xs text-destructive mt-1">
                {errors.nombre_usuario}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="id_rol">Rol</Label>
            <Select
              value={formData.id_rol}
              onValueChange={(value) =>
                setFormData({ ...formData, id_rol: value })
              }
            >
              <SelectTrigger
                className={errors.id_rol ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((rol) => (
                  <SelectItem key={rol.id_rol} value={rol.id_rol.toString()}>
                    {rol.nombre_rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_rol && (
              <p className="text-xs text-destructive mt-1">{errors.id_rol}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contrasena">
              Contraseña {usuario && "(dejar vacío para no cambiar)"}
            </Label>
            <Input
              id="contrasena"
              type="password"
              value={formData.contrasena}
              onChange={(e) =>
                setFormData({ ...formData, contrasena: e.target.value })
              }
              className={errors.contrasena ? "border-destructive" : ""}
            />
            {errors.contrasena && (
              <p className="text-xs text-destructive mt-1">
                {errors.contrasena}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
