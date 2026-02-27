import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // keep checking until we know the user's role
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white px-6 py-4 rounded shadow">
          <p className="text-gray-700">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // simple guard for non-admin users
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <p className="text-xl font-semibold text-red-600">No admin access</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
