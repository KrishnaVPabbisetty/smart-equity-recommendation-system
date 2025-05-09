import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const baseURL=import.meta.env.VITE_API_BASE_URL;

  const fetchOrders = async (status) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${baseURL}/user/orders?status=${status}&limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders(filter);
  }, [filter]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Recent Orders</h2>
        <div className="flex gap-2">
          {["all", "open", "closed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-sm border px-2 py-1 rounded ${
                filter === type
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll wrapper */}
      <div className="overflow-x-auto">
        <div className="max-h-[300px] overflow-y-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-gray-600 border-b">
                <th className="p-2">Symbol</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Filled Qty</th>
                <th className="p-2">Avg Fill Price</th>
                <th className="p-2">Side</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
                <th className="p-2">Submitted at</th>
                <th className="p-2">Filled at</th>
                <th className="p-2">Expires at</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, idx) => (
                  <tr key={idx} className="border-b whitespace-nowrap">
                    <td className="p-2 text-blue-600 font-medium">{order.symbol}</td>
                    <td className="p-2">{order.qty}</td>
                    <td className="p-2">{order.filled_qty}</td>
                    <td className="p-2">{order.filled_avg_price}</td>
                    <td className="p-2 capitalize">{order.side}</td>
                    <td className="p-2">{order.type}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{order.submitted_at}</td>
                    <td className="p-2">{order.filled_at}</td>
                    <td className="p-2">{order.expires_at}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
