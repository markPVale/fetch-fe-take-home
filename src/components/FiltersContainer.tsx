import React from "react";
import FilterInput from "./FilterInput";
import FilterDropdown from "./FilterDropdown";

interface FiltersProps {
  selectedBreed: string | null;
  breeds: string[];
  onBreedChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  zipInput: string;
  onZipInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onZipSearch: () => void;

  sortOrder: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedBreed,
  breeds,
  onBreedChange,
  zipInput,
  onZipInputChange,
  onZipSearch,
  sortOrder,
  onSortChange
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col space-y-4">
      {/* Breed Filter */}
      <FilterDropdown
        label="Filter by Breed:"
        value={selectedBreed || ""}
        onChange={onBreedChange}
        options={[{ label: "All Breeds", value: "" }, ...breeds.map((breed) => ({ label: breed, value: breed }))]}
      />

      {/* Zip Code Filter */}
      <FilterInput
        label="Filter by Zip Code:"
        value={zipInput}
        onChange={onZipInputChange}
        placeholder="Enter a Zip Code"
        hasButton={true}
        onButtonClick={onZipSearch}
        buttonText="Search"
      />

      {/* Sort Filter */}
      <FilterDropdown
        label="Sort by:"
        value={sortOrder}
        onChange={onSortChange}
        options={[
          { label: "Breed (A - Z)", value: "breed:asc" },
          { label: "Breed (Z - A)", value: "breed:desc" }
        ]}
      />
    </div>
  );
};

export default Filters;
