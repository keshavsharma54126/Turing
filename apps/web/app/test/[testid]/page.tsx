"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { dummyTests } from '../../../dummyTests';

const TestPage = () => {
  const params = useParams();
  const testId = params.testid as string;
  
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    // Simulate API call with dummy data
    const fetchTest = () => {
      const foundTest = dummyTests.find(t => t.id === testId);
      setTest(foundTest);
      setLoading(false);
    };

    fetchTest();
  }, [testId]);

  if (loading) {
    return <div className="p-6">Loading test...</div>;
  }

  if (!test) {
    return <div className="p-6">Test not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="brutalist-card bg-white p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{test.title}</h1>
          <div className="flex gap-4 text-sm font-mono">
            <span className={`px-3 py-1 rounded-full ${
              test.difficulty === 'easy' ? 'bg-[#E5FFE0]' :
              test.difficulty === 'medium' ? 'bg-[#FFE8D6]' :
              'bg-[#FFE2E0]'
            }`}>
              {test.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#E0F4FF]">
              {test.numQuestions} questions
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {test.questions.map((q: any, idx: number) => (
            <div key={idx} className="p-4 border-2 border-[#1B4D3E]">
              <p className="font-bold mb-4">{idx + 1}. {q.question}</p>
              <div className="space-y-2 ml-4">
                {q.options.map((option: string, optIdx: number) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      id={`q${idx}-opt${optIdx}`}
                      className="form-radio"
                      onChange={() => setUserAnswers(prev => ({
                        ...prev,
                        [idx]: option
                      }))}
                      checked={userAnswers[idx] === option}
                    />
                    <label htmlFor={`q${idx}-opt${optIdx}`}>{option}</label>
                  </div>
                ))}
              </div>
              {userAnswers[idx] && (
                <div className="mt-4 p-4 bg-[#E0F4FF] font-mono text-sm">
                  <p className="font-bold">Explanation:</p>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {Object.keys(userAnswers).length === test.questions.length && (
          <button 
            className="brutalist-button bg-[#1B4D3E] text-white px-6 py-3 w-full mt-8"
            onClick={() => alert('Test submitted!')}
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
};

export default TestPage;