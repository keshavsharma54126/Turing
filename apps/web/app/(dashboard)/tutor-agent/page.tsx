"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const TutorAgent = () => {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const router = useRouter();

  useEffect(()=>{
    let token = '';
    if(typeof window !== 'undefined'){
      token = localStorage.getItem('authToken')!;
    }
    if(!token){
      router.push('/signin');
    }
  },[router])

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setChatHistory(prev => [...prev, { type: 'user', content: question }]);

    try {
      let token;
      if(typeof window !== 'undefined'){
        token = localStorage.getItem('authToken');
      }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversations/tutor`,
        { question, context },
        {
          headers: {
            Authorization: `Bearer ${token}}`,
          },
        }
      );
      
      setResponse(response.data.answer);
      setChatHistory(prev => [...prev, { type: 'ai', content: response.data.answer }]);
      setQuestion('');
    } catch (error) {
      console.error('Error getting tutor response:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">AI Tutor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="brutalist-card bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Learning Context</h2>
          <textarea
            className="w-full p-4 border-2 border-[#1B4D3E] font-mono mb-4 min-h-[200px]"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Optional: Add any relevant learning materials or context..."
          />
        </div>

        <div className="brutalist-card bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Ask a Question</h2>
          <textarea
            className="w-full p-4 border-2 border-[#1B4D3E] font-mono mb-4"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to learn about?"
          />
          
          <button
            onClick={handleAskQuestion}
            disabled={isLoading}
            className="brutalist-button bg-[#1B4D3E] text-white px-6 py-3 w-full"
          >
            {isLoading ? 'Thinking...' : 'Ask Question'}
          </button>
        </div>
      </div>

      {chatHistory.length > 0 && (
        <div className="brutalist-card bg-white p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Conversation</h2>
          <div className="space-y-4">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-[#E0F4FF] ml-auto max-w-[80%]' 
                    : 'bg-[#F7CAC9] mr-auto max-w-[80%]'
                }`}
              >
                <p className="font-mono whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorAgent;