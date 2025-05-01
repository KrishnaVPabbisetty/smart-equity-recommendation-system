import { useState, useEffect } from "react";
import OrderReviewModal from "./OrderReviewModal";

export default function BuySellPanel() {
  const [tab, setTab] = useState("buy");
  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState(1);
  const [buyMode, setBuyMode] = useState("shares");
  const [orderType, setOrderType] = useState("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [timeInForce, setTimeInForce] = useState("day");
  const [marketPrice, setMarketPrice] = useState(210.6); // Placeholder
  const [buyingPower, setBuyingPower] = useState("0.00");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBuyingPower = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/user/portfolio", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setBuyingPower(parseFloat(data.buying_power).toFixed(2));
      } catch (err) {
        console.error("Error fetching buying power:", err);
      }
    };

    fetchBuyingPower();
  }, []);

  const estimatedCost =
    buyMode === "dollars"
      ? parseFloat(qty)
      : (qty * marketPrice).toFixed(2);

  const estimatedQty =
    buyMode === "dollars" && marketPrice !== 0
      ? (qty / marketPrice).toFixed(6)
      : qty;

  const isReviewDisabled = !symbol || qty <= 0 || marketPrice === 0;

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("token");
    const endpoint = tab === "buy" ? "/buy_stock" : "/sell_stock";

    const payload = {
      symbol: symbol.toUpperCase(),
      qty: parseFloat(qty),
      side: tab,
      type: orderType,
      time_in_force: timeInForce,
    };

    try {
      const res = await fetch(`http://127.0.0.1:8000/user${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Order failed");
      alert("Order executed successfully!");
      setShowModal(false);
    } catch (err) {
      alert("Failed to execute order.");
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 p-2 ${
            tab === "buy"
              ? "text-green-600 border-b-2 border-green-600 font-semibold"
              : "text-gray-400"
          }`}
          onClick={() => setTab("buy")}
        >
          Buy
        </button>
        <button
          className={`flex-1 p-2 ${
            tab === "sell"
              ? "text-red-600 border-b-2 border-red-600 font-semibold"
              : "text-gray-400"
          }`}
          onClick={() => setTab("sell")}
        >
          Sell
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Symbol</label>
          <input
            className="w-full p-2 border rounded uppercase"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <label className="block font-medium">Market Price</label>
          <div className="font-semibold">${marketPrice.toFixed(2)}</div>
        </div>

        <div>
          <label className="block font-medium">
            {buyMode === "shares" ? "Quantity" : "Amount"}
          </label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>

        <div>
          <label className="block font-medium">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
            <option value="stop_limit">Stop Limit</option>
          </select>
        </div>

        {orderType === "limit" && (
          <div>
            <label className="block font-medium">Limit Price</label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {orderType === "stop" && (
          <div>
            <label className="block font-medium">Stop Price</label>
            <input
              type="number"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {orderType === "stop_limit" && (
          <>
            <div>
              <label className="block font-medium">Stop Price</label>
              <input
                type="number"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Limit Price</label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        <div>
          <label className="block font-medium">Time in Force</label>
          <select
            value={timeInForce}
            onChange={(e) => setTimeInForce(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="day">DAY</option>
            <option value="gtc">GTC</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="shares"
                checked={buyMode === "shares"}
                onChange={(e) => setBuyMode(e.target.value)}
              />
              Shares
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="dollars"
                checked={buyMode === "dollars"}
                onChange={(e) => setBuyMode(e.target.value)}
              />
              Dollars
            </label>
          </div>
        </div>

        <div className="text-sm font-medium">
          <div>Estimated Quantity: {estimatedQty}</div>
          <div>Estimated Cost: ${estimatedCost}</div>
          <div>Buying Power: ${buyingPower}</div>
        </div>

        <button
          className={`w-full py-2 rounded font-semibold ${
            isReviewDisabled
              ? "bg-blue-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-400 hover:bg-yellow-500 text-black"
          }`}
          disabled={isReviewDisabled}
          onClick={() => setShowModal(true)}
        >
          Review Order
        </button>
      </div>

      {/* Modal Component */}
      <OrderReviewModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmOrder}
        tab={tab}
        symbol={symbol}
        qty={qty}
        marketPrice={marketPrice}
        orderType={orderType}
        timeInForce={timeInForce}
        buyingPower={buyingPower}
      />
    </div>
  );
}
