import React from "react";
import { ButtonProps } from "../interfaces/buttonProps";


const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = "primary",
  icon,
  fullWidth = false,
  className = "",
  children,
}) => {
  const baseStyles = `px-6 py-3 text-lg font-semibold rounded-md transition duration-300`;
  const disabledStyles = `bg-gray-400 cursor-not-allowed text-gray-200`;
  const variants = {
    primary: `bg-green-600 hover:bg-green-700 text-white shadow-md`,
    secondary: `bg-blue-600 hover:bg-blue-700 text-white`,
    danger: `bg-red-500 hover:bg-red-600 text-white`,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${fullWidth ? "w-full" : ""} ${
        disabled ? disabledStyles : variants[variant]
      } ${className} flex items-center justify-center gap-2`}
    >
      {icon && <span>{icon}</span>}
      {children || label}
    </button>
  );
};

export default Button;
