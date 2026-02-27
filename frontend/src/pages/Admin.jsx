import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

const Admin = () => {
  const [hasAccess, setHasAccess] = useState(null);

  // verify with the backend whether this user has admin rights
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        await api.get("/auth/adminAccess");
        setHasAccess(true);
      } catch {
        setHasAccess(false);
      }
    };

    loadAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-10 flex justify-center">
        <div className="bg-white p-8 shadow rounded-xl w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
          {/* show admin label based on API response */}
          {hasAccess === null && (
            <p className="text-gray-500">Checking admin access...</p>
          )}
          {hasAccess === true && (
            <p className="text-green-600 font-semibold">Admin Access Granted</p>
          )}
          {hasAccess === false && (
            <p className="text-red-600 font-semibold">No admin access</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
