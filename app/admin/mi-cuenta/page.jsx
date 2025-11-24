"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import useMiCuenta from "@/hooks/useMiCuenta";
import useMiCuentaForm from "@/hooks/useMiCuentaForm";
import InfoPersonalView from "@/components/mi-cuenta/InfoPersonalView";
import EditarCuentaForm from "@/components/mi-cuenta/EditarCuentaForm";
import RolCard from "@/components/mi-cuenta/RolCard";

export default function MiCuentaPage() {
  const { usuario, loading, error, updateMiCuenta } = useMiCuenta();
  const {
    isEditing,
    formData,
    setFormData,
    passwordData,
    setPasswordData,
    isSaving,
    handleEdit,
    handleCancel,
    handleSubmit,
  } = useMiCuentaForm(updateMiCuenta, usuario);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Cuenta</h1>
        <p className="text-muted-foreground">
          Administra tu información personal
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <InfoPersonalView usuario={usuario} onEdit={handleEdit} />
            ) : (
              <EditarCuentaForm
                formData={formData}
                setFormData={setFormData}
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSaving={isSaving}
              />
            )}
          </CardContent>
        </Card>

        <RolCard usuario={usuario} />
      </div>
    </div>
  );
}
