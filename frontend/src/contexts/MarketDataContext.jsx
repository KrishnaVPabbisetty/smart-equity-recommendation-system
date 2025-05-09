// // import { createContext, useContext, useState, useEffect, useRef } from "react";

// // export const MarketDataContext = createContext();

// // export function MarketDataProvider({ children }) {
// //   const [prices, setPrices] = useState({});
// //   const wsRef = useRef(null);
// //   const timeoutRefs = useRef({});
// //   const subscribedSymbols = useRef(new Set());

// //   const getToken = () => localStorage.getItem("token");

// //   const fetchFallbackPrices = async (symbols) => {
// //     if (!symbols.length) return;
// //     try {
// //       const res = await fetch(
// //         `http://127.0.0.1:8000/user/prices?symbols=${symbols.join(",")}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${getToken()}`,
// //           },
// //         }
// //       );
// //       const data = await res.json();
// //       if (Array.isArray(data)) {
// //         const updated = {};
// //         data.forEach(({ symbol, price }) => {
// //           updated[symbol.toUpperCase()] = { price, stale: true };
// //         });
// //         setPrices((prev) => ({ ...prev, ...updated }));
// //       }
// //     } catch (err) {
// //       console.error("REST fallback failed:", err);
// //     }
// //   };

// //   const subscribeToSymbol = (symbol) => {
// //     const sym = symbol.toUpperCase();
// //     if (subscribedSymbols.current.has(sym)) return;

// //     subscribedSymbols.current.add(sym);

// //     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
// //       wsRef.current.send(
// //         JSON.stringify({
// //           action: "subscribe",
// //           symbols: [sym],
// //           token: getToken(),
// //         })
// //       );
// //     } else {
// //       fetchFallbackPrices([sym]);
// //     }
// //   };

// //   const getLatestPrice = (symbol) => {
// //     const sym = symbol.toUpperCase();
// //     return prices[sym] || { price: 0, stale: true };
// //   };

// //   useEffect(() => {
// //     const ws = new WebSocket("ws://127.0.0.1:8000/ws/market");
// //     wsRef.current = ws;

// //     ws.onopen = () => {
// //       console.log("✅ Market WebSocket connected");
// //     };

// //     ws.onmessage = (event) => {
// //       try {
// //         const parsed = JSON.parse(event.data);

// //         if (typeof parsed === "object" && parsed.type === "error") {
// //           console.warn("Server error:", parsed.message);
// //           return;
// //         }

// //         if (Array.isArray(parsed)) {
// //           parsed.forEach((msg) => {
// //             if (msg.T === "t") {
// //               const { S: symbol, p: price } = msg;
// //               setPrices((prev) => ({
// //                 ...prev,
// //                 [symbol]: { price, stale: false },
// //               }));

// //               clearTimeout(timeoutRefs.current[symbol]);
// //               timeoutRefs.current[symbol] = setTimeout(() => {
// //                 setPrices((prev) => ({
// //                   ...prev,
// //                   [symbol]: { ...(prev[symbol] || {}), stale: true },
// //                 }));
// //                 fetchFallbackPrices([symbol]);
// //               }, 30000);
// //             }
// //           });
// //         }
// //       } catch (err) {
// //         console.error("WebSocket parse error:", err);
// //       }
// //     };

// //     ws.onerror = (err) => {
// //       console.error("❌ WebSocket error:", err);
// //     };

// //     ws.onclose = () => {
// //       console.warn("⚠️ WebSocket closed");
// //       fetchFallbackPrices([...subscribedSymbols.current]);
// //     };

// //     return () => {
// //       ws.close();
// //     };
// //   }, []);

// //   return (
// //     <MarketDataContext.Provider value={{ prices, subscribeToSymbol, getLatestPrice }}>
// //       {children}
// //     </MarketDataContext.Provider>
// //   );
// // }
// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useRef,
// } from "react";

// // Create context

// export const MarketDataContext = createContext();


// // Custom hook
// export const useMarketData = () => {
//   const context = useContext(MarketDataContext);
//   if (!context) {
//     throw new Error("useMarketData must be used within a MarketDataProvider");
//   }
//   return context;
// };

// // Provider component
// export function MarketDataProvider({ children }) {
//   const [prices, setPrices] = useState({});
//   const wsRef = useRef(null);
//   const timeoutRefs = useRef({});
//   const subscribedSymbols = useRef(new Set());

//   const getToken = () => localStorage.getItem("token");

//   const fetchFallbackPrices = async (symbols) => {
//     if (!symbols.length) return;
//     try {
//       const res = await fetch(
//         `http://127.0.0.1:8000/user/prices?symbols=${symbols.join(",")}`,
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       const data = await res.json();
//       if (Array.isArray(data)) {
//         const updated = {};
//         data.forEach(({ symbol, price }) => {
//           updated[symbol.toUpperCase()] = { price, stale: true };
//         });
//         setPrices((prev) => ({ ...prev, ...updated }));
//       }
//     } catch (err) {
//       console.error("REST fallback failed:", err);
//     }
//   };

//   const subscribeToSymbol = (symbol) => {
//     const sym = symbol.toUpperCase();
//     if (subscribedSymbols.current.has(sym)) return;

//     subscribedSymbols.current.add(sym);

