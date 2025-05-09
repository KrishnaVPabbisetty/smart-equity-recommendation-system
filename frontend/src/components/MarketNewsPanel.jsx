import { useEffect, useState } from "react";

export default function MarketNewsPanel() {
  const [newsItems, setNewsItems] = useState([]);
  const baseURL=import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchNews = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${baseURL}/user/news`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await res.json();
        setNewsItems(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="h-full bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Market News</h2>

      <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {newsItems.length > 0 ? (
          newsItems.map((item, index) => (
            <li key={index} className="border-b pb-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                {item.headline}
              </a>
              <p className="text-sm text-gray-500">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No news available right now.</p>
        )}
      </ul>
    </div>
  );
}
