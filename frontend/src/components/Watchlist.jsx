// // // // import { useEffect, useState, useContext } from "react";
// // // // import { MarketDataContext } from "../contexts/MarketDataContext";

// // // // export default function Watchlist() {
// // // //   const [watchlist, setWatchlist] = useState([]);
// // // //   const [input, setInput] = useState("");
// // // //   const [editing, setEditing] = useState(false);
// // // //   const token = localStorage.getItem("token");

// // // //   const {
// // // //     subscribeToSymbol,
// // // //     unsubscribeFromSymbol,
// // // //     getLatestPrice
// // // //   } = useContext(MarketDataContext);

// // // //   const fetchWatchlist = async () => {
// // // //     try {
// // // //       const res = await fetch("http://127.0.0.1:8000/user/watchlist", {
// // // //         headers: { Authorization: `Bearer ${token}` },
// // // //       });
// // // //       const data = await res.json();
// // // //       const symbols = data.assets.map((a) => a.symbol);
// // // //       setWatchlist(symbols);

// // // //       symbols.forEach(subscribeToSymbol);
// // // //     } catch (err) {
// // // //       console.error("Error loading watchlist:", err);
// // // //     }
// // // //   };

// // // //   const updateBackendWatchlist = async (symbols) => {
// // // //     try {
// // // //       await fetch("http://127.0.0.1:8000/user/watchlist", {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: `Bearer ${token}`,
// // // //         },
// // // //         body: JSON.stringify({ symbols }),
// // // //       });
// // // //     } catch (err) {
// // // //       console.error("Failed to update watchlist:", err);
// // // //     }
// // // //   };

// // // //   const handleAddSymbol = async () => {
// // // //     const newSymbol = input.trim().toUpperCase();
// // // //     if (!newSymbol || watchlist.includes(newSymbol)) return;

// // // //     const updated = [...watchlist, newSymbol];
// // // //     await updateBackendWatchlist(updated);
// // // //     subscribeToSymbol(newSymbol);
// // // //     setWatchlist(updated);
// // // //     setInput("");
// // // //   };

// // // //   const handleRemove = async (symbol) => {
// // // //     try {
// // // //       await fetch(`http://127.0.0.1:8000/user/watchlist/${symbol}`, {
// // // //         method: "DELETE",
// // // //         headers: { Authorization: `Bearer ${token}` },
// // // //       });
// // // //       unsubscribeFromSymbol(symbol);
// // // //       setWatchlist((prev) => prev.filter((s) => s !== symbol));
// // // //     } catch (err) {
// // // //       console.error("Failed to remove symbol:", err);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchWatchlist();
// // // //   }, []);

// // // //   return (
// // // //     <div className="bg-white rounded-lg shadow p-4">
// // // //       <div className="flex justify-between items-center mb-4">
// // // //         <h2 className="font-semibold text-lg">Watchlist</h2>
// // // //         <button
// // // //           onClick={() => setEditing(!editing)}
// // // //           className="text-sm font-medium text-gray-600"
// // // //         >
// // // //           {editing ? "Done" : "Edit"}
// // // //         </button>
// // // //       </div>

// // // //       {editing && (
// // // //         <div className="flex items-center mb-4">
// // // //           <input
// // // //             type="text"
// // // //             className="flex-grow p-2 border rounded mr-2"
// // // //             placeholder="Enter a symbol"
// // // //             value={input}
// // // //             onChange={(e) => setInput(e.target.value)}
// // // //             onKeyDown={(e) => e.key === "Enter" && handleAddSymbol()}
// // // //           />
// // // //           <button onClick={handleAddSymbol} className="text-xl">➕</button>
// // // //         </div>
// // // //       )}

