import { useState, useCallback } from "react";

const useFetch = (baseURL) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((row) => row.startsWith("token="));
      const token = tokenCookie ? tokenCookie.split("=")[1] : null;
      console.log("🔑 Token encontrado:", token ? "Sí" : "No");
      if (token) {
        console.log("Token:", token.substring(0, 20) + "...");
      }
      return token;
    }
    return null;
  };

  const fetchData = useCallback(
    async (endpoint, method = "GET", body = null, customHeaders = {}) => {
      setLoading(true);
      setError(null);

      try {
        const token = getToken();
        const url = `${baseURL}${endpoint}`;

        console.log("🌐 Haciendo petición a:", url);
        console.log("📦 Método:", method);

        const headers = {
          "Content-Type": "application/json",
          ...customHeaders,
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
          console.log("✅ Token agregado al header");
        } else {
          console.warn("⚠️ No se encontró token en las cookies");
        }

        const config = {
          method,
          headers,
        };

        if (body && method !== "GET") {
          config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);

        if (!response.ok) {
          const errorMsg = `HTTP ${response.status}: ${response.statusText}`;
          console.error("❌ Error en la petición:", errorMsg);
          throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log("✅ Datos recibidos correctamente");
        setLoading(false);
        return { data, error: null };
      } catch (err) {
        console.error("❌ Error capturado:", err.message);
        setError(err.message);
        setLoading(false);
        return { data: null, error: err.message };
      }
    },
    [baseURL]
  );

  const get = useCallback(
    (endpoint, customHeaders = {}) => {
      return fetchData(endpoint, "GET", null, customHeaders);
    },
    [fetchData]
  );

  const post = useCallback(
    (endpoint, body, customHeaders = {}) => {
      return fetchData(endpoint, "POST", body, customHeaders);
    },
    [fetchData]
  );

  const put = useCallback(
    (endpoint, body, customHeaders = {}) => {
      return fetchData(endpoint, "PUT", body, customHeaders);
    },
    [fetchData]
  );

  const patch = useCallback(
    (endpoint, body, customHeaders = {}) => {
      return fetchData(endpoint, "PATCH", body, customHeaders);
    },
    [fetchData]
  );

  const del = useCallback(
    (endpoint, customHeaders = {}) => {
      return fetchData(endpoint, "DELETE", null, customHeaders);
    },
    [fetchData]
  );

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    del,
  };
};

export default useFetch;
