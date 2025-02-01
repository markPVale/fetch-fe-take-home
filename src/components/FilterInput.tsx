import React from "react";

interface FilterInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  hasButton?: boolean;
  onButtonClick?: () => void;
  buttonText?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  hasButton = false,
  onButtonClick,
  buttonText = "Search",
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <label className="text-sm font-medium text-gray-700 w-full sm:w-auto">
        {label}
      </label>
      <div className="flex w-full sm:w-64">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring focus:border-blue-400"
        />
        {hasButton && onButtonClick && (
          <button
            onClick={onButtonClick}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 transition"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterInput;
