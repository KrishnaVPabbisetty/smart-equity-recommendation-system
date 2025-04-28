import React from 'react'

function AIInvestmentAssistant() {
  return (
    <div className="bg-white shadow rounded-xl p-4">
    <h3 className="font-semibold">AI Investment Assistant</h3>
    <p>Hello! I'm your AI investment assistant. I can help you with:</p>
    <ul className="list-disc pl-6 text-sm">
      <li>Stock analysis and recommendations</li>
      <li>Market trends and insights</li>
      <li>Investment strategies</li>
      <li>Portfolio optimization</li>
      <li>Risk assessment</li>
    </ul>
    <input
      className="mt-4 w-full p-2 border rounded"
      placeholder="Ask about stocks, market trends, or..."
    />
  </div>
  )
}

export default AIInvestmentAssistant