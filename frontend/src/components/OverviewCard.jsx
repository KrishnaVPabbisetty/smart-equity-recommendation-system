import React from 'react'

const OverviewCard = ({ title, value, subtitle, subtitleClass }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
    <p className={`text-sm ${subtitleClass}`}>{subtitle}</p>
  </div>
  )
}

export default OverviewCard