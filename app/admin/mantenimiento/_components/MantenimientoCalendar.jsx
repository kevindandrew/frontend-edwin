import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function MantenimientoCalendar({
  mantenimientos,
  onSelectMantenimiento,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Function to get maintenance for a specific day
  const getMantenimientosForDay = (day) => {
    return mantenimientos.filter((m) => {
      if (!m.fecha_programada) return false;
      return isSameDay(parseISO(m.fecha_programada), day);
    });
  };

  // Custom day content to show indicators
  const DayContent = (props) => {
    const { date, displayMonth } = props;
    const mants = getMantenimientosForDay(date);

    if (mants.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          {date.getDate()}
        </div>
      );
    }

    const hasHighPriority = mants.some((m) => {
      const fecha = parseISO(m.fecha_programada);
      const hoy = new Date();
      return fecha < hoy && !m.fecha_realizacion;
    });

    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <span>{date.getDate()}</span>
        <div className="flex gap-0.5 absolute bottom-1">
          {mants.slice(0, 3).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                hasHighPriority ? "bg-red-500" : "bg-blue-500"
              }`}
            />
          ))}
          {mants.length > 3 && (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          )}
        </div>
      </div>
    );
  };

  const selectedMantenimientos = getMantenimientosForDay(selectedDate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-4 md:col-span-1 flex justify-center">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={es}
          components={{
            DayContent: DayContent,
          }}
          modifiersClassNames={{
            selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            today: "bg-accent text-accent-foreground",
          }}
        />
      </Card>

      <Card className="p-6 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">
          Mantenimientos para el{" "}
          {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
        </h3>

        {selectedMantenimientos.length > 0 ? (
          <div className="space-y-4">
            {selectedMantenimientos.map((mant) => (
              <div
                key={mant.id_mantenimiento}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => onSelectMantenimiento(mant)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {mant.equipo?.nombre_equipo ||
                        "Equipo #" + mant.id_equipo}
                    </span>
                    <Badge
                      variant={mant.fecha_realizacion ? "default" : "outline"}
                    >
                      {mant.tipo_mantenimiento}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mant.descripcion_trabajo || "Sin descripción"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {mant.tecnico
                      ? mant.tecnico.nombre_completo
                      : "Sin técnico"}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      !mant.fecha_realizacion &&
                      new Date(mant.fecha_programada) < new Date()
                        ? "text-red-500 font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {mant.fecha_realizacion ? "Completado" : "Pendiente"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No hay mantenimientos programados para este día.
          </div>
        )}
      </Card>
    </div>
  );
}
