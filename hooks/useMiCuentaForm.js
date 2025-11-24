import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function useMiCuentaForm(updateMiCuenta, usuario) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: "",
  });
  const [passwordData, setPasswordData] = useState({
    contraseña: "",
    confirmar_contraseña: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    if (usuario) {
      setFormData({
        nombre_completo: usuario.nombre_completo || "",
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPasswordData({
      contraseña: "",
      confirmar_contraseña: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const datosActualizados = { ...formData };

    if (passwordData.contraseña) {
      if (passwordData.contraseña !== passwordData.confirmar_contraseña) {
        toast({
          title: "Error",
          description: "Las contraseñas no coinciden",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      datosActualizados.contraseña = passwordData.contraseña;
    }

    const response = await updateMiCuenta(datosActualizados);

    if (response.success) {
      toast({
        title: "Éxito",
        description: "Tu información ha sido actualizada correctamente",
      });
      setIsEditing(false);
      setPasswordData({
        contraseña: "",
        confirmar_contraseña: "",
      });
    } else {
      toast({
        title: "Error",
        description: response.message || "No se pudo actualizar la información",
        variant: "destructive",
      });
    }

    setIsSaving(false);
  };

  return {
    isEditing,
    formData,
    setFormData,
    passwordData,
    setPasswordData,
    isSaving,
    handleEdit,
    handleCancel,
    handleSubmit,
  };
}
