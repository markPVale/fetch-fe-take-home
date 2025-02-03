import axios from "axios";

const fetchDogsApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default fetchDogsApi;
export * from "./auth";
export * from "./dogs";
export * from "./locations";
