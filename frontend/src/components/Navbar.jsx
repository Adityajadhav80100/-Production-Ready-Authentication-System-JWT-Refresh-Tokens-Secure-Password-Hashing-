import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-bold text-xl text-blue-600">Auth System</h1>

      <div className="flex gap-4 items-center">
        {/* display the email so the user knows who is signed in */}
        <span className="text-gray-600">{user?.email}</span>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
