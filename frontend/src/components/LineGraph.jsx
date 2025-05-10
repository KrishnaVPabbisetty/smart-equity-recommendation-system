import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const Linegraph = ({ period }) => {
  const [data, setData] = useState({
    '1D': [],
    '1W': [],
    '1M': [],
    '1Y': [],
    'ALL': [],
  });

  // Fetch data for different periods
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = {
        '1D': [
          { date: '12:00 AM', value: 120000 },
          { date: '6:00 AM', value: 121000 },
          { date: '12:00 PM', value: 121500 },
          { date: '6:00 PM', value: 122000 },
        ],
        '1W': [
          { date: 'Mon', value: 120000 },
          { date: 'Tue', value: 121500 },
          { date: 'Wed', value: 122000 },
          { date: 'Thu', value: 123500 },
          { date: 'Fri', value: 124500 },
        ],
        '1M': [
          { date: '2025-04-01', value: 119500 },
          { date: '2025-04-07', value: 120000 },
          { date: '2025-04-14', value: 121000 },
          { date: '2025-04-21', value: 123000 },
          { date: '2025-04-30', value: 125000 },
        ],
        '1Y': [
          { date: '2024-05-09', value: 110000 },
          { date: '2024-06-09', value: 112500 },
          { date: '2024-07-09', value: 115000 },
          { date: '2024-08-09', value: 118000 },
          { date: '2024-09-09', value: 120000 },
        ],
        'ALL': [
          { date: '2020', value: 90000 },
          { date: '2021', value: 105000 },
          { date: '2022', value: 110000 },
          { date: '2023', value: 115000 },
          { date: '2024', value: 120000 },
        ],
      };

      setData(fetchedData); // Store data for all time periods
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data[period].map(item => item.date), // X-axis labels from the selected time period
    datasets: [
      {
        label: `${period} Portfolio Value`,
        data: data[period].map(item => item.value), // Y-axis values from the selected time period
        fill: true, // Fill the area below the line
        borderColor: 'rgb(96, 165, 250)', // Line color (orange)
        backgroundColor: 'rgba(255, 165, 0, 0.2)', // Fill color below the line
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
    <div className="line-graph-container">
      <Line data={chartData} options={options} />
    </div>
  );
};
