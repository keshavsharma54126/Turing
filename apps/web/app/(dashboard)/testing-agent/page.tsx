"use client"
import { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';
import GeneratedTests from '../../../components/generatedTests';
import { dummyTests } from '../../../dummyTests';
import { Dropbox } from '@repo/ui/dropbox';
import { Router } from 'express';
import { useRouter } from 'next/navigation';

interface TestInput {
  files: File[];
  links: string[];
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
}
interface Test{
  id:string;
  title:string;
  date:string;
  difficulty:string;
  numQuestions:number;
  topic:string;
  pdfUrl:string[];
  urls:string[];
  questions:any[];
  isCompleted:boolean;
  answers:any[];
  score?:number;
  performance?:{
    correct:number;
    incorrect:number;
    skipped:number;
    avgTimePerQuestion?:number;
  }
  
}
interface GeneratedTest {
  id: string;
  title: string;
  date: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  score?: number;
  topic: string;
  performance?: {
    correct: number;
    incorrect: number;
    skipped: number;
    avgTimePerQuestion?: number;
  };
}

const studyTips = [
  "Break your study sessions into 25-minute chunks (Pomodoro Technique)",
  "Try teaching the concept to someone else to master it",
  "Create mind maps to connect different topics",
  "Take short breaks every hour to maintain focus",
  "Review your notes before going to bed for better retention",
];

const motivationalQuotes = [
  "The expert in anything was once a beginner. — Helen Hayes",
  "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
  "Education is not preparation for life; education is life itself — John Dewey",
  "The more that you read, the more things you will know. — Dr. Seuss",
  "Success is not final, failure is not fatal. It is the courage to continue that counts. — Winston Churchill",
];

const TestingAgent = () => {
  const [testInput, setTestInput] = useState<TestInput>({
    files: [],
    links: [],
    topic: '',
    difficulty: 'medium',
    numQuestions: 5
  });
  const [currentLink, setCurrentLink] = useState('');
  const [generatedTest, setGeneratedTest] = useState<Test | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTests, setGeneratedTests] = useState(dummyTests);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const[referenceLinks, setReferenceLinks] = useState<string>();
  const[urls, setUrls] = useState<string[]>([]);
  const[topic, setTopic] = useState<string>("");
  const[difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const[numQuestions, setNumQuestions] = useState<number>(5);
  const router = useRouter();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentTipIndex(prev => (prev + 1) % studyTips.length);
        setCurrentQuoteIndex(prev => (prev + 1) % motivationalQuotes.length);
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const isValidUrl = (url: string) => {
    try{
      new URL(url);
      return true;
    }catch(error){
      return false;
    }
  };

  const parseLinks = (input: string): string[] => {
    try {
      const rawLinks = input.split(/[\n\s,]+/).filter((link) => link.trim());
      return rawLinks.map((link: string) => {
        if (!link.startsWith("http://") && !link.startsWith("https://")) {
          return "https://" + link;
        }
        return link;
      }).filter((link: string) => isValidUrl(link));
    } catch (error) {
      console.error("Error parsing links", error);
      return [];
    }
  }

  const handleAddLink = (referenceLinks:string)=>{
    console.log(referenceLinks);
    const parsedLinks = parseLinks(referenceLinks);
    console.log(parsedLinks);
    setUrls(prev=>[...prev, ...parsedLinks]);
    console.log(urls);
  }

  const handleRemoveLink = (index:number)=>{
    setUrls(prev => prev.filter((_, i) => i !== index));
  }



  const handleGenerateTest = async () => {
    setIsLoading(true);
    try {
      let token = "";
     if(typeof window !== 'undefined'){
      token = localStorage.getItem("authToken")!;
     }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tests/generate-test`,{
        title: topic,
        topic: topic,
        difficulty: difficulty,
        numQuestions: numQuestions,
        pdfUrl: pdfUrls,
        urls: urls
      },{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      })
      console.log(response.data);
      setGeneratedTests((prev: any) => [response.data.test, ...prev]);
      setGeneratedTest(response.data.test);
      router.push(`/test/${response.data.test.id}`);

    } catch (error) {
      console.error('Error generating test:', error);
      
    }
    setIsLoading(false);
    
  };


  if(isLoading){
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#1B4D3E] to-[#2C7A7B] text-white p-6">
        <div className="max-w-2xl w-full space-y-8 text-center">
          {/* Loading Animation */}
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin mx-auto" />
            <div className="mt-4 text-xl font-semibold">
              Preparing Your Perfect Study Materials...
            </div>
          </div>

          {/* Progress Animation */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-8">
            <div className="bg-white h-2 rounded-full animate-progress"></div>
          </div>

          {/* Motivational Quote */}
          <div className="space-y-4 transition-opacity duration-500 animate-fade-in">
            <blockquote className="text-2xl font-serif italic">
              {motivationalQuotes[currentQuoteIndex]}
            </blockquote>
          </div>

          {/* Study Tip */}
          <div className="mt-8 p-6 bg-white/10 rounded-lg backdrop-blur-sm transition-opacity duration-500 animate-fade-in">
            <h3 className="text-lg font-semibold mb-2">💡 Quick Study Tip:</h3>
            <p className="text-md">{studyTips[currentTipIndex]}</p>
          </div>

          {/* Loading Message */}
          <div className="text-sm text-white/80 animate-pulse">
            Creating personalized questions based on your materials...
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 max-w-7xl mx-auto overflow-y-auto h-screen">
      <div className="flex-1 mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">AI Test Generator</h1>
        
        <div className="brutalist-card bg-white p-6 mb-8 space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Upload Learning Materials</h2>
            <div className="border-2 border-dashed border-[#1B4D3E] p-6 rounded-lg text-center">
          
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Dropbox 
                setPdfUrls={setPdfUrls} 
                accessKeyId={process.env.NEXT_PUBLIC_ACCESS_KEY_ID!} 
                secretAccessKey={process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY!} 
                region={process.env.NEXT_PUBLIC_REGION!} 
                bucketName={process.env.NEXT_PUBLIC_BUCKET_NAME!}
                setHasSubmitted={setHasSubmitted}
              />
                
              </label>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Add Reference Links</h2>
            <div className="flex gap-2">
              <input
                type="url"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
                placeholder="Enter URL"
                className="flex-1 p-2 border-2 border-[#1B4D3E] font-mono"
              />
              <button
                onClick={()=>handleAddLink(referenceLinks as string)}
                className="brutalist-button bg-[#1B4D3E] text-white px-4"
              >
                Add
              </button>
            </div>
            
            {/* Link List */}
            {urls.length > 0 && (
              <div className="space-y-2">
                {urls.map((link, idx) => (
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
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the main topic or subject"
              className="w-full p-2 border-2 border-[#1B4D3E] font-mono"
            />
          </div>

          {/* Test Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-mono block mb-2">Difficulty Level:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard' )}
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
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
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
          <div className="brutalist-card bg-white p-6 mb-8 max-w-4xl mx-auto">
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Question {currentQuestionIndex + 1} of {generatedTest.questions.length}
                </h2>
                <span className="font-mono text-sm">
                  Topic: {generatedTest.topic}
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
      <GeneratedTests  />
    </div>
  );
};

export default TestingAgent;