import React from 'react'

function MarketInsightCard() {
  return (
    <div className="bg-white shadow rounded-xl p-4">
    <h3 className="font-semibold mb-2">Market Insights</h3>
    <p>S&P 500 <span className="text-green-500">+0.8% Today</span></p>
    <p>Market Volatility: Moderate</p>
    <p>Latest News: 3 new updates</p>
  </div>
  )
}

export default MarketInsightCard