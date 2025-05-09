import { useState, useEffect } from "react";

const Profile = () => {
  const [income, setIncome] = useState("");
  const [goal, setGoal] = useState("");
  const [risk, setRisk] = useState("medium");
  const baseURL=import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("profile"));
    if (saved) {
      setIncome(saved.income || "");
      setGoal(saved.goal || "");
      setRisk(saved.risk || "medium");
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const profileData = { income, goal, risk };
    localStorage.setItem("profile", JSON.stringify(profileData));
    alert("Profile saved!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-semibold mb-6">Your Financial Profile</h2>

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-1">
          <label className="block font-medium mb-2">Annual Income ($)</label>
          <input
            type="number"
            className="w-full p-3 border rounded"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-1">
          <label className="block font-medium mb-2">Risk Tolerance</label>
          <select
            className="w-full p-3 border rounded"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-2">Investment Goal</label>
          <textarea
            rows="4"
            className="w-full p-3 border rounded"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Retire early, buy a house, etc."
            required
          />
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            className="bg-blue-400 hover:bg-blue-700 text-white px-6 py-3 rounded w-full md:w-1/3"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
