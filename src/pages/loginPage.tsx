import React, { useState } from "react";
import { loginUser } from "../api/auth";
// import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any previous errors
    setError(null);
    try {
      await loginUser(name, email);
      // Redirect to the Search Page on successful login
      // navigate("/search");
    } catch (error: any) {
      setError(error.response?.data || error.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
      </form>
      {error && <p className="error"></p>}
    </div>
  );
};

export default LoginPage;
