import { useState, useEffect, useCallback } from "react";
import { fetchBreeds, fetchDogs, fetchDogDetails, fetchMatch } from "../api/dogs";
import { fetchLocations } from "../api/locations";
import { Dog } from "../interfaces/dog";
import { Location } from "../interfaces/location";

export const useDogs = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextQuery, setNextQuery] = useState<string | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [selectedZip, setSelectedZip] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("breed:asc");
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  useEffect(() => {
    const loadBreeds = async () => {
      try {
        setBreeds(await fetchBreeds());
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load breeds.");
      }
    };
    loadBreeds();
  }, []);

  const loadDogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBreed) params.append("breeds", selectedBreed);
      if (sortOrder) params.append("sort", sortOrder);
      if (selectedZip) params.append("zipCodes", selectedZip);

      const searchResponse = await fetchDogs(`?${params.toString()}`);
      const dogDetails = await fetchDogDetails(searchResponse.resultIds);

      const zipCodes = [...new Set(dogDetails.map((dog) => dog.zip_code))];
      setLocations(zipCodes.length ? await fetchLocations(zipCodes) : []);
      setDogs(dogDetails);
      setNextQuery(searchResponse.next || null);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load dogs.");
      setLoading(false);
    }
  }, [selectedBreed, sortOrder, selectedZip]);

  useEffect(() => {
    loadDogs();
  }, [loadDogs]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]));
  };

  const generateMatch = async () => {
    if (!favorites.length) return setError("Please select at least one dog to find a match.");
    try {
      const matchedDogId = await fetchMatch(favorites);
      setMatchedDog(matchedDogId ? (await fetchDogDetails([matchedDogId]))[0] : null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate match.");
    }
  };

  const loadNextPage = async () => {
    if (!nextQuery) return;
    try {
      setLoading(true);
      const searchResponse = await fetchDogs(nextQuery);
      const dogDetails = await fetchDogDetails(searchResponse.resultIds);
      setDogs((prev) => [...prev, ...dogDetails.filter((dog) => !prev.some((d) => d.id === dog.id))]);
      setNextQuery(searchResponse.next || null);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load more dogs.");
      setLoading(false);
    }
  };

  return {
    breeds,
    dogs,
    locations,
    favorites,
    error,
    loading,
    nextQuery,
    selectedBreed,
    selectedZip,
    sortOrder,
    matchedDog,
    setMatchedDog,
    setSelectedBreed,
    setSelectedZip,
    toggleFavorite,
    generateMatch,
    loadNextPage,
    loadDogs,
    setSortOrder,
  };
};