// // // //       <ul className="space-y-2 max-h-[300px] overflow-y-auto">
// // // //         {watchlist.map((symbol) => {
// // // //           const { price = 0, changePercent = 0 } = getLatestPrice(symbol) || {};
// // // //           return (
// // // //             <li key={symbol} className="flex justify-between items-center">
// // // //               <span className="flex items-center gap-4">
// // // //                 <span className="underline font-medium">{symbol}</span>
// // // //                 <span className={`text-sm ${changePercent < 0 ? "text-red-500" : "text-green-600"}`}>
// // // //                   {changePercent > 0 ? "+" : ""}
// // // //                   {(changePercent * 100).toFixed(2)}%
// // // //                 </span>
// // // //                 <span className="text-sm">${price.toFixed(2)}</span>
// // // //               </span>
// // // //               {editing && (
// // // //                 <button onClick={() => handleRemove(symbol)} className="text-red-500">
// // // //                   🗑️
// // // //                 </button>
// // // //               )}
// // // //             </li>
// // // //           );
// // // //         })}
// // // //       </ul>
// // // //     </div>
// // // //   );
// // // // }

// // // import { useEffect, useState, useContext } from "react";
// // // import { MarketDataContext } from "../contexts/MarketDataContext";

// // // export default function Watchlist() {
// // //   const [watchlist, setWatchlist] = useState([]);
// // //   const [input, setInput] = useState("");
// // //   const [editing, setEditing] = useState(false);
// // //   const token = localStorage.getItem("token");

// // //   const { subscribeToSymbol, getLatestPrice } = useContext(MarketDataContext);

// // //   const fetchWatchlist = async () => {
// // //     try {
// // //       const res = await fetch("http://127.0.0.1:8000/user/watchlist", {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       const data = await res.json();
// // //       const symbols = data.assets.map((a) => a.symbol);
// // //       setWatchlist(symbols);

// // //       // Subscribe and fetch latest prices
// // //       symbols.forEach(subscribeToSymbol);
// // //     } catch (err) {
// // //       console.error("Error loading watchlist:", err);
// // //     }
// // //   };

// // //   const updateBackendWatchlist = async (symbols) => {
// // //     try {
// // //       await fetch("http://127.0.0.1:8000/user/watchlist", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify({ symbols }),
// // //       });
// // //     } catch (err) {
// // //       console.error("Failed to update watchlist:", err);
// // //     }
// // //   };

// // //   const handleAddSymbol = async () => {
// // //     const newSymbol = input.trim().toUpperCase();
// // //     if (!newSymbol || watchlist.includes(newSymbol)) return;

// // //     const updated = [...watchlist, newSymbol];
// // //     await updateBackendWatchlist(updated);
// // //     setInput("");
// // //     setWatchlist(updated);
// // //     subscribeToSymbol(newSymbol);
// // //   };

// // //   const handleRemove = async (symbol) => {
// // //     try {
// // //       await fetch(`http://127.0.0.1:8000/user/watchlist/${symbol}`, {
// // //         method: "DELETE",
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       setWatchlist((prev) => prev.filter((s) => s !== symbol));
// // //     } catch (err) {
// // //       console.error("Failed to remove symbol:", err);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchWatchlist();
// // //   }, []);

// // //   return (
// // //     <div className="bg-white rounded-lg shadow p-4">
// // //       <div className="flex justify-between items-center mb-4">
// // //         <h2 className="font-semibold text-lg">Watchlist</h2>
// // //         <button onClick={() => setEditing(!editing)} className="text-sm font-medium text-gray-600">
// // //           {editing ? "Done" : "Edit"}
// // //         </button>
// // //       </div>

// // //       {editing && (
// // //         <div className="flex items-center mb-4">
// // //           <input
// // //             type="text"
// // //             className="flex-grow p-2 border rounded mr-2"
// // //             placeholder="Enter a symbol"
// // //             value={input}
// // //             onChange={(e) => setInput(e.target.value)}
// // //             onKeyDown={(e) => e.key === "Enter" && handleAddSymbol()}
// // //           />
// // //           <button onClick={handleAddSymbol} className="text-xl">➕</button>
// // //         </div>
// // //       )}

