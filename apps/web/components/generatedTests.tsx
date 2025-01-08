import Link from 'next/link';
import { Calendar, Clock, Award, ChevronRight, ChevronLeft, Target, Brain, CheckCircle, Delete, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
  createdAt:string;
  performance?:{
    correct:number;
    incorrect:number;
    skipped:number;
    avgTimePerQuestion?:number;
  }
  
}


interface GeneratedTestsProps {
  tests: Test[];
}

const GeneratedTests = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [generatedTests, setGeneratedTests] = useState<Test[]>([]);

  useEffect(()=>{
    const fetchTests = async()=>{
      try{
        const token = localStorage.getItem("authToken");
        if(!token){
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/tests`,
          {
            headers:{
              "Authorization":`Bearer ${token}`
            }
          }
        );
        setGeneratedTests(response.data.tests);
      }catch(error){
        console.error("Error fetching tests",error);
      }
    }
    fetchTests();
  },[]);

  const handleDelete = async(testId:string)=>{
    try{
      const token = localStorage.getItem("authToken");
      if(!token){
        return;
      }
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tests/delete-test/${testId}`,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      setGeneratedTests(generatedTests.filter((test)=>test.id !== testId));
    }catch(error){
      console.error("Error deleting test",error);
     
    }
  }


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-[#4CAF50] bg-[#E5FFE0]';
      case 'medium': return 'text-[#FF9800] bg-[#FFE8D6]';
      case 'hard': return 'text-[#F44336] bg-[#FFE2E0]';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className={`fixed right-0 top-24 h-screen bg-white border-l border-gray-200 transition-all duration-300 ${isExpanded ? 'w-96' : 'w-12'}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-4 top-8 bg-[#1B4D3E] text-white p-2 rounded-full shadow-lg hover:bg-[#2A6B5D] transition-colors"
      >
        {isExpanded ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`${isExpanded ? 'opacity-100' : 'opacity-0 invisible'} transition-opacity duration-300`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Generated Tests</h2>
        </div>
        
        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {generatedTests.map((test) => (
            <div key={test.id} className="group relative">
              <div>
                <Link 
                  href={`/test/${test.id}`}
                  key={test.id}
                  className="block p-3 hover:bg-gray-100 transition-colors"
                  prefetch={false}
                >
                  <h3 className="font-medium truncate mb-1">{test.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty}
                    </span>
                  </div>
                  
                </Link>
                <button onClick={()=>handleDelete(test.id)} className="absolute top-0 right-0 text-[#1B4D3E] hover:text-[#2A6B5D] transition-colors">
                  <Trash2 size={30} className="cursor-pointer text-red-500 hover:text-red-600" />
                </button>
              </div>
              

              {/* Hover Stats Card */}
              <div className="absolute right-full top-0 mr-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 bg-white rounded-lg shadow-lg border-2 border-[#1B4D3E]">
                  <h3 className="font-bold text-lg mb-3">{test.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-[#1B4D3E]" />
                      <span>Created: {new Date(test.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Target className="w-4 h-4 mr-2 text-[#1B4D3E]" />
                      <span>Topic: {test.topic}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Brain className="w-4 h-4 mr-2 text-[#1B4D3E]" />
                      <span>{test.numQuestions} questions</span>
                    </div>
                    {test.score !== undefined && (
                      <div className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-[#1B4D3E]" />
                        <span>Score: {test.score}%</span>
                      </div>
                    )}
                    {test.performance && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md space-y-2">
                        <div className="text-sm font-semibold">Performance Stats:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-green-600">Correct: {test.performance.correct}</div>
                          <div className="text-red-600">Incorrect: {test.performance.incorrect}</div>
                          <div className="text-gray-600">Skipped: {test.performance.skipped}</div>
                          {test.performance.avgTimePerQuestion && (
                            <div className="text-blue-600">
                              Avg Time: {test.performance.avgTimePerQuestion}s
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneratedTests;