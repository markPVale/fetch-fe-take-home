import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuthStatus } from "../api/auth"; // You will create this function

// ProtectedRoute component to handle authentication check
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await checkAuthStatus(); // Check if user is authenticated
        setIsAuthenticated(authenticated);
      } catch (error) {
        setIsAuthenticated(false); // If there's an error (unauthenticated), set as false
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading state while checking authentication
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />; // Redirect to login if not authenticated
  }

  return <>{children}</>; // If authenticated, render the protected page
};

export default ProtectedRoute;
