import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, MapPin, Phone, Mail, User } from "lucide-react";

export default function ClienteViewDialog({ open, onOpenChange, cliente }) {
  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {cliente.nombre_institucion}
              </h3>
              <Badge variant="secondary" className="mt-1">
                NIT: {cliente.nit_ruc}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Persona de Contacto
              </Label>
              <p className="font-medium">
                {cliente.persona_contacto || "No especificado"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono
              </Label>
              <p className="font-medium">
                {cliente.telefono_contacto || "No especificado"}
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <p className="font-medium">
                {cliente.email_contacto || "No especificado"}
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dirección
              </Label>
              <p className="font-medium">
                {cliente.direccion || "No especificada"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
