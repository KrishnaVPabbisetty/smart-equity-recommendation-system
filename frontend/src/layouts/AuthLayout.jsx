import { Outlet } from "react-router-dom";
import logo from "../assets/logo.png"; // Corrected the path

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Left side (branding or background image if desired) */}
      <div className="hidden md:flex items-center justify-center bg-blue-100">
        {/* Add logo inside the left container */}
        <img 
          src={logo} 
          alt="logo" 
          className="object-cover w-full h-full" 
        />
      </div>

      {/* Right side (form container) */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
