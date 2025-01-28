import React, { useEffect, useState } from "react";
import {
  fetchBreeds,
  fetchDogs,
  fetchDogDetails,
  fetchMatch,
} from "../api/dogs";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

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
    const loadDogs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedBreed) params.append("breeds", selectedBreed);
        if (sortOrder) params.append("sort", sortOrder);

        const queryParams = `?${params.toString()}`;
        const searchResponse = await fetchDogs(queryParams);
        const dogDetails = await fetchDogDetails(searchResponse.resultIds);

        setDogs(dogDetails);
        setNextQuery(searchResponse.next || null);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message || "Failed to load dogs.");
        } else {
          setError("An unknown error occurred.");
        }
        console.error("Error fetching dogs", error);
        setLoading(false);
      }
    };

    loadDogs();
  }, [selectedBreed, sortOrder]); // Reload dogs when breed or sort order changes

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
      setDogs((prevDogs) => [...prevDogs, ...dogDetails]);
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

      {/* Sort-by dropdown */}
      <label htmlFor="sort">Sort by</label>
      <select id="sort" value={sortOrder} onChange={handleSortChange}>
        <option value="breed:asc">Breed (A - Z)</option>
        <option value="breed:desc">Breed (Z - A)</option>
      </select>
      <ul>
        {dogs.map((dog) => (
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
            {/* Favorite Button */}
            <button onClick={() => toggleFavorite(dog.id)}>
              {favorites.includes(dog.id) ? "Unfavorite" : "Favorite"}
            </button>
          </li>
        ))}
      </ul>

      <button onClick={generateMatch} disabled={favorites.length === 0}>
        Generate Match
      </button>

      {/* pagination */}
      {nextQuery && (
        <button onClick={loadNextPage} disabled={loading || !nextQuery}>
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default SearchPage;
