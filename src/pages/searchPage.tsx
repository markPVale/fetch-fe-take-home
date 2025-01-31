import React, { useEffect, useState } from "react";
import {
  fetchBreeds,
  fetchDogs,
  fetchDogDetails,
  fetchMatch,
} from "../api/dogs";
import { fetchLocations } from "../api/locations";
import { Dog } from "../interfaces/dog";
import DogCard from "../components/DogCard"; // Import the new DogCard component
import { Location } from "../interfaces/location";

const SearchPage: React.FC = () => {
  // Replace `any` with the proper Dog interface if defined
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextQuery, setNextQuery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [breeds, setBreeds] = useState<string[]>([]); // List of dog breeds
  const [sortOrder, setSortOrder] = useState<string>("breed:asc"); // Default to ascending order
  const [favorites, setFavorites] = useState<string[]>([]);
  // Location state
  const [zipInput, setZipInput] = useState<string>("");
  const [selectedZip, setSelectedZip] = useState<string | null>(null);
  const handleZipSearch = () => {
    setSelectedZip(zipInput); // Apply the search filter
  };
  // const [selectedState, setSelectedState] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);

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
  }, []); // Run once on component mount

  useEffect(() => {
    loadDogs();
  }, [selectedBreed, sortOrder, selectedZip]); // Reload dogs when breed or sort order changes

  const loadDogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBreed) params.append("breeds", selectedBreed);
      if (sortOrder) params.append("sort", sortOrder);
      if (selectedZip) params.append("zipCodes", selectedZip);
      // if (selectedState) params.append("states", selectedState);

      const queryParams = `?${params.toString()}`;
      const searchResponse = await fetchDogs(queryParams);
      const dogDetails = await fetchDogDetails(searchResponse.resultIds);

      const zipCodes = [...new Set(dogDetails.map((dog) => dog.zip_code))];
      if (zipCodes.length > 0) {
        const locationData = await fetchLocations(zipCodes);
        setLocations(locationData);
      } else {
        setLocations([]); // Clear locations if no zip codes are returned
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
      return <div className="error-banner">{error}</div>;
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  const generateMatch = async () => {
    try {
      const matchedDogId = await fetchMatch(favorites);
      const [match] = await fetchDogDetails([matchedDogId]);
      alert(`You matched with ${match.name}, a ${match.breed}!`);
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
      ]); // Append new dogs to the existing list);
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
      {/* Error Handling */}
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md mb-6">
          <p>{error}</p>
          <button
            onClick={loadDogs}
            className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Dogs</h1>
      {/* Filter-by-breed dropdown */}
      <div className="flex flex-col">
        <label htmlFor="breed" className="text-sm font-medium text-gray-700">
          Filter by Breed:
        </label>
        <select
          id="breed"
          value={selectedBreed || ""}
          onChange={handleBreedChange}
          className="px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
        >
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      {/* Filter-by-location */}
      <div className="flex flex-col">
        <label htmlFor="zip" className="text-sm font-medium text-gray-700">
          Filter by Zip Code:
        </label>
        <input
          id="zip"
          type="text"
          value={zipInput}
          onChange={(e) => setZipInput(e.target.value)}
          placeholder="Enter a Zip Code"
          className="px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
        />
        <button
          onClick={handleZipSearch}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Highlight active filters */}
      <div className="active-filters">
        {selectedBreed && (
          <span className="filter-tag">Breed: {selectedBreed}</span>
        )}
        {selectedZip && (
          <span className="filter-tag">Breed: {selectedZip}</span>
        )}
      </div>

      {/* Sort-by dropdown */}
      <div className="flex flex-col">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort by
        </label>
        <select
          id="sort"
          value={sortOrder}
          onChange={handleSortChange}
          className="px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
        >
          <option value="breed:asc">Breed (A - Z)</option>
          <option value="breed:desc">Breed (Z - A)</option>
        </select>
      </div>
      {/* No Results Message */}
      {dogs.length === 0 && !loading && (
        <div className="no-results-message">
          No dogs found for the selected filters. Please try different criteria.
        </div>
      )}

      {/* Dog results */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.map((dog) => {
          const location = locations.find(
            (locationInstance) => locationInstance.zip_code === dog.zip_code
          );
          console.log("Dog: ", dog);
          console.log("Location Found: ", location);
          return (
            <li
              key={dog.id}
              className={`p-4 rounded-lg shadow-md ${
                favorites.includes(dog.id)
                  ? "border-2 border-yellow-400"
                  : "border"
              }`}
            >
              <img
                src={dog.img}
                alt={dog.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold">{dog.name}</h2>
              <p className="text-gray-600">Breed: {dog.breed}</p>
              <p className="text-gray-600">Age: {dog.age}</p>
              <p className="text-gray-600">Zip Code: {dog.zip_code}</p>
              <p className="text-gray-600">
                Location:{" "}
                {location
                  ? `${location.city}, ${location.state}`
                  : "Unknown Location"}
              </p>
              <button
                onClick={() => toggleFavorite(dog.id)}
                className="mt-2 px-3 py-1 rounded-md text-white font-semibold bg-red-500 hover:bg-red-600"
              >
                {favorites.includes(dog.id) ? "❤️ Unfavorite" : "🤍 Favorite"}
              </button>
            </li>
          );
        })}
      </div>
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.map((dog) => {
          const location = locations.find(
            (locationInstance) => locationInstance.zip_code === dog.zip_code
          );

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

      <button onClick={generateMatch} disabled={favorites.length === 0}>
        Generate Match
      </button>

      {/* pagination */}
      <div className="text-center mt-6">
        {nextQuery && (
          <button
            onClick={loadNextPage}
            disabled={loading || !nextQuery}
            className={`px-4 py-2 rounded-md font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Loading More Dogs..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
