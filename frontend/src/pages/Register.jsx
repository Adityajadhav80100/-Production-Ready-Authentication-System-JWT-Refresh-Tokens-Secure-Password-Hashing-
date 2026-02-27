import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // show a friendly message and then send the user back to login
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", { email, password });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      alert(err.response?.data?.message || "Register Failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm text-center">
            Verification email sent. Check your inbox.
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

        <button className="bg-green-600 text-white w-full p-3 rounded hover:bg-green-700">
          Register
        </button>

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600">
            Already have account?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
