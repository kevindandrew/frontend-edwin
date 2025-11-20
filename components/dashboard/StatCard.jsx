import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  loading,
  subtitle,
}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        {loading ? (
          <div className="h-8 w-32 bg-muted animate-pulse rounded mt-2" />
        ) : (
          <>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </>
        )}
        {change && (
          <p
            className={`text-xs mt-1 flex items-center gap-1 ${
              change.includes("+") ? "text-green-600" : "text-red-600"
            }`}
          >
            {change.includes("+") ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {change}
          </p>
        )}
      </div>
      <div className="bg-primary/10 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  </Card>
);
