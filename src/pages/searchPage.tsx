import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import DogCard from "../components/DogCard";
import FiltersContainer from "../components/FiltersContainer";
import { useDogs } from "../hooks/useDogs";
import { getDogLocation } from "../utils/helpers";

const SearchPage: React.FC = () => {
  const {
    breeds,
    dogs,
    locations,
    favorites,
    error,
    loading,
    nextQuery,
    selectedBreed,
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
  } = useDogs();

  const [zipInput, setZipInput] = useState<string>("");

  const handleZipSearch = () => setSelectedZip(zipInput);

  if (loading && dogs.length === 0) return <div>Loading dogs...</div>;

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
        onBreedChange={(e) => setSelectedBreed(e.target.value || null)}
        zipInput={zipInput}
        onZipInputChange={(e) => setZipInput(e.target.value)}
        onZipSearch={handleZipSearch}
        sortOrder={sortOrder}
        onSortChange={(e) => setSortOrder(e.target.value)}
      />

      <div className="flex justify-center mt-6 mb-6">
        <div className="relative group">
          <Button
            onClick={generateMatch}
            disabled={!favorites.length || loading}
            label="🐶 Find Your Match!"
            variant="primary"
          />
          {!favorites.length && (
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs px-3 py-1 rounded">
              Select at least one favorite to generate a match!
            </div>
          )}
        </div>
      </div>
      {matchedDog && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-md text-center">
          <h2 className="text-2xl font-semibold mb-2">You matched with:</h2>
          <div className="flex justify-center">
            <DogCard
              dog={matchedDog}
              location={
                matchedDog.zip_code
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.length === 0 && !loading && (
          <div className="no-results-message text-center mt-6">
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
        {dogs.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            location={getDogLocation(dog, locations)}
            isFavorite={favorites.includes(dog.id)}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {nextQuery && (
        <div className="text-center mt-6">
          <Button
            onClick={loadNextPage}
            disabled={loading}
            label="Load More"
            variant="secondary"
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
