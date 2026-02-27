import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  // handle login and move the user to the right protected page
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/login", {
        email,
        password
      });

      const res = await api.get("/auth/me");
      const loggedUser = res.data.user;
      setUser(loggedUser);

      if (loggedUser?.role === "admin" || loggedUser?.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed, please try again";
      setError(message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded text-sm text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full rounded mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 w-full rounded mb-4"
        />

        <button className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700">
          Login
        </button>

        <div className="text-center mt-4">
          <Link to="/register" className="text-blue-600">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
