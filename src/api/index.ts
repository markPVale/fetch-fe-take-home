import axios from "axios";

const fetchDogsApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // Default to Netlify proxy, fallback to direct API in local env
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default fetchDogsApi;
export * from "./auth";
export * from "./dogs";
export * from "./locations";
