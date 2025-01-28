import React, { useEffect, useState } from "react";
import {
  fetchBreeds,
  fetchDogs,
  fetchDogDetails,
  fetchMatch,
} from "../api/dogs";
import { fetchLocations } from "../api/locations";
import { Dog } from "../interfaces/dog";
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
  const [selectedZip, setSelectedZip] = useState<string | null>(null);
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

  if (error) {
    return <div>{error}</div>;
  }

  if (loading && dogs.length === 0) {
    return <div>Loading dogs...</div>;
  }

  return (
    <div className="search-page">
      <h1>Search Dogs</h1>
      {/* Filter-by-breed dropdown */}
      <label htmlFor="breed">Filter by Breed:</label>
      <select
        id="breed"
        value={selectedBreed || ""}
        onChange={handleBreedChange}
      >
        <option value="">All Breeds</option>
        {breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>

      {/* Filter-by-location */}
      <label htmlFor="zip">Filter by Zip Code:</label>
      <input
        id="zip"
        type="text"
        value={selectedZip || ""}
        onChange={(e) => setSelectedZip(e.target.value)}
        // placeholder="Enter a Zip Code"
      />

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
      <label htmlFor="sort">Sort by</label>
      <select id="sort" value={sortOrder} onChange={handleSortChange}>
        <option value="breed:asc">Breed (A - Z)</option>
        <option value="breed:desc">Breed (Z - A)</option>
      </select>

      {/* No Results Message */}
      {dogs.length === 0 && !loading && (
        <div className="no-results-message">
          No dogs found for the selected filters. Please try different criteria.
        </div>
      )}

      {/* Dog results */}
      <ul>
        {dogs.map((dog) => {
          const location = locations.find(
            (locationInstance) => locationInstance.zip_code === dog.zip_code
          );
          console.log("Dog: ", dog);
          console.log("Location Found: ", location);
          return (
            <li
              key={dog.id}
              style={{
                border: favorites.includes(dog.id)
                  ? "2px solid gold"
                  : "1px solid gray",
                padding: "1rem",
                borderRadius: "5px",
              }}
            >
              <img src={dog.img} alt={dog.name} />
              <p>Name: {dog.name}</p>
              <p>Breed: {dog.breed}</p>
              <p>Age: {dog.age}</p>
              <p>Zip Code: {dog.zip_code}</p>
              <p>
                Location:{" "}
                {location
                  ? `${location.city}, ${location.state}`
                  : "Unknown Location"}
              </p>
              {/* Favorite Button */}
              <button onClick={() => toggleFavorite(dog.id)}>
                {favorites.includes(dog.id) ? "Unfavorite" : "Favorite"}
              </button>
            </li>
          );
        })}
      </ul>

      <button onClick={generateMatch} disabled={favorites.length === 0}>
        Generate Match
      </button>

      {/* pagination */}
      {nextQuery && (
        <button onClick={loadNextPage} disabled={loading || !nextQuery}>
          {loading ? "Loading More Dogs..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default SearchPage;
