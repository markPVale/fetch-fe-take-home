import React from "react";
import Button from "./Button";
import { Dog } from "../interfaces/dog";
import { Location } from "../interfaces/location";

interface DogCardProps {
  dog: Dog;
  location: Location | undefined;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
}

const DogCard: React.FC<DogCardProps> = ({
  dog,
  location,
  isFavorite,
  toggleFavorite,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative">
        <Button
          onClick={() => toggleFavorite(dog.id)}
          label={isFavorite ? "Unfavorite" : "Favorite"}
          variant={isFavorite ? "danger" : "secondary"}
          fullWidth
        />
        <img
          src={dog.img}
          alt={dog.name}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{dog.name}</h2>
        <p className="text-gray-600">Breed: {dog.breed}</p>
        <p className="text-gray-600">Age: {dog.age}</p>
        <p className="text-gray-600">Zip Code: {dog.zip_code}</p>
        <p className="text-gray-600">
          Location:{" "}
          {location ? `${location.city}, ${location.state}` : "Unknown"}
        </p>

        <button
          onClick={() => toggleFavorite(dog.id)}
          className={`mt-3 w-full py-2 font-semibold rounded-md transition ${
            isFavorite
              ? "bg-rose-300 text-white hover:bg-red-400"
              : "bg-blue-300 hover:bg-blue-400"
          }`}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>
    </div>
  );
};

export default DogCard;
