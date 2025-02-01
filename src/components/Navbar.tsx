import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar: React.FC = () => {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <Link to="/search" className="text-xl font-bold">
        Fetch Dogs
      </Link>
      <LogoutButton />
    </nav>
  );
};

export default Navbar;
