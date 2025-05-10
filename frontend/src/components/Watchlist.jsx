import { useEffect, useState, useContext } from "react";
import { MarketDataContext } from "../contexts/MarketDataContext";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [prices, setPrices] = useState({}); // Store the prices here
  const token = localStorage.getItem("token");
  const { subscribeToSymbol, getLatestPrice } = useContext(MarketDataContext);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fetch watchlist symbols from backend
  const fetchWatchlist = async () => {
    try {
      const res = await fetch(`${baseURL}/user/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const symbols = data.assets.map((a) => a.symbol);
      setWatchlist(symbols);
      symbols.forEach(subscribeToSymbol);
    } catch (err) {
      console.error("Error loading watchlist:", err);
    }
  };

  // Fetch prices for all symbols in the watchlist
  useEffect(() => {
    const fetchPrices = async () => {
      const prices = {};
      for (const symbol of watchlist) {
        const { price } = await getLatestPrice(symbol);
        prices[symbol] = price;
      }
      setPrices(prices); // Update the state with the fetched prices
    };

    if (watchlist.length > 0) {
      fetchPrices(); // Fetch prices once the watchlist is populated
    }
  }, [watchlist, getLatestPrice]);

  // Fetch the watchlist data when the component mounts
  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Add a new symbol to the watchlist
  const handleAddSymbol = async () => {
    const newSymbol = input.trim().toUpperCase();
    if (!newSymbol || watchlist.includes(newSymbol)) return;
  
    // Add the new symbol to the watchlist
    const updatedWatchlist = [...watchlist, newSymbol];
  
    // Send the updated watchlist to the backend (POST request)
    try {
      const res = await fetch(`${baseURL}/user/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbols: updatedWatchlist }),
      });
  
      const data = await res.json();
      console.log("Watchlist updated:", data);
  
      // Fetch the updated watchlist
      fetchWatchlist(); // This will fetch the latest symbols from the backend
      setInput(""); // Clear the input field
    } catch (err) {
      console.error("Failed to update watchlist:", err);
    }
  };
  
  const handleRemove = async (symbol) => {
    try {
      await fetch(`${baseURL}/user/watchlist/${symbol}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the symbol from the watchlist array
      setWatchlist((prev) => prev.filter((s) => s !== symbol)); // Filter out the removed symbol from the state
    } catch (err) {
      console.error("Failed to remove symbol:", err);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Watchlist</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-sm font-medium text-gray-600"
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      {editing && (
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="flex-grow p-2 border rounded mr-2"
            placeholder="Enter a symbol"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSymbol()}
          />
          <button onClick={handleAddSymbol} className="text-xl">
            ➕
          </button>
        </div>
      )}

      <ul className="space-y-2 max-h-[300px] overflow-y-auto">
        {watchlist.map((symbol) => (
          <li key={symbol} className="flex justify-between items-center">
            <span className="flex items-center gap-4">
              <span className="underline font-medium">{symbol}</span>
              <span className="text-sm">
                ${prices[symbol] ? prices[symbol].toFixed(2) : "—"}
              </span>
            </span>
            {editing && (
              <button onClick={() => handleRemove(symbol)} className="text-red-500">
                🗑️
              </button>
            )}

          </li>
        ))}
      </ul>
    </div>
  );
}
