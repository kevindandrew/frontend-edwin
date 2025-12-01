"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { Eye, EyeOff } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import Cookies from "js-cookie";

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

      if (!response.ok) {
        let errorData = {};
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json().catch(() => ({}));
        } else {
          const text = await response.text();
          errorData = { detail: text };
        }
        setError(
          errorData.detail || "Credenciales incorrectas. Intenta nuevamente."
        );
        return;
      }

      const data = await response.json();

      if (data.access_token) {
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        Cookies.set("token", data.access_token, {
          expires: 30,
          path: "/",
          sameSite: "Lax",
        });

        if (data.usuario) {
          const userData = {
            id_usuario: data.usuario.id_usuario,
            username: data.usuario.nombre_usuario,
            nombre_completo: data.usuario.nombre_completo,
            email: data.usuario.email,
            id_rol: data.usuario.rol?.id_rol,
            rol: data.usuario.rol?.nombre_rol,
            avatar: data.usuario.avatar,
          };

          // Guardar en Cookies para acceso desde layouts
          Cookies.set("user", JSON.stringify(userData), {
            expires: 30,
            path: "/",
            sameSite: "Lax",
          });

          // Mantener localStorage por compatibilidad si es necesario
          localStorage.setItem("user", JSON.stringify(userData));

          // Redirección basada en rol
          if (userData.id_rol === 2) {
            router.push("/tecnico");
          } else if (userData.id_rol === 3) {
            router.push("/gestor");
          } else {
            router.push("/admin");
          }
        } else {
          router.push("/admin");
        }
      } else {
        setError("Error al obtener el token. Intenta nuevamente.");
      }
    } catch (err) {
      setError("Error de conexión. Verifica tu conexión a internet.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/logocompleto.png"
            alt="Logo de la empresa"
            width={200}
            height={80}
            priority
            className="object-contain"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bienvenido
          </h1>
          <p className="text-muted-foreground text-sm">
            Inicia sesión con tu cuenta
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
      </Card>
    </main>
  );
}
