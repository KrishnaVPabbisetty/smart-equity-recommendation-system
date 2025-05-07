import React, { useEffect, useState } from 'react';
import OverviewCard from '../components/OverviewCard';
import PerformanceChart from '../components/PerformanceChart';
import BuySellPanel from '../components/BuySellPanel';
import MarketNewsPanel from '../components/MarketNewsPanel';
import Orders from '../components/Orders';
import Watchlist from '../components/Watchlist';

function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [previousValue, setPreviousValue] = useState(0);
  const [buyingPower, setBuyingPower] = useState(0);
  const [cash, setCash] = useState(0);
  const [equity, setEquity] = useState(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://127.0.0.1:8000/user/portfolio", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        setPortfolio(data.positions || []);
        setPreviousValue(portfolioValue);
        setPortfolioValue(parseFloat(data.portfolio_value || 0));
        setBuyingPower(parseFloat(data.buying_power || 0));
        setCash(parseFloat(data.cash || 0));
        setEquity(parseFloat(data.equity || 0));
      } catch (err) {
        console.error("Failed to fetch portfolio", err);
      }
    };

    fetchPortfolio();
  }, []);

  const change = portfolioValue - previousValue;
  const changePercent = (change / (previousValue || 1)) * 100;
  const subtitle = change >= 0
    ? `↑ ${changePercent.toFixed(2)}% today`
    : `↓ ${Math.abs(changePercent).toFixed(2)}% today`;
  const subtitleClass = change >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Top Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <OverviewCard
          title="Portfolio Value"
          value={`$${portfolioValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`}
          // subtitle={subtitle}
          // subtitleClass={subtitleClass}
        />
        <OverviewCard
          title="Buying Power"
          value={`$${buyingPower.toLocaleString(undefined, {
            minimumFractionDigits: 2
          })}`}
          subtitle="Available to trade"
          subtitleClass="text-gray-500"
        />
        <OverviewCard
          title="Cash"
          value={`$${cash.toLocaleString(undefined, {
            minimumFractionDigits: 2
          })}`}
          subtitle="Uninvested"
          subtitleClass="text-gray-500"
        />
        <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Have questions?</h3>
          </div>
          <a
            href="/ai-assistant"
            className="inline-block bg-blue-400 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-700 text-center"
          >
            Ask the AI assistant
          </a>
        </div>
      </section>

      {/* Chart + Insights */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <PerformanceChart />
        </div>
        <MarketNewsPanel />
      </section>

      {/* Portfolio Table + Buy/Sell */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Market Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Unrealized P/L</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolio.length > 0 ? (
                  portfolio.map((stock) => {
                    const unrealizedPL = parseFloat(stock.unrealized_pl);
                    const isGain = unrealizedPL >= 0;

                    return (
                      <tr key={stock.symbol}>
                        <td className="px-6 py-4">{stock.symbol}</td>
                        <td className="px-6 py-4">{stock.qty}</td>
                        <td className="px-6 py-4">${parseFloat(stock.market_value).toFixed(2)}</td>
                        <td className={`px-6 py-4 flex items-center gap-1 ${isGain ? "text-green-600" : "text-red-500"}`}>
                          {isGain ? "▲" : "▼"} {unrealizedPL.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">No portfolio data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 self-start">
          <BuySellPanel />
        </div>
      </section>
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
  <div className="md:col-span-2 space-y-6">
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      
    </div>

    <Orders />
  </div>

  {/* Right side */}
  <div className="space-y-6">
    {/* <div className="bg-white shadow-md rounded-lg p-6 self-start">
      <BuySellPanel />
    </div> */}
    <Watchlist />
  </div>
</section>

      <footer className="mt-8 text-center text-sm text-gray-500">
        © 2024 Smart Equity Recommendation System. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard;
