import { useState } from "react";
import api from "../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Reset link sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96 text-center"
      >
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

        {message && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full rounded mb-4"
          required
        />

        <button className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
