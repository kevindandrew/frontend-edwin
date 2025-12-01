import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

export default function InfoPersonalView({ usuario, onEdit }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Nombre Completo</Label>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <p className="font-medium">
              {usuario?.nombre_completo || "No especificado"}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Usuario</Label>
          <p className="font-medium">{usuario?.nombre_usuario}</p>
        </div>
      </div>
      <Separator />
      <Button onClick={onEdit}>Editar Información</Button>
    </div>
  );
}
