import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuthStatus } from "../api/auth";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await checkAuthStatus();
        setIsAuthenticated(authenticated);
      } catch (error) {
        setIsAuthenticated(false);
        console.warn(
          "Authentication check failed:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        state={{ message: "Your session expired. Please log in again." }}
        replace
      />
    ); // Redirect to login if not authenticated
  }

  return <>{children}</>;
};

export default ProtectedRoute;
