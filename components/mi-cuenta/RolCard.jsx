import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RolCard({ usuario }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rol del Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {usuario?.rol?.nombre_rol || "Sin rol"}
        </Badge>
      </CardContent>
    </Card>
  );
}
