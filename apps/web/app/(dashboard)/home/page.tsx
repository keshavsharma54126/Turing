"use client"
import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement
} from 'chart.js';
import axios from 'axios';
import { Calendar, Brain, GraduationCap, Trophy } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement
);

interface TestResult {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  date: string;
}

interface UserStats {
  testsCompleted: number;
  averageScore: number;
  tutoringSessions: number;
  learningStreak: number;
}

const Home = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    testsCompleted: 0,
    averageScore: 0,
    tutoringSessions: 0,
    learningStreak: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let token;
        if(typeof window !== 'undefined'){
          token = localStorage.getItem('authToken');
        }
        const [testsResponse, statsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tests/history`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/stats`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        ]);

        setTestResults(testsResponse.data);
        setUserStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const statsCards = [
    { icon: <Brain size={24} />, label: 'Tests Completed', value: userStats.testsCompleted },
    { icon: <Trophy size={24} />, label: 'Average Score', value: `${userStats.averageScore}%` },
    { icon: <GraduationCap size={24} />, label: 'Tutoring Sessions', value: userStats.tutoringSessions },
    { icon: <Calendar size={24} />, label: 'Learning Streak', value: `${userStats.learningStreak} days` },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto overflow-y-auto h-screen">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="brutalist-card bg-white p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 rounded-lg bg-[#E0F4FF]">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600 font-mono">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Progress Over Time */}
        <div className="brutalist-card bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Learning Progress</h2>
          <div className="h-[300px]">
            <Line
              data={{
                labels: testResults.map(r => new Date(r.date).toLocaleDateString()),
                datasets: [{
                  label: 'Test Scores',
                  data: testResults.map(r => (r.score / r.totalQuestions) * 100),
                  borderColor: '#B8D8E3',
                  backgroundColor: 'rgba(184, 216, 227, 0.2)',
                  tension: 0.4,
                  fill: true,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                }
              }}
            />
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="brutalist-card bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Subject Distribution</h2>
          <div className="h-[300px]">
            <Doughnut
              data={{
                labels: ['Mathematics', 'Science', 'History', 'Language'],
                datasets: [{
                  data: [30, 25, 20, 25],
                  backgroundColor: [
                    '#B8D8E3',
                    '#F7CAC9',
                    '#E5FFE0',
                    '#FFE8D6'
                  ],
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="brutalist-card bg-white p-6">
        <h2 className="text-xl font-bold mb-4">Recent Tests</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#1B4D3E]">
                <th className="text-left p-4 font-mono">Test Title</th>
                <th className="text-left p-4 font-mono">Date</th>
                <th className="text-left p-4 font-mono">Score</th>
                <th className="text-left p-4 font-mono">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((test, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="p-4">{test.title}</td>
                  <td className="p-4">{new Date(test.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded ${
                      (test.score / test.totalQuestions) * 100 >= 70
                        ? 'bg-[#E5FFE0]'
                        : 'bg-[#FFE2E0]'
                    }`}>
                      {((test.score / test.totalQuestions) * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="brutalist-button bg-[#1B4D3E] text-white px-4 py-2">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;