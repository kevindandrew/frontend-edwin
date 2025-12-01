"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import useRepuestos from "@/hooks/useRepuestos";
import { Spinner } from "@/components/ui/spinner";

export default function RepuestosTecnicoPage() {
  const { repuestos, loading } = useRepuestos();
  const [search, setSearch] = useState("");

  const filteredRepuestos = repuestos.filter(
    (r) =>
      r.nombre_repuesto?.toLowerCase().includes(search.toLowerCase()) ||
      r.codigo_repuesto?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventario de Repuestos</h1>
        <p className="text-muted-foreground mt-2">
          Consulta la disponibilidad de repuestos y materiales
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o código..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : filteredRepuestos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron repuestos.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepuestos.map((r) => (
                  <TableRow key={r.id_repuesto}>
                    <TableCell className="font-mono text-sm">
                      {r.codigo_repuesto || "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {r.nombre_repuesto}
                    </TableCell>
                    <TableCell>{r.stock}</TableCell>
                    <TableCell>{r.stock_minimo}</TableCell>
                    <TableCell>
                      {r.stock <= r.stock_minimo ? (
                        <Badge variant="destructive">Stock Bajo</Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Disponible
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
