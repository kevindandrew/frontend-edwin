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
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EquipoFormDialog({
  open,
  onOpenChange,
  equipo,
  onSubmit,
  loading,
  catalogos,
}) {
  const [formData, setFormData] = useState({
    nombre_equipo: "",
    modelo: "",
    numero_serie: "",
    fecha_adquisicion: "",
    garantia: "",
    proveedor: "",
    estado: "Disponible",
    id_ubicacion: "",
    id_fabricante: "",
    id_categoria: "",
    id_riesgo: "",
    id_tecnologia: "",
  });

  useEffect(() => {
    if (equipo) {
      setFormData({
        nombre_equipo: equipo.nombre_equipo || "",
        modelo: equipo.modelo || "",
        numero_serie: equipo.numero_serie || "",
        fecha_adquisicion: equipo.fecha_adquisicion || "",
        garantia: equipo.garantia || "",
        proveedor: equipo.proveedor || "",
        estado: equipo.estado || "Disponible",
        id_ubicacion: equipo.id_ubicacion?.toString() || "",
        id_fabricante: equipo.id_fabricante?.toString() || "",
        id_categoria: equipo.id_categoria?.toString() || "",
        id_riesgo: equipo.id_riesgo?.toString() || "",
        id_tecnologia: equipo.id_tecnologia?.toString() || "",
      });
    } else {
      setFormData({
        nombre_equipo: "",
        modelo: "",
        numero_serie: "",
        fecha_adquisicion: "",
        garantia: "",
        proveedor: "",
        estado: "Disponible",
        id_ubicacion: "",
        id_fabricante: "",
        id_categoria: "",
        id_riesgo: "",
        id_tecnologia: "",
      });
    }
  }, [equipo, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      id_ubicacion: parseInt(formData.id_ubicacion),
      id_fabricante: parseInt(formData.id_fabricante),
      id_categoria: parseInt(formData.id_categoria),
      id_riesgo: parseInt(formData.id_riesgo),
      id_tecnologia: parseInt(formData.id_tecnologia),
    };
    onSubmit(dataToSubmit);
  };

  const estados = [
    "En Uso",
    "Disponible",
    "En Mantenimiento",
    "Fuera de Servicio",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{equipo ? "Editar Equipo" : "Crear Equipo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Información General</TabsTrigger>
              <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_equipo">Nombre del Equipo *</Label>
                  <Input
                    id="nombre_equipo"
                    value={formData.nombre_equipo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombre_equipo: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    value={formData.modelo}
                    onChange={(e) =>
                      setFormData({ ...formData, modelo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero_serie">Número de Serie *</Label>
                  <Input
                    id="numero_serie"
                    value={formData.numero_serie}
                    onChange={(e) =>
                      setFormData({ ...formData, numero_serie: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_adquisicion">
                    Fecha de Adquisición
                  </Label>
                  <Input
                    id="fecha_adquisicion"
                    type="date"
                    value={formData.fecha_adquisicion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fecha_adquisicion: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="garantia">Garantía</Label>
                  <Input
                    id="garantia"
                    placeholder="Ej: 24 meses"
                    value={formData.garantia}
                    onChange={(e) =>
                      setFormData({ ...formData, garantia: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proveedor">Proveedor</Label>
                  <Input
                    id="proveedor"
                    value={formData.proveedor}
                    onChange={(e) =>
                      setFormData({ ...formData, proveedor: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) =>
                      setFormData({ ...formData, estado: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_ubicacion">Ubicación *</Label>
                  <Select
                    value={formData.id_ubicacion}
                    onValueChange={(value) =>
                      setFormData({ ...formData, id_ubicacion: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogos.ubicaciones.map((ub) => (
                        <SelectItem
                          key={ub.id_ubicacion}
                          value={ub.id_ubicacion.toString()}
                        >
                          {ub.nombre_ubicacion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clasificacion" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id_categoria">Categoría *</Label>
                  <Select
                    value={formData.id_categoria}
                    onValueChange={(value) =>
                      setFormData({ ...formData, id_categoria: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogos.categorias.map((cat) => (
                        <SelectItem
                          key={cat.id_categoria}
                          value={cat.id_categoria.toString()}
                        >
                          {cat.nombre_categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_riesgo">Nivel de Riesgo *</Label>
                  <Select
                    value={formData.id_riesgo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, id_riesgo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar riesgo" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogos.riesgos.map((riesgo) => (
                        <SelectItem
                          key={riesgo.id_riesgo}
                          value={riesgo.id_riesgo.toString()}
                        >
                          {riesgo.nombre_riesgo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id_fabricante">Fabricante *</Label>
                  <Select
                    value={formData.id_fabricante}
                    onValueChange={(value) =>
                      setFormData({ ...formData, id_fabricante: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar fabricante" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogos.fabricantes.map((fab) => (
                        <SelectItem
                          key={fab.id_fabricante}
                          value={fab.id_fabricante.toString()}
                        >
                          {fab.nombre_fabricante}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_tecnologia">Tipo de Tecnología *</Label>
                  <Select
                    value={formData.id_tecnologia}
                    onValueChange={(value) =>
                      setFormData({ ...formData, id_tecnologia: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tecnología" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogos.tecnologias.map((tec) => (
                        <SelectItem
                          key={tec.id_tecnologia}
                          value={tec.id_tecnologia.toString()}
                        >
                          {tec.nombre_tecnologia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Guardando...
                </>
              ) : (
                <>{equipo ? "Actualizar" : "Crear"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
