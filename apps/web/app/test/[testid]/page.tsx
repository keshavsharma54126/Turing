"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { dummyTests } from '../../../dummyTests';
import { prisma } from '@repo/db/client';
import axios from 'axios';
const TestPage = () => {
  const params = useParams();
  const testId = params.testid as string;
  
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  useEffect(() => {
    setLoading(true);
    // Simulate API call with dummy data
    const fetchTest = async () => {
      const token = localStorage.getItem('authToken');
      const test = await axios.get(`http://localhost:3000/api/v1/tests/get-test/${testId}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTest(test.data.test);
      setLoading(false);
    };

    fetchTest();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Skeleton Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-4"></div>
            <div className="flex gap-3 mb-6">
              <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-28 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full w-full"></div>
          </div>

          {/* Skeleton Questions */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-8 mb-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-md w-full mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-12 bg-gray-200 rounded-md"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border-4 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 text-xl">
            <span className="font-black text-2xl border-2 border-black px-3 py-1">
              404
            </span>
            <h1 className="font-bold">Test Not Found</h1>
          </div>
          <p className="mt-4 text-gray-600">
            The test you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Test Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4 text-[#1B4D3E]">{test.title}</h1>
            <div className="flex flex-wrap gap-3">
              <span className={`px-4 py-2 rounded-full font-medium ${
                test.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
              </span>
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium">
                {test.numQuestions} Questions
              </span>
              <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-800 font-medium">
                {test.topic}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{answeredQuestions} of {test.questions.length} answered</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1B4D3E] rounded-full transition-all duration-300"
                style={{
                  width: `${answeredQuestions/test.questions.length*100}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {test.questions.map((q: any, idx: number) => (
            <div 
              key={idx} 
              className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              {/* Question Header */}
              <div className="bg-[#32bd93] border-b-4 border-black p-6">
                <p className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="flex items-center justify-center bg-white text-black border-2 border-black w-10 h-10 rounded-none font-black">
                    {idx + 1}
                  </span>
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="p-6">
                <div className="space-y-4">
                  {q.options.map((option: string, optIdx: number) => (
                    <div 
                      key={optIdx} 
                      onClick={() => setUserAnswers((prev: any) => ({
                        ...prev,
                        [idx]: prev[idx] === option ? undefined : option,
                        answeredQuestions: prev.answeredQuestions + 1,
                        progress: (prev.answeredQuestions + 1) / test.questions.length * 100
                      }))}
                      className={`flex items-center gap-4 p-4 cursor-pointer transition-all
                        border-3 border-black
                        ${userAnswers[idx] === option 
                          ? 'bg-[#1B4D3E] text-white shadow-none translate-x-[3px] translate-y-[3px]' 
                          : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                    >
                      <div className={`w-6 h-6 flex items-center justify-center border-2 border-black transition-all
                        ${userAnswers[idx] === option
                          ? 'bg-white'
                          : 'bg-transparent'
                        }`}
                      >
                        {userAnswers[idx] === option && (
                          <svg 
                            className="w-4 h-4 text-black" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="square" 
                              strokeLinejoin="round" 
                              strokeWidth={3} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                        )}
                      </div>
                      <label className="flex-1 cursor-pointer font-bold">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              
                {/* Neo-Brutalist Explanation Card */}
                {(userAnswers[idx] && test.isCompleted) && (
                  <div className="mt-6">
                    <div className="bg-yellow-100 border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-black text-lg border-2 border-black px-2 bg-white">
                          !
                        </span>
                        <p className="font-black text-black">EXPLANATION</p>
                      </div>
                      <p className="font-medium text-black">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>


          <div className="fixed bottom-0 left-0 right-0 px-4">
            <div className="max-w-4xl mx-auto">
              <button 
                className="w-full bg-[#eb4b4b] text-white p-4 font-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
                onClick={() => alert('Test submitted!')}
              >
                SUBMIT TEST
              </button>
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default TestPage;