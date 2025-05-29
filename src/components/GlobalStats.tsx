import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useErrorStatsStore } from '../store/errorStatsStore';
import { RefreshCw } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GlobalStats() {
  const { errorStats, resetStats } = useErrorStatsStore();

  // Convert error map to arrays for the chart
  const errorKeys = Object.keys(errorStats.errorMap);
  const errorValues = Object.values(errorStats.errorMap);

  // Sort errors by frequency
  const sortedIndices = errorValues
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .map(item => item.index);

  const sortedKeys = sortedIndices.map(index => errorKeys[index]);
  const sortedValues = sortedIndices.map(index => errorValues[index]);

  // Calculate percentages
  const percentages = sortedValues.map(value => 
    ((value / errorStats.totalErrors) * 100).toFixed(1)
  );

  const chartData = {
    labels: sortedKeys,
    datasets: [
      {
        label: 'Error Frequency',
        data: sortedValues,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: { dataIndex: number }) => {
            const index = context.dataIndex;
            return [
              `Count: ${sortedValues[index]}`,
              `Percentage: ${percentages[index]}%`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Errors'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Characters'
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Global Error Statistics
        </h2>
        <button
          onClick={resetStats}
          className="btn btn-ghost btn-sm gap-2"
          title="Reset global error statistics"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Stats
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Overall Statistics
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Errors:</span>
              <span className="font-medium">{errorStats.totalErrors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Unique Errors:</span>
              <span className="font-medium">{errorKeys.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
              <span className="font-medium">
                {new Date(errorStats.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Error Distribution
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Most Common Error:</span>
              <span className="font-medium">{sortedKeys[0] || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Occurrences:</span>
              <span className="font-medium">{sortedValues[0] || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Percentage:</span>
              <span className="font-medium">{percentages[0] || '0'}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 mb-4">
        <Bar data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Top Errors
          </h3>
          <div className="space-y-2">
            {sortedKeys.slice(0, 6).map((key, index) => (
              <div
                key={key}
                className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg flex justify-between items-center"
              >
                <span className="font-mono text-lg">{key}</span>
                <div className="text-right">
                  <div className="text-red-500 font-medium">{sortedValues[index]}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {percentages[index]}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Error Analysis
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              This data shows your most common typing errors across all practice sessions.
              Focus on improving accuracy for the most frequent errors to enhance your overall typing performance.
            </p>
            <div className="pt-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tips for Improvement:
              </h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Practice the most common error characters more frequently</li>
                <li>Pay special attention to the top 3 error characters</li>
                <li>Use targeted practice sessions focusing on problem areas</li>
                <li>Monitor your progress by checking this page regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 