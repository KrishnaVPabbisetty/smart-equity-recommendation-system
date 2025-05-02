import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-blue-400 text-white px-6 py-4 flex justify-between items-center ">
      <div className="text-xl font-semibold cursor-pointer" onClick={() => navigate("/dashboard")}>
        Smart Equity
      </div>
      <nav className="flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="text-white">Dashboard</button>
        <button onClick={() => navigate("/profile")} className="text-white">Profile</button>
        <button onClick={handleLogout} className="text-white">Logout</button>
        {localStorage.getItem("is_admin") === "true" && (
        <button onClick={() => navigate("/admin")} className="text-white">
          Admin
        </button>
)}
      </nav>
    </header>
  );
};

export default Navbar;
