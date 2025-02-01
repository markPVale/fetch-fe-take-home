import React, { useEffect, useState, useCallback } from "react";
import Button from "../components/Button";
import DogCard from "../components/DogCard";
import FiltersContainer from "../components/FiltersContainer";
import Navbar from "../components/Navbar";
import { fetchBreeds, fetchDogs, fetchDogDetails, fetchMatch } from "../api/dogs";
import { fetchLocations } from "../api/locations";
import { Dog } from "../interfaces/dog";
import { Location } from "../interfaces/location";

const SearchPage: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [nextQuery, setNextQuery] = useState<string | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [selectedZip, setSelectedZip] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("breed:asc");
  const [zipInput, setZipInput] = useState<string>("");

  const handleZipSearch = () => {
    setSelectedZip(zipInput);
  };

  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const breeds = await fetchBreeds();
        setBreeds(breeds);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message || "Failed to load breeds.");
        } else {
          setError("An unknown error occurred.");
        }
        console.error("Error fetching breeds", error);
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

      const queryParams = `?${params.toString()}`;
      const searchResponse = await fetchDogs(queryParams);
      const dogDetails = await fetchDogDetails(searchResponse.resultIds);

      const zipCodes = [...new Set(dogDetails.map((dog) => dog.zip_code))];
      if (zipCodes.length > 0) {
        const locationData = await fetchLocations(zipCodes);
        setLocations(locationData);
      } else {
        setLocations([]);
      }
      setDogs(dogDetails);
      setNextQuery(searchResponse.next || null);
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to load dogs.");
      } else {
        setError("An unknown error occurred.");
      }
      setLoading(false);
    }
  }, [selectedBreed, sortOrder, selectedZip]);

  useEffect(() => {
    loadDogs();
  }, [loadDogs]);

  const toggleFavorite = (id: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  const generateMatch = async () => {
    try {
      if (favorites.length === 0) {
        setError("Please select at least one dog to find a match.");
        return;
      }

      const matchedDogId = await fetchMatch(favorites);
      if (matchedDogId) {
        const [match] = await fetchDogDetails([matchedDogId]);
        setMatchedDog(match);
      } else {
        setError(
          "No match found. Try adding different dogs to your favorites."
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to generate match.");
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Error generating match", error);
    }
  };

  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(e.target.value || null);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const loadNextPage = async () => {
    if (!nextQuery) {
      return;
    }

    try {
      setLoading(true);
      const searchResponse = await fetchDogs(nextQuery);
      const dogDetails = await fetchDogDetails(searchResponse.resultIds);

      setDogs((prevDogs) => [
        ...prevDogs,
        ...dogDetails.filter(
          (dog) => !prevDogs.some((dogInstance) => dogInstance.id === dog.id)
        ),
      ]);
      setNextQuery(searchResponse.next || null);
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to load dogs.");
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Error fetching more dogs", error);
      setLoading(false);
    }
  };

  if (loading && dogs.length === 0) {
    return <div>Loading dogs...</div>;
  }

  return (
    <div className="search-page p-6 min-h-screen bg-gradient-to-b from-blue-50 to-gray-200">
      <Navbar />
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md mb-6">
          <p>{error}</p>
          <Button onClick={loadDogs} label="Retry" variant="danger" />
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Browse Shelter Friends!
      </h1>
      <FiltersContainer
        selectedBreed={selectedBreed}
        breeds={breeds}
        onBreedChange={handleBreedChange}
        zipInput={zipInput}
        onZipInputChange={(e) => setZipInput(e.target.value)}
        onZipSearch={handleZipSearch}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <div className="flex justify-center mt-6 mb-6">
        <Button
          onClick={generateMatch}
          disabled={favorites.length === 0 || loading}
          label={loading ? "Finding Your Match..." : "🐶 Find Your Match!"}
          variant="primary"
        />
      </div>

      {matchedDog && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-md text-center">
          <h2 className="text-2xl font-semibold mb-2">You matched with:</h2>
          <div className="flex justify-center">
            <DogCard
              dog={matchedDog}
              location={
                matchedDog && matchedDog.zip_code
                  ? locations.find(
                      (location) => location.zip_code === matchedDog.zip_code
                    ) || undefined
                  : undefined
              }
              isFavorite={false}
              toggleFavorite={() => {}}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setMatchedDog(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            🔍 Continue Searching
          </Button>
        </div>
      )}

      {dogs.length === 0 && !loading && (
        <div className="no-results-message">
          <p className="text-gray-700 text-lg font-medium">
            No dogs found for the selected filters. Please try different
            criteria.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedBreed(null);
              setSelectedZip(null);
              setZipInput("");
              loadDogs();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            🔍 Continue Searching
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs
          .filter((dog) => dog && dog.zip_code) // Filter out null/undefined dogs

          .map((dog) => {
            // console.log("Processing dog:", dog); // Debugging
            const validLocations = locations.filter((loc) => loc !== null);
            const location =
              validLocations.length > 0 && dog.zip_code
                ? validLocations.find((loc) => loc.zip_code === dog.zip_code) ||
                  undefined
                : undefined;

            return (
              <DogCard
                key={dog.id}
                dog={dog}
                location={location}
                isFavorite={favorites.includes(dog.id)}
                toggleFavorite={toggleFavorite}
              />
            );
          })}
      </div>
      {/* Pagination - Load More */}
      <div className="text-center mt-6">
        {nextQuery && (
          <Button
            onClick={loadNextPage}
            disabled={loading || !nextQuery}
            label={loading ? "Loading More Dogs..." : "Load More"}
            variant="secondary"
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
