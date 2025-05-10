import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PerformanceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1M'); // Default is 1M
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [data, setData] = useState({
    '1D': [],
    '1M': [],
    '1Y': [],
    'ALL': [],
  });
  const [portfolioValue, setPortfolioValue] = useState(100000); // Example initial value

  // POST request to save the portfolio value
  const savePortfolioValue = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${baseURL}/user/save_portfolio_value`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ portfolio_value: portfolioValue }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Portfolio value saved:', data);
      } else {
        console.error('Error saving portfolio value:', data);
      }
    } catch (error) {
      console.error('Error in POST request:', error);
    }
  };

  // Format time in 12-hour format with leading zero for single digit minutes
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Ensure two digits for minutes
    const formattedTime = `${hours % 12 || 12}:${formattedMinutes} ${hours >= 12 ? 'PM' : 'AM'}`;
    return formattedTime;
  };

  // Function to filter the data for different periods
  const filterData = (data, period) => {
    const today = new Date();
    let filterDate;
    switch (period) {
      case '1D':
        filterDate = new Date(today.setHours(0, 0, 0, 0)); // Set to midnight
        return data.filter(item => new Date(item.timestamp) >= filterDate);
      case '1M':
        filterDate = new Date(today);
        filterDate.setDate(today.getDate() - 30); // Last 30 days
        return data.filter(item => new Date(item.timestamp) >= filterDate);
      case '1Y':
        filterDate = new Date(today);
        filterDate.setFullYear(today.getFullYear() - 1); // Last 365 days
        return data.filter(item => new Date(item.timestamp) >= filterDate);
      case 'ALL':
        return data; // Show all data
      default:
        return data;
    }
  };

  // Fetch data from the backend based on the selected period
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log("Saving portfolio value...");
      try {
        const res = await fetch(`${baseURL}/user/portfolio_graph`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();

        // Filter data based on the selected period
        const filteredData = filterData(result.data, selectedPeriod);

        // Format the filtered data for the chart
        const periodData = filteredData.map(item => ({
          date: new Date(item.timestamp).toLocaleString(), // Format the timestamp to display it nicely
          value: item.portfolio_value, // Portfolio value
        }));

        setData({
          '1D': periodData,
          '1M': periodData,
          '1Y': periodData,
          'ALL': periodData,
        });
      } catch (error) {
        console.error('Error fetching portfolio graph data:', error);
      }
    };

    fetchData();
  }, [selectedPeriod]); // Fetch data again when the selected period changes

  // Handle button click to set the selected period
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Set up the periodic POST request for saving portfolio value
  useEffect(() => {
    // Call savePortfolioValue every minute
    const intervalId = setInterval(() => {
      savePortfolioValue(); // Save portfolio value every 1 minute
    }, 60000); // 60000 ms = 1 minute

    // Cleanup: Clear interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [portfolioValue]); // Re-run the effect when portfolioValue changes

  // Chart Data for selected period
  const chartData = {
    labels: data[selectedPeriod].map(item => {
      const date = new Date(item.date);
      switch (selectedPeriod) {
        case '1D':
          return formatTime(date); // Call the formatTime function
        case '1M':
          return date.toLocaleDateString(); // Show date for 1M
        case '1Y':
          return `${date.getMonth() + 1}/${date.getFullYear()}`; // Show month/year for 1Y
        case 'ALL':
          return date.getFullYear(); // Show year for ALL
        default:
          return date;
      }
    }), // X-axis labels based on the selected period
    datasets: [
      {
        label: `${selectedPeriod} Portfolio Value`,
        data: data[selectedPeriod].map(item => item.value), // Y-axis values from the selected time period
        fill: true, // Fill the area below the line
        borderColor: 'rgb(96, 165, 250)', // Line color (blue)
        backgroundColor: 'rgba(96, 165, 250, 0.2)', // Fill color below the line (light blue)
        tension: 0.3, // Smoothness of the curve
        pointRadius: 3, // Radius of points on the line
        pointBackgroundColor: 'rgb(96, 165, 250)', // Color of points
        borderWidth: 2, // Thickness of the line
      },
    ],
  };

  // Chart.js options with animation settings
  const options = {
    responsive: true,
    animation: {
      duration: 2000, // Time for drawing the line (2 seconds)
      easing: 'easeInOutQuart', // Smooth easing effect
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `$${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Portfolio Value',
        },
        ticks: {
          beginAtZero: false, // You can customize this behavior
        },
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Portfolio Performance</h3>
        <div className="flex gap-2">
          {['1D', '1M', '1Y', 'ALL'].map(label => (
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

      {/* Line Graph */}
      <div className="line-graph-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PerformanceChart;
