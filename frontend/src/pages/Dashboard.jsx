import React from 'react'
import Navbar from '../components/Navbar'
import OverviewCard from '../components/OverviewCard';
import MarketInsightCard from '../components/MarketInsightCard';
import PerformanceChart from '../components/PerformanceChart';
import RecommendationCard from '../components/RecommendationCard';
import ChatBox from '../components/Chatbox';

function Dashboard() {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <OverviewCard title="Portfolio Value" value="$124,567.89" subtitle="↑ 2.4% today" subtitleClass="text-green-500" />
        <OverviewCard title="Total Return" value="+15.7%" subtitle="YTD" subtitleClass="text-green-500" />
        <OverviewCard title="Risk Score" value="7.2/10" subtitle="⚠️ Moderate" subtitleClass="text-yellow-500" />
        <OverviewCard title="AI Recommendations" value="5" subtitle="New suggestions" subtitleClass="" />
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
  {/* Performance Chart - spans 2 columns on medium+ screens */}
  <div className="md:col-span-2">
    <PerformanceChart />
  </div>

  {/* Right-side column with insights and chat */}
  <div className="flex flex-col gap-4">
    <MarketInsightCard />
    <ChatBox />
  </div>
</section>
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecommendationCard
          symbol="AAPL"
          name="Apple Inc."
          price="$208.37"
          change="+1.84%"
          details="Strong fundamentals and positive market sentiment indicate potential upside."
          buy
        />
        <RecommendationCard
          symbol="MSFT"
          name="Microsoft Corp."
          price="$387.30"
          change="+3.45%"
          details="AI initiatives and cloud growth present significant opportunities."
          buy
        />
      </section>

      

      <footer className="mt-8 text-center text-sm text-gray-500">
        © 2024 Smart Equity Recommendation System. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard