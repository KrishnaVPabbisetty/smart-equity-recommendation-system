import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);
  
    try {
      const res = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // ✅ correct type for OAuth2
        },
        body: body,
      });
  
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("is_admin",data.is_admin)
        navigate("/dashboard");
      } else {
        alert("Login failed: " + (data.detail || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Login failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">Log In</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-400 hover:bg-blue-700 text-black p-2 rounded"
      >
        Log In
      </button>

      <p className="text-sm text-center">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  );
};

export default Login;
