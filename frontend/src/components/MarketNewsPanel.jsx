import { useEffect, useState } from "react";

const dummyNews = [
  {
    title: "📈 Apple (AAPL) hits all-time high on strong Q2 earnings",
    timestamp: "5 mins ago",
  },
  {
    title: "📈 Apple (AAPL) hits all-time high on strong Q2 earnings",
    timestamp: "5 mins ago",
  },
  {
    title: "📈 Apple (AAPL) hits all-time high on strong Q2 earnings",
    timestamp: "5 mins ago",
  },
  {
    title: "🛢️ Oil prices dip amid global supply concerns",
    timestamp: "15 mins ago",
  },
  {
    title: "📊 Nasdaq posts biggest weekly gain since March",
    timestamp: "30 mins ago",
  },
  {
    title: "🏦 Fed hints at rate pause in upcoming meeting",
    timestamp: "1 hour ago",
  },
  {
    title: "💡 Nvidia expands AI chip dominance",
    timestamp: "2 hours ago",
  },
];

export default function MarketNewsPanel() {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    // Replace this with fetch from your backend when ready
    setNewsItems(dummyNews);
  }, []);

  return (
    <div className="h-full bg-white shadow-md rounded-lg p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Market News</h2>
      <ul className="space-y-4">
        {newsItems.map((item, index) => (
          <li key={index} className="border-b pb-2">
            <p className="text-gray-800 font-medium">{item.title}</p>
            <p className="text-sm text-gray-400">{item.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
