import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm,setConfirm]=useState("");
  const [alpacaKey, setAlpacaKey] = useState("");
  const [alpacaSecret, setAlpacaSecret] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("medium");
  const [investmentStyle, setInvestmentStyle] = useState("growth");
  const [isAdmin, setIsAdmin] = useState(false);
  const isFormValid =
    email &&
    username &&
    password &&
    alpacaKey &&
    alpacaSecret &&
    riskTolerance &&
    investmentStyle;

    const handleSignup = async (e) => {
      e.preventDefault();
      if (password !== confirm) {
        alert("Passwords do not match!");
        return;
      }
    
      const payload = {
        email,
        username,
        password,
        alpaca_api_key: alpacaKey,
        alpaca_secret_key: alpacaSecret,
        risk_tolerance: riskTolerance,
        investment_style: investmentStyle,
        is_admin: isAdmin.toString(),
      };
    
      try {
        const res = await fetch("http://127.0.0.1:8000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    
        const data = await res.json();
    
        if (res.ok) {
          // ✅ No token here, just show success and redirect
          alert(data.message || "Signup successful! Please log in now.");
          navigate("/login"); // ✅ Redirect user to login page
        } else {
          alert("Signup failed: " + (data.detail || "Unknown error"));
        }
      } catch (err) {
        console.error(err);
        alert("Signup failed: " + err.message);
      }
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

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Alpaca API Key"
        value={alpacaKey}
        onChange={(e) => setAlpacaKey(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Alpaca Secret Key"
        value={alpacaSecret}
        onChange={(e) => setAlpacaSecret(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <div>
        <label className="block mb-1 font-medium">Risk Tolerance</label>
        <select
          className="w-full p-2 border rounded"
          value={riskTolerance}
          onChange={(e) => setRiskTolerance(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Investment Style</label>
        <select
          className="w-full p-2 border rounded"
          value={investmentStyle}
          onChange={(e) => setInvestmentStyle(e.target.value)}
        >
          <option value="growth">Growth</option>
          <option value="value">Value</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="admin-toggle"
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
        <label htmlFor="admin-toggle" className="text-sm">Is Admin?</label>
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full bg-blue-400 text-black p-2 rounded hover:bg-blue-700"
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