// // //       <ul className="space-y-2 max-h-[300px] overflow-y-auto">
// // //         {watchlist.map((symbol) => {
// // //           const { price, stale } = getLatestPrice(symbol);
// // //           return (
// // //             <li key={symbol} className="flex justify-between items-center">
// // //               <span className="flex items-center gap-4">
// // //                 <span className="underline font-medium">{symbol}</span>
// // //                 <span className={`text-sm ${stale ? "text-gray-400" : "text-green-600"}`}>
// // //                   ${parseFloat(price).toFixed(2)}
// // //                 </span>
// // //                 {stale && (
// // //                   <span className="text-xs italic text-gray-400">(stale)</span>
// // //                 )}
// // //               </span>
// // //               {editing && (
// // //                 <button onClick={() => handleRemove(symbol)} className="text-red-500">
// // //                   🗑️
// // //                 </button>
// // //               )}
// // //             </li>
// // //           );
// // //         })}
// // //       </ul>
// // //     </div>
// // //   );
// // // }
// import { useEffect, useState, useContext } from "react";
// import { MarketDataContext } from "../contexts/MarketDataContext";

// export default function Watchlist() {
//   const [watchlist, setWatchlist] = useState([]);
//   const [input, setInput] = useState("");
//   const [editing, setEditing] = useState(false);
//   const token = localStorage.getItem("token");
//   const { subscribeToSymbol, getLatestPrice } = useContext(MarketDataContext);
//   const baseURL=import.meta.env.VITE_API_BASE_URL;

//   const fetchWatchlist = async () => {
//     try {
//       const res = await fetch(`${baseURL}/user/watchlist`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       const symbols = data.assets.map((a) => a.symbol);
//       setWatchlist(symbols);
//       symbols.forEach(subscribeToSymbol);
//     } catch (err) {
//       console.error("Error loading watchlist:", err);
//     }
//   };

//   const updateBackendWatchlist = async (symbols) => {
//     try {
//       await fetch(`${baseURL}/user/watchlist`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ symbols }),
//       });
//     } catch (err) {
//       console.error("Failed to update watchlist:", err);
//     }
//   };

//   const handleAddSymbol = async () => {
//     const newSymbol = input.trim().toUpperCase();
//     if (!newSymbol || watchlist.includes(newSymbol)) return;

//     const updated = [...watchlist, newSymbol];
//     await updateBackendWatchlist(updated);
//     setInput("");
//     fetchWatchlist();
//   };

//   const handleRemove = async (symbol) => {
//     try {
//       await fetch(`${baseURL}/user/watchlist/${symbol}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setWatchlist((prev) => prev.filter((s) => s !== symbol));
//     } catch (err) {
//       console.error("Failed to remove symbol:", err);
//     }
//   };

//   useEffect(() => {
//     fetchWatchlist();
//   }, []);

//   return (
//     <div className="bg-white rounded-lg shadow p-4 h-full">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="font-semibold text-lg">Watchlist</h2>
//         <button onClick={() => setEditing(!editing)} className="text-sm font-medium text-gray-600">
//           {editing ? "Done" : "Edit"}
//         </button>
//       </div>

//       {editing && (
//         <div className="flex items-center mb-4">
//           <input
//             type="text"
//             className="flex-grow p-2 border rounded mr-2"
//             placeholder="Enter a symbol"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleAddSymbol()}
//           />
//           <button onClick={handleAddSymbol} className="text-xl">➕</button>
//         </div>
//       )}

//       <ul className="space-y-2 max-h-[300px] overflow-y-auto">
//         {watchlist.map((symbol) => {
//           const { price, stale } = getLatestPrice(symbol);
//           return (
//             <li key={symbol} className="flex justify-between items-center">
//               <span className="flex items-center gap-4">
//                 <span className="underline font-medium">{symbol}</span>
//                 <span className="text-sm ${stale ? 'text-gray-400 italic' : ''}">
//                   ${price?.toFixed(2) ?? "—"}
//                 </span>
//               </span>
//               {editing && (
//                 <button onClick={() => handleRemove(symbol)} className="text-red-500">
//                   🗑️
//                 </button>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }
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

    const updated = [...watchlist, newSymbol];
    await updateBackendWatchlist(updated);
    setInput("");
    fetchWatchlist(); // Fetch updated watchlist
  };

  // Remove a symbol from the watchlist
  const handleRemove = async (symbol) => {
    try {
      await fetch(`${baseURL}/user/watchlist/${symbol}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist((prev) => prev.filter((s) => s !== symbol)); // Remove the symbol from watchlist
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
