import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const VentasComprasChart = ({ data, year }) => {
  return (
    <Card className="col-span-1 lg:col-span-2 p-6">
      <h2 className="text-lg font-semibold mb-4">
        Ventas vs Compras (Año {year})
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `Bs. ${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="ventas" fill="#0088FE" name="Ventas" />
          <Bar dataKey="compras" fill="#00C49F" name="Compras" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
