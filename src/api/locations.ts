import fetchDogsApi from "./index";
import { Location } from "../interfaces/location";
import { GeoBoundingBox } from "../interfaces/geoBoundingBox";
/**
 * Fetch location details for a list of zip codes.
 *
 * @param zipCodes Array of zip codes
 * @returns Array of Location objects
 */
export const fetchLocations = async (zipCodes: string[]): Promise<Location[]> => {
  if (!zipCodes || zipCodes.length === 0) {
    throw new Error("No zip codes provided.");
  }

  const response = await fetchDogsApi.post("/locations", zipCodes);
  // console.log("API Response for fetchLocations:", response.data);

  const validLocations = response.data.filter((loc: Location | null) => loc !== null);

  // console.log("Filtered Locations (No null values):", validLocations);

  return validLocations;
};

/**
 * Search for locations based on city, state, or geographic bounding box.
 *
 * @param city Optional city name or partial name
 * @param states Optional array of state abbreviations
 * @param geoBoundingBox Optional geographic bounding box
 * @param size Optional size of results (default 25)
 * @param from Optional pagination offset
 * @returns Object with results (Location[]) and total count
 */
export const searchLocations = async (
  city?: string,
  states?: string[],
  geoBoundingBox?: GeoBoundingBox,
  size: number = 25,
  from?: number
): Promise<{ results: Location[]; total: number }> => {
  const body: Partial<Location> & {size: number; from?: number; geoBoundingBox?: GeoBoundingBox; states?: string[]} = { size };
  if (city) body.city = city;
  if (states) body.states = states;
  if (geoBoundingBox) body.geoBoundingBox = geoBoundingBox;
  if (from) body.from = from;

  const response = await fetchDogsApi.post("/locations/search", body);
  return response.data;
};