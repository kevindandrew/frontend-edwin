import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";

export default function CambiarPasswordSection({
  passwordData,
  setPasswordData,
}) {
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowPasswordFields(!showPasswordFields)}
        className="w-full"
      >
        <Lock className="w-4 h-4 mr-2" />
        {showPasswordFields
          ? "Cancelar cambio de contraseña"
          : "Cambiar Contraseña"}
      </Button>

      {showPasswordFields && (
        <div className="grid gap-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="contraseña">Nueva Contraseña</Label>
            <Input
              id="contraseña"
              type="password"
              value={passwordData.contraseña}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  contraseña: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmar_contraseña">Confirmar Contraseña</Label>
            <Input
              id="confirmar_contraseña"
              type="password"
              value={passwordData.confirmar_contraseña}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmar_contraseña: e.target.value,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
