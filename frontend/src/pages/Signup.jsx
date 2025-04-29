import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match!");
    // 🔐 Simulate registration
    localStorage.setItem("token", "mock-token");
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">Create Account</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-black p-2 rounded hover:bg-blue-700"
      >
        Sign Up
      </button>
      <p className="text-sm text-center">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
};

export default Signup;
