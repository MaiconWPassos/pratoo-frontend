import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API,
});

// Função para obter o token do cookie
const getToken = (): string | null => {
  if (typeof window === "undefined") return null; // Evita erro no SSR

  const match = document.cookie.match(/__session=([^;]+)/);
  return match ? match[1] : null;
};

// Interceptor para adicionar o token no header
api.interceptors.request.use(async (request) => {
  const token = getToken();

  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

export { api };
