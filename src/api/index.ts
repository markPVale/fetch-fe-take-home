import axios from "axios";

const fetchDogsApi = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
  withCredentials: true,
});

export default fetchDogsApi;
export * from "./auth";
export * from "./dogs";
export * from "./locations";


