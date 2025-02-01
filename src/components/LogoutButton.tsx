import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import Button from "./Button";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <Button
      onClick={handleLogout}
      label="Logout"
      variant="danger"
    />
  );
};

export default LogoutButton;
