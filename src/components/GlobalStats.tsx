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
import { RefreshCw, AlertTriangle, Info, Loader2, TrendingUp, Clock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        labels: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(255, 255, 255)',
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
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        },
        title: {
          display: true,
          text: 'Number of Errors',
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        },
        title: {
          display: true,
          text: 'Characters',
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12
          }
        }
      }
    }
  };

  const handleReset = () => {
    setShowConfirmModal(true);
  };

  const confirmReset = async () => {
    setIsLoading(true);
    await resetStats();
    setIsLoading(false);
    setShowConfirmModal(false);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-base-content/50">
      <Info className="w-12 h-12 mb-4" />
      <p className="text-lg">No error data available</p>
      <p className="text-sm">Complete a typing test to see statistics</p>
    </div>
  );

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="text-base-content/70">Loading statistics...</p>
    </div>
  );

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-success/20"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            <h2 className="text-xl font-semibold text-base-content">
              Global Error Statistics
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="btn btn-ghost btn-sm gap-2 hover:bg-error/10 hover:text-error transition-all duration-300"
            title="Reset global error statistics"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Stats
          </button>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : errorStats.totalErrors === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-base-200 dark:bg-gray-700 p-4 rounded-lg border border-base-300 dark:border-gray-600 transition-all duration-300 hover:shadow-md"
              >
                <h3 className="text-lg font-medium text-base-content mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-info" />
                  Overall Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Total Errors:</span>
                    <span className="font-medium text-error">{errorStats.totalErrors}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Unique Errors:</span>
                    <span className="font-medium text-error">{errorKeys.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Last Updated:</span>
                    <span className="font-medium text-base-content/70 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(errorStats.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-base-200 dark:bg-gray-700 p-4 rounded-lg border border-base-300 dark:border-gray-600 transition-all duration-300 hover:shadow-md"
              >
                <h3 className="text-lg font-medium text-base-content mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-info" />
                  Error Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Most Common Error:</span>
                    <span className="font-medium text-error">{sortedKeys[0] || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Occurrences:</span>
                    <span className="font-medium text-error">{sortedValues[0] || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Percentage:</span>
                    <span className="font-medium text-error">{percentages[0] || '0'}%</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="h-64 mb-4 bg-base-200 dark:bg-gray-700 p-4 rounded-lg border border-base-300 dark:border-gray-600">
              <Bar data={chartData} options={options} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-base-content mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-error" />
                  Top Errors
                </h3>
                <div className="space-y-2">
                  <AnimatePresence>
                    {sortedKeys.slice(0, 6).map((key, index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="bg-base-200 dark:bg-gray-700 p-3 rounded-lg border border-base-300 dark:border-gray-600 flex justify-between items-center transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                      >
                        <span className="font-mono text-lg text-base-content">{key}</span>
                        <div className="text-right">
                          <div className="text-error font-medium">{sortedValues[index]}</div>
                          <div className="text-sm text-base-content/70">
                            {percentages[index]}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-base-content mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-info" />
                  Error Analysis
                </h3>
                <div className="bg-base-200 dark:bg-gray-700 p-4 rounded-lg border border-base-300 dark:border-gray-600 space-y-3">
                  <p className="text-base-content/70">
                    This data shows your most common typing errors across all practice sessions.
                    Focus on improving accuracy for the most frequent errors to enhance your overall typing performance.
                  </p>
                  <div className="pt-2">
                    <h4 className="font-medium text-base-content mb-2">
                      Tips for Improvement:
                    </h4>
                    <ul className="list-disc list-inside text-base-content/70 space-y-1">
                      <li>Practice the most common error characters more frequently</li>
                      <li>Pay special attention to the top 3 error characters</li>
                      <li>Use targeted practice sessions focusing on problem areas</li>
                      <li>Monitor your progress by checking this page regularly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>

      <dialog id="reset_confirm_modal" className={`modal ${showConfirmModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Reset Error Statistics</h3>
          <p className="py-4">Are you sure you want to reset all error statistics? This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            <button className="btn btn-error" onClick={confirmReset}>Reset</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowConfirmModal(false)}>close</button>
        </form>
      </dialog>
    </>
  );
} 