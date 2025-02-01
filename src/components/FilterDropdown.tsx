import React from "react";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <label className="text-sm font-medium text-gray-700 w-full sm:w-auto">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring focus:border-blue-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
