import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any previous errors
    setError(null);
    try {
      await loginUser(name, email);
      // Redirect to the Search Page on successful login
      navigate("/search");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(
          (error as { response?: { data: string } }).response?.data ||
            error.message ||
            "Login failed"
        );
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="login-page flex items-center justify-center min-h-screen bg-blue-50">
      <div className="text-center">
        <h1 className="sm:text-3xl text-4xl font-semibold text-center mb-8">
          Fetch Your New Best Friend
        </h1>
        <div className="w-full max-w-md sm:p-6 p-8 bg-white shadow-md rounded-lg mx-auto">
          {message && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
              {message}
            </div>
          )}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
            <button
              type="submit"
              className="sm:w-auto w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Log In
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-center text-red-500"></p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
