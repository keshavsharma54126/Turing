import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ... existing imports and code ...

// Replace the image div in the hero section with:
<div className="relative h-[500px] hidden md:block">
  <div className="absolute inset-0 brutalist-card p-6 bg-white">
    <Line
      data={{
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
          {
            label: 'Average Student Score',
            data: [65, 68, 72, 78, 85, 92],
            borderColor: '#B8D8E3',
            backgroundColor: 'rgba(184, 216, 227, 0.2)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'With Turing AI',
            data: [67, 75, 82, 88, 92, 96],
            borderColor: '#F7CAC9',
            backgroundColor: 'rgba(247, 202, 201, 0.2)',
            tension: 0.4,
            fill: true,
          }
        ]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: 'monospace'
              }
            }
          },
          title: {
            display: true,
            text: 'Student Performance Improvement',
            font: {
              size: 16,
              family: 'monospace',
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            min: 60,
            max: 100,
            ticks: {
              callback: value => `${value}%`,
              font: {
                family: 'monospace'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                family: 'monospace'
              }
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }}
    />
  </div>
  <div className="absolute -bottom-4 -right-4 w-full h-full brutalist-card bg-[#B8D8E3]/20 -z-10"></div>
</div>