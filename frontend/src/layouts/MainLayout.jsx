import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full px-8 py-10 max-w-screen-2xl mx-auto">
        {/* Force full width up to 2xl and center inside viewport */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