//     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//       wsRef.current.send(
//         JSON.stringify({
//           action: "subscribe",
//           symbols: [sym],
//           token: getToken(),
//         })
//       );
//     } else {
//       fetchFallbackPrices([sym]);
//     }
//   };

//   const getLatestPrice = async (symbol) => {
//     const sym = symbol.toUpperCase();
//     if (prices[sym]) return prices[sym];

//     try {
//       const res = await fetch(
//         `http://127.0.0.1:8000/user/prices?symbols=${sym}`,
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       const data = await res.json();
//       if (Array.isArray(data) && data.length > 0) {
//         return { price: data[0].price, stale: true };
//       }
//     } catch (err) {
//       console.error("Fallback price fetch failed:", err);
//     }

//     return { price: 0, stale: true };
//   };

//   useEffect(() => {
//     const ws = new WebSocket("ws://127.0.0.1:8000/ws/market");
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("✅ Market WebSocket connected");
//     };

//     ws.onmessage = (event) => {
//       try {
//         const parsed = JSON.parse(event.data);
//         if (typeof parsed === "object" && parsed.type === "error") {
//           console.warn("Server error:", parsed.message);
//           return;
//         }

//         if (Array.isArray(parsed)) {
//           parsed.forEach((msg) => {
//             if (msg.T === "t") {
//               const { S: symbol, p: price } = msg;
//               setPrices((prev) => ({
//                 ...prev,
//                 [symbol]: { price, stale: false },
//               }));

//               clearTimeout(timeoutRefs.current[symbol]);
//               timeoutRefs.current[symbol] = setTimeout(() => {
//                 setPrices((prev) => ({
//                   ...prev,
//                   [symbol]: { ...(prev[symbol] || {}), stale: true },
//                 }));
//                 fetchFallbackPrices([symbol]);
//               }, 30000);
//             }
//           });
//         }
//       } catch (err) {
//         console.error("WebSocket parse error:", err);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("❌ WebSocket error:", err);
//     };

//     ws.onclose = () => {
//       console.warn("⚠️ WebSocket closed");
//       fetchFallbackPrices([...subscribedSymbols.current]);
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <MarketDataContext.Provider
//       value={{ prices, subscribeToSymbol, getLatestPrice }}
//     >
//       {children}
//     </MarketDataContext.Provider>
//   );
// }
// src/contexts/MarketDataContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

// ✅ Create and export the context
export const MarketDataContext = createContext();

// ✅ Custom hook to access the context
export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error("useMarketData must be used within a MarketDataProvider");
  }
  return context;
};

// ✅ Context provider
export function MarketDataProvider({ children }) {
  const [prices, setPrices] = useState({});
  const wsRef = useRef(null);
  const timeoutRefs = useRef({});
  const subscribedSymbols = useRef(new Set());
  const baseURL=import.meta.env.VITE_API_BASE_URL;

  const getToken = () => localStorage.getItem("token");

  const fetchFallbackPrices = async (symbols) => {
    if (!symbols.length) return;
    try {
      const res = await fetch(
        `${baseURL}/user/prices?symbols=${symbols.join(",")}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        const updated = {};
        data.forEach(({ symbol, price }) => {
          updated[symbol.toUpperCase()] = { price, stale: true };
        });
        setPrices((prev) => ({ ...prev, ...updated }));
      }
    } catch (err) {
      console.error("REST fallback failed:", err);
    }
  };

  const subscribeToSymbol = (symbol) => {
    const sym = symbol.toUpperCase();
    if (subscribedSymbols.current.has(sym)) return;

    subscribedSymbols.current.add(sym);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: "subscribe",
          symbols: [sym],
          token: getToken(),
        })
      );
    } else {
      fetchFallbackPrices([sym]);
    }
  };

  const getLatestPrice = async (symbol) => {
    const sym = symbol.toUpperCase(); // Ensure symbol is uppercase for consistency
    if (prices[sym]) return prices[sym]; // Return cached price if available
  
    try {
      const res = await fetch(
        `${baseURL}/user/prices?symbols=${sym}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // Use token from localStorage
          },
        }
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const priceData = data[0]; // Extract the first element (which is an object with price info)
        return { price: priceData.price, stale: true }; // Return the price
      }
    } catch (err) {
      console.error("Fallback price fetch failed:", err);
    }
  
    return { price: 0, stale: true }; // Return 0 if there's an error
  };
  

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/market");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Market WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (typeof parsed === "object" && parsed.type === "error") {
          console.warn("Server error:", parsed.message);
          return;
        }

        if (Array.isArray(parsed)) {
          parsed.forEach((msg) => {
            if (msg.T === "t") {
              const { S: symbol, p: price } = msg;
              setPrices((prev) => ({
                ...prev,
                [symbol]: { price, stale: false },
              }));

              clearTimeout(timeoutRefs.current[symbol]);
              timeoutRefs.current[symbol] = setTimeout(() => {
                setPrices((prev) => ({
                  ...prev,
                  [symbol]: { ...(prev[symbol] || {}), stale: true },
                }));
                fetchFallbackPrices([symbol]);
              }, 30000);
            }
          });
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket closed");
      fetchFallbackPrices([...subscribedSymbols.current]);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <MarketDataContext.Provider
      value={{ prices, subscribeToSymbol, getLatestPrice }}
    >
      {children}
    </MarketDataContext.Provider>
  );
}
