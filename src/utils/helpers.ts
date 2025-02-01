import { Location } from "../interfaces/location";
import { Dog } from "../interfaces/dog";

export const getDogLocation = (dog: Dog, locations: Location[]) => {
  return locations.find((loc) => loc.zip_code === dog.zip_code) || undefined;
};
