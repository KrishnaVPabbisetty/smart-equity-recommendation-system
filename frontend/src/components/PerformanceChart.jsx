import React from 'react'
import chart from "/Users/harshaponukumati/Projects/smart-equity-recommendation-system/frontend/src/assets/chart-placeholder.png"
function PerformanceChart() {
  return (
    <div className="bg-white shadow rounded-xl p-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold">Portfolio Performance</h3>
      <div className="flex gap-2">
        {['1D', '1W', '1M', '1Y', 'ALL'].map(label => (
          <button key={label} className={`px-3 py-1 rounded ${label === '1W' ? 'bg-blue-400 text-black' : 'border'}`}>{label}</button>
        ))}
      </div>
    </div>
    <img src={chart} alt="Chart" className="rounded-lg w-full" />
  </div>
  )
}

export default PerformanceChart