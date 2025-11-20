"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { Eye, EyeOff } from "lucide-react";
import useFetch from "@/hooks/useFetch";

export default function LoginPage() {
  const router = useRouter();
  const { post, loading } = useFetch("https://backend-edwin.onrender.com");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      console.log("Intentando login con usuario:", username);

      // Hacer login al backend usando JSON
      const response = await fetch(
        "https://backend-edwin.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      console.log("📡 Respuesta del servidor:", response.status);

      if (!response.ok) {
        let errorData = {};
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json().catch(() => ({}));
        } else {
          const text = await response.text();
          errorData = { detail: text };
        }
        console.error("❌ Error del servidor:", errorData);
        setError(
          errorData.detail || "Credenciales incorrectas. Intenta nuevamente."
        );
        return;
      }

      const data = await response.json();
      console.log("✅ Login exitoso, datos recibidos:", {
        ...data,
        access_token: data.access_token ? "***" : undefined,
      });

      // Guardar token en cookies
      if (data.access_token) {
        // Guardar token con expiración de 30 días
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        document.cookie = `token=${
          data.access_token
        }; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

        console.log("🍪 Token guardado en cookies");
        console.log("Token:", data.access_token.substring(0, 30) + "...");

        // Guardar información del usuario en localStorage
        if (data.usuario) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.usuario.id_usuario,
              username: data.usuario.nombre_usuario,
              fullName: data.usuario.nombre_completo,
              role: data.usuario.rol?.nombre_rol || "user",
              roleId: data.usuario.rol?.id_rol,
            })
          );
          console.log("💾 Información del usuario guardada en localStorage");
        }

        console.log("✅ Redirigiendo al dashboard...");

        // Redirigir al dashboard
        router.push("/admin");
      } else {
        setError("Error al obtener el token. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError("Error de conexión. Verifica tu conexión a internet.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bienvenido
          </h1>
          <p className="text-muted-foreground text-sm">
            Inicia sesión con tu cuenta de administrador
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="bg-background"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-background pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta? Contacta al administrador
          </p>
        </div>

        <Link href="/" className="block mt-4">
          <Button variant="outline" className="w-full">
            Volver al Inicio
          </Button>
        </Link>
      </Card>
    </main>
  );
}
