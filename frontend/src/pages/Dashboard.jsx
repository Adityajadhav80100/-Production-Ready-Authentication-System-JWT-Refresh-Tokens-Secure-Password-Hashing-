import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* keep the navbar visible so logout is easy */}
      <Navbar />

      <div className="p-10 flex justify-center">
        <div className="bg-white p-8 shadow rounded-xl w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          {/* show the current user's email */}
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
