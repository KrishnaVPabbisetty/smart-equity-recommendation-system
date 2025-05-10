import React, { useState } from 'react'
import { Linegraph } from './LineGraph'

function PerformanceChart() {
  // State to track the selected time period
  const [selectedPeriod, setSelectedPeriod] = useState('1W'); // Default is 1W

  // Handle button click to set the selected period
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Portfolio Performance</h3>
        <div className="flex gap-2">
          {['1D', '1W', '1M', '1Y', 'ALL'].map(label => (
            <button
              key={label}
              onClick={() => handlePeriodChange(label)}
              className={`px-3 py-1 rounded ${label === selectedPeriod ? 'bg-blue-400 text-black' : 'border'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* Pass the selected period as a prop to Linegraph */}
      <Linegraph period={selectedPeriod} />
    </div>
  )
}

export default PerformanceChart;
