import React from 'react'

const RecommendationCard= ({ symbol, name, price, change, details, buy }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex justify-between">
    <div>
      <h4 className="font-semibold">{name}</h4>
      <p>{price} <span className="text-green-500">{change}</span></p>
      <p className="text-gray-500 text-sm">{details}</p>
    </div>
    {buy && <button className="bg-green-500 text-black px-3 py-1 rounded self-start">BUY</button>}
  </div>
  )
}

export default RecommendationCard