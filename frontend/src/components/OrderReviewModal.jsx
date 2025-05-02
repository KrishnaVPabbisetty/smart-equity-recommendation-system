import React from "react";

export default function OrderReviewModal({
  show,
  onClose,
  onConfirm,
  tab,
  symbol,
  qty,
  marketPrice,
  orderType,
  timeInForce,
  buyingPower,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Review your order</h2>
        <p className="mb-2">
          {tab === "buy" ? "Buy" : "Sell"} <strong>{symbol}</strong>
        </p>
        <p>Shares: {qty}</p>
        <p>
          {orderType.charAt(0).toUpperCase() + orderType.slice(1)} Order: $
          {marketPrice.toFixed(2)}
        </p>
        <p>
          Estimated Total: <strong>${(qty * marketPrice).toFixed(2)}</strong>
        </p>
        <p className="text-gray-500 mt-1">
          Buying Power: ${parseFloat(buyingPower).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        <div className="border-t my-4 pt-2 text-sm text-gray-600">
          <p>• Bid {(marketPrice - 0.26).toFixed(2)} x 1</p>
          <p>• Ask {marketPrice.toFixed(2)} x 10</p>
          <p>• Last {marketPrice.toFixed(2)} x 100</p>
          <p className="text-xs mt-1">
            NBBO last updated at {new Date().toLocaleString()}
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 bg-blue-400 hover:bg-blue-500 rounded"
            onClick={onConfirm}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
