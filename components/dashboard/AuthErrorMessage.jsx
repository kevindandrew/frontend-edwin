import { Card } from "@/components/ui/card";

export const AuthErrorMessage = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="p-8 max-w-md">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-5xl">🔒</div>
          <h2 className="text-2xl font-bold">Sesión no válida</h2>
          <p className="text-muted-foreground">
            No se encontró un token de autenticación válido. Por favor, inicia
            sesión nuevamente.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Ir a Login
          </button>
        </div>
      </Card>
    </div>
  );
};
