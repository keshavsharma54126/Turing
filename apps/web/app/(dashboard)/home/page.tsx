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
import { useRouter } from 'next/navigation';

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

const calculateStreak = (tests: any[]) => {
  if (!tests.length) return 0;
  
  const today = new Date();
  const dates = tests
    .map(test => new Date(test.createdAt))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 1;
  //@ts-ignore
  let currentDate = new Date(dates[0]);
  
  // If no activity today or yesterday, streak is broken
  if ((today.getTime() - currentDate.getTime()) > (2 * 24 * 60 * 60 * 1000)) {
    return 0;
  }

  for (let i = 1; i < dates.length; i++) {
    //@ts-ignore
    const prevDate = new Date(dates[i]);
    const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }
  
  return streak;
};

const getSubjectDistribution = (tests: any[]) => {
  const distribution: { [key: string]: number } = {};
  
  tests.forEach(test => {
    const topic = test.topic;
    console.log(topic)
    distribution[topic] = (distribution[topic] || 0) + 1;
  });
  console.log({
    labels:Object.keys(distribution),
    data:Object.values(distribution)
  })
  return  {
    labels: Object.keys(distribution),
    data: Object.values(distribution)
  };
};

const Home = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    testsCompleted: 0,
    averageScore: 0,
    tutoringSessions: 0,
    learningStreak: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let token = '';
        if(typeof window !== 'undefined'){
          token = localStorage.getItem('authToken')!;
          if(!token){
            router.push('/signin');
          }
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/getUserData`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });

        const userData = response.data.userData;
        console.log(userData)
        const tests = userData.tests || [];
        const conversations = userData.conversations || [];
 
        
        const completedTests = tests.filter((test: any) => test.results && test.results.length > 0);
        const averageScore = completedTests.length > 0 
          ? completedTests.reduce((acc: number, test: any) => 
              acc + (test.results[0].score || 0), 0) / completedTests.length
          : 0;

        const testResults = completedTests.map((test: any) => ({
          id: test.id,
          title: test.title,
          topic:test.topic,
          score: test.results[0].score || 0,
          totalQuestions: test.numQuestions,
          date: test.createdAt
        }));

        setTestResults(testResults);
        setUserStats({
          testsCompleted: completedTests.length,
          averageScore: Math.round(averageScore),
          tutoringSessions: conversations.length,
          learningStreak: calculateStreak(tests)
        });

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

  const subjectData = getSubjectDistribution(testResults);

  if (isLoading) {
    return (
      <div className="p-2 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[300px] bg-gray-200 rounded"></div>
            <div className="h-[300px] bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" max-w-7xl mx-auto overflow-x-hidden min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-8">Dashboard</h1>

      {/* Stats Grid - reduced size on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-3 sm:mb-8">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="brutalist-card bg-white p-2 sm:p-6">
            <div className="flex items-center gap-1.5 sm:gap-4">
              <div className="p-1 sm:p-2 rounded-lg bg-[#E0F4FF]">
                <div className="w-4 h-4 sm:w-6 sm:h-6">
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-[10px] sm:text-sm text-gray-600 font-mono">{stat.label}</p>
                <p className="text-sm sm:text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid - reduced height on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-8">
        <div className="brutalist-card bg-white p-2 sm:p-6">
          <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">Learning Progress</h2>
          <div className="h-[200px] sm:h-[300px]">
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

        <div className="brutalist-card bg-white p-2 sm:p-6">
          <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">Subject Distribution</h2>
          <div className="h-[200px] sm:h-[300px]">
            <Doughnut
              data={{
                labels: subjectData.labels,
                datasets: [{
                  data: subjectData.data,
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

      {/* Recent Tests Table - adjusted for mobile */}
      <div className="brutalist-card bg-white p-2 sm:p-6">
        <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">Recent Tests</h2>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full min-w-[500px] sm:min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-[#1B4D3E]">
                <th className="text-left p-2 sm:p-4 font-mono text-xs sm:text-base">Test Title</th>
                <th className="text-left p-2 sm:p-4 font-mono text-xs sm:text-base">Date</th>
                <th className="text-left p-2 sm:p-4 font-mono text-xs sm:text-base">Score</th>
                <th className="text-left p-2 sm:p-4 font-mono text-xs sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((test, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="p-2 sm:p-4 text-xs sm:text-base">{test.title}</td>
                  <td className="p-2 sm:p-4 text-xs sm:text-base">{new Date(test.date).toLocaleDateString()}</td>
                  <td className="p-2 sm:p-4 text-xs sm:text-base">
                    <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded ${
                      (test.score / test.totalQuestions*10)>0.7
                        ? 'bg-[#E5FFE0]'
                        : 'bg-[#FFE2E0]'
                    }`}>
                      {((test.score /(test.totalQuestions*10)) * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-2 sm:p-4">
                    <button 
                      onClick={()=>(router.push(`/test/${test.id}`))} 
                      className="brutalist-button bg-[#1B4D3E] text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base"
                    >
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