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

interface ErrorAnalysisProps {
  currentErrorMap: Map<string, number>;
  currentTotalErrors: number;
}

export default function ErrorAnalysis({ currentErrorMap, currentTotalErrors }: ErrorAnalysisProps) {
  const { errorStats, resetStats } = useErrorStatsStore();

  // Convert error maps to arrays for the chart
  const currentKeys = Array.from(currentErrorMap.keys());
  const currentValues = Array.from(currentErrorMap.values());
  const globalKeys = Object.keys(errorStats.errorMap);
  const globalValues = Object.values(errorStats.errorMap);

  // Sort errors by frequency
  const sortErrors = (keys: string[], values: number[]) => {
    const sortedIndices = values
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value)
      .map(item => item.index);

    return {
      sortedKeys: sortedIndices.map(index => keys[index]),
      sortedValues: sortedIndices.map(index => values[index]),
    };
  };

  const currentSorted = sortErrors(currentKeys, currentValues);
  const globalSorted = sortErrors(globalKeys, globalValues);

  // Calculate percentages
  const calculatePercentages = (values: number[], total: number) =>
    values.map(value => ((value / total) * 100).toFixed(1));

  const currentPercentages = calculatePercentages(currentSorted.sortedValues, currentTotalErrors);
  const globalPercentages = calculatePercentages(globalSorted.sortedValues, errorStats.totalErrors);

  const chartData = {
    labels: currentSorted.sortedKeys,
    datasets: [
      {
        label: 'Current Test Errors',
        data: currentSorted.sortedValues,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Global Error History',
        data: globalSorted.sortedValues,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
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
          label: (context: { datasetIndex: number; dataIndex: number }) => {
            const index = context.dataIndex;
            const datasetIndex = context.datasetIndex;
            const values = datasetIndex === 0 ? currentSorted.sortedValues : globalSorted.sortedValues;
            const percentages = datasetIndex === 0 ? currentPercentages : globalPercentages;
            return [
              `Count: ${values[index]}`,
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
          Error Analysis
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
            Current Test
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Errors:</span>
              <span className="font-medium">{currentTotalErrors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Unique Errors:</span>
              <span className="font-medium">{currentKeys.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Global Statistics
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Errors:</span>
              <span className="font-medium">{errorStats.totalErrors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Unique Errors:</span>
              <span className="font-medium">{globalKeys.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
              <span className="font-medium">
                {new Date(errorStats.lastUpdated).toLocaleDateString()}
              </span>
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
            Current Test Errors
          </h3>
          <div className="space-y-2">
            {currentSorted.sortedKeys.slice(0, 6).map((key, index) => (
              <div
                key={key}
                className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg flex justify-between items-center"
              >
                <span className="font-mono text-lg">{key}</span>
                <div className="text-right">
                  <div className="text-red-500 font-medium">{currentSorted.sortedValues[index]}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {currentPercentages[index]}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Global Error History
          </h3>
          <div className="space-y-2">
            {globalSorted.sortedKeys.slice(0, 6).map((key, index) => (
              <div
                key={key}
                className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg flex justify-between items-center"
              >
                <span className="font-mono text-lg">{key}</span>
                <div className="text-right">
                  <div className="text-blue-500 font-medium">{globalSorted.sortedValues[index]}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {globalPercentages[index]}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 