import { useState, useCallback } from "react";

const useFetch = (baseURL) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((row) => row.startsWith("token="));
      const token = tokenCookie ? tokenCookie.split("=")[1] : null;
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

        const headers = {
          "Content-Type": "application/json",
          ...customHeaders,
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
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
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        let data = null;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const text = await response.text();
          if (text) {
            data = JSON.parse(text);
          }
        }

        setLoading(false);
        return { data, error: null };
      } catch (err) {
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
