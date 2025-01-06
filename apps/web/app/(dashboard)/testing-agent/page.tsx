"use client"
import { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, FileText } from 'lucide-react';
import axios from 'axios';
import GeneratedTests from '../../../components/generatedTests';
import { dummyTests } from '../../../dummyTests';


interface TestInput {
  files: File[];
  links: string[];
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
}

const TestingAgent = () => {
  const [testInput, setTestInput] = useState<TestInput>({
    files: [],
    links: [],
    topic: '',
    difficulty: 'medium',
    numQuestions: 5
  });
  const [currentLink, setCurrentLink] = useState('');
  const [generatedTest, setGeneratedTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTests, setGeneratedTests] = useState(dummyTests);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [followUpQuestions, setFollowUpQuestions] = useState<Record<number, any>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTestInput(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files!)]
      }));
    }
  };

  const handleAddLink = () => {
    if (currentLink.trim()) {
      setTestInput(prev => ({
        ...prev,
        links: [...prev.links, currentLink.trim()]
      }));
      setCurrentLink('');
    }
  };

  const handleRemoveFile = (index: number) => {
    setTestInput(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveLink = (index: number) => {
    setTestInput(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateTest = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      testInput.files.forEach(file => formData.append('files', file));
      formData.append('links', JSON.stringify(testInput.links));
      formData.append('topic', testInput.topic);
      formData.append('difficulty', testInput.difficulty);
      formData.append('numQuestions', testInput.numQuestions.toString());

      const newTest = {
        id: `test-${generatedTests.length + 1}`,
        title: testInput.topic || "New Test",
        date: new Date().toISOString().split('T')[0],
        difficulty: testInput.difficulty,
        numQuestions: testInput.numQuestions,
        topic: testInput.topic || "General",
        questions: [
          {
            question: "Sample question for the new test?",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: "Option 1",
            explanation: "This is a sample explanation.",
            type: "basic"
          },
        ]
      };

      setGeneratedTests(prev => [newTest, ...prev]);
      setGeneratedTest(newTest);
    } catch (error) {
      console.error('Error generating test:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchGeneratedTests = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tests/generated`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );
        setGeneratedTests(response.data.tests);
      } catch (error) {
        console.error('Error fetching generated tests:', error);
      }
    };

    fetchGeneratedTests();
  }, []);

  const handleAnswerSubmit = async (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({...prev, [questionIndex]: answer}));
    
    const currentQuestion = generatedTest.questions[questionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    // Generate follow-up question based on user's performance
    const followUp = await TestGenerationService.generateFollowUpQuestion(
        currentQuestion,
        answer,
        isCorrect
    );

    setFollowUpQuestions(prev => ({...prev, [questionIndex]: followUp}));
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">AI Test Generator</h1>
        
        <div className="brutalist-card bg-white p-6 mb-8 space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Upload Learning Materials</h2>
            <div className="border-2 border-dashed border-[#1B4D3E] p-6 rounded-lg text-center">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="w-8 h-8 mb-2 text-[#1B4D3E]" />
                <span className="font-mono">Drop files or click to upload</span>
                <span className="text-sm text-gray-500 mt-1">
                  Supports PDF, DOC, DOCX, TXT, PPT, PPTX
                </span>
              </label>
            </div>
            
            {/* File List */}
            {testInput.files.length > 0 && (
              <div className="space-y-2">
                {testInput.files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="font-mono text-sm">{file.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Add Reference Links</h2>
            <div className="flex gap-2">
              <input
                type="url"
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                placeholder="Enter URL"
                className="flex-1 p-2 border-2 border-[#1B4D3E] font-mono"
              />
              <button
                onClick={handleAddLink}
                className="brutalist-button bg-[#1B4D3E] text-white px-4"
              >
                Add
              </button>
            </div>
            
            {/* Link List */}
            {testInput.links.length > 0 && (
              <div className="space-y-2">
                {testInput.links.map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      <span className="font-mono text-sm">{link}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveLink(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Topic Input */}
          <div>
            <h2 className="text-xl font-bold mb-2">Topic</h2>
            <input
              type="text"
              value={testInput.topic}
              onChange={(e) => setTestInput(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="Enter the main topic or subject"
              className="w-full p-2 border-2 border-[#1B4D3E] font-mono"
            />
          </div>

          {/* Test Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-mono block mb-2">Difficulty Level:</label>
              <select
                value={testInput.difficulty}
                onChange={(e) => setTestInput(prev => ({ 
                  ...prev, 
                  difficulty: e.target.value as 'easy' | 'medium' | 'hard' 
                }))}
                className="w-full p-2 border-2 border-[#1B4D3E] font-mono"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="font-mono block mb-2">Number of Questions:</label>
              <input
                type="number"
                min={1}
                max={20}
                value={testInput.numQuestions}
                onChange={(e) => setTestInput(prev => ({ 
                  ...prev, 
                  numQuestions: parseInt(e.target.value) 
                }))}
                className="w-full p-2 border-2 border-[#1B4D3E] font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateTest}
            disabled={isLoading}
            className="brutalist-button bg-[#1B4D3E] text-white px-6 py-3 w-full"
          >
            {isLoading ? 'Generating Test...' : 'Generate Test'}
          </button>
        </div>

        {/* Generated Test Display */}
        {generatedTest && (
          <div className="brutalist-card bg-white p-6 mb-8">
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Question {currentQuestionIndex + 1} of {generatedTest.questions.length}
                </h2>
                <span className="font-mono text-sm">
                  Topic: {generatedTest.questions[currentQuestionIndex].concept}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded">
                <div 
                  className="h-full bg-[#1B4D3E] rounded"
                  style={{
                    width: `${((currentQuestionIndex + 1) / generatedTest.questions.length) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Question Display */}
            <QuestionCard
              question={generatedTest.questions[currentQuestionIndex]}
              onAnswer={(answer) => handleAnswerSubmit(currentQuestionIndex, answer)}
              userAnswer={userAnswers[currentQuestionIndex]}
              followUpQuestion={followUpQuestions[currentQuestionIndex]}
            />

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="brutalist-button bg-[#1B4D3E] text-white px-4 py-2"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(generatedTest.questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === generatedTest.questions.length - 1}
                className="brutalist-button bg-[#1B4D3E] text-white px-4 py-2"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <GeneratedTests tests={generatedTests} />
    </div>
  );
};

export default TestingAgent;