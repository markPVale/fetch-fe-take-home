import fetchDogsApi from "./index";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}
interface FetchDogsResponse {
  next: string | null; // The next query string or null if no more pages
  resultIds: string[]; // Array of dog IDs
  total: number;       // Total number of results
}

/**
 * Fetches a list of dogs based on the provided query parameters.
 *
 * @param queryParams Optional query parameters for filtering dogs.
 * @returns An object containing the next query string, result IDs, and total count.
 */
export const fetchDogs = async (queryParams?: string): Promise<FetchDogsResponse> => {
  const url = queryParams?.startsWith("/dogs/search")
    ? queryParams
    : `/dogs/search${queryParams || ""}`;
  const response = await fetchDogsApi.get(url);
  return response.data;
};

/**
 * Fetches detailed information for a list of dog IDs.
 *
 * @param ids Array of dog IDs.
 * @returns An array of Dog objects containing detailed information.
 */
export const fetchDogDetails = async (ids: string[]): Promise<Dog[]> => {
  const response = await fetchDogsApi.post("/dogs", ids);
  return response.data;
};

/**
 * Fetches the list of available dog breeds.
 *
 * @returns An array of breed names as strings.
 */
export const fetchBreeds = async (): Promise<string[]> => {
  const response = await fetchDogsApi.get("/dogs/breeds");
  return response.data;
};

/**
 * Fetches a match from the list of favorite dog IDs.
 *
 * @param favoriteIds Array of favorited dog IDs
 * @returns The matched dog's ID as a string
 * @throws Error if the API call fails
 */
export const fetchMatch = async (favoriteIds: string[]): Promise<string> => {
  if (!favoriteIds.length || favoriteIds.length === 0) {
    throw new Error("No favorites selected");
  }
  const response = await fetchDogsApi.post("/dogs/match", favoriteIds);
  return response.data.match;
}
