"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Dropbox } from '@repo/ui/dropbox';
import { LinkIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

const TutorAgent = () => {
  const [pdfUrls,setPdfUrls] = useState<string[]>([])
  const[referenceLinks, setReferenceLinks] = useState<string>();
  const[urls, setUrls] = useState<string[]>([]);
  const[hasSubmitted,setHasSubmitted] = useState(false)
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const[memory,setMemory] = useState<string>("")
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const router = useRouter();
  const params = useParams()
  const convoId = params.convoId

  useEffect(()=>{
    let token = '';
    if(typeof window !== 'undefined'){
      token = localStorage.getItem('authToken')!;
    }
    if(!token){
      router.push('/signin');
    }
    const getResources = async()=>{
      try{
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversations/${convoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if(res.status===200){
          setMemory("Memory Updated Successfully")
        }
        else{
          setMemory("Could Not Update Memory")
        }
      }catch(err){
        console.error("error while getting resources",err)
      }
    }
    getResources()
  },[router])

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

  
  const handleAddContext = async () => {
    setIsLoading(true);
    try {
      let token = "";
     if(typeof window !== 'undefined'){
      token = localStorage.getItem("authToken")!;
     }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversations/addContext`,{
        pdfUrl: pdfUrls,
        urls: urls,
        conversationId:convoId
      },{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      })
      console.log(response.data)
      

    } catch (error) {
      console.error('Error generating test:', error);
      
    }
    setIsLoading(false);
    
  };

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

  if(isLoading){
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-[#1B4D3E] animate-pulse">
            Processing your request...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-[1920px] mx-auto overflow-y-auto max-h-screen">
      <div className="flex items-center justify-between mb-2 p-2 bg-white brutalist-card">
        <h2 className="text-3xl font-bold">AI Tutor</h2>
        <button 
          onClick={() => router.push('/tutor-agent')} 
          className="brutalist-button bg-[#1B4D3E] text-white px-4 py-2 flex items-center gap-2"
        >
          <span>←</span> Back to Conversations
        </button>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-5 space-y-6">
          <div className="brutalist-card bg-white p-6 max-h-[400px] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Learning Context</h2>
              <button
                onClick={() => {
                  if (pdfUrls.length > 0 || urls.length > 0) {
                    console.log("Adding context:", { pdfUrls, urls });
                    handleAddContext()
                  }
                }}
                className="brutalist-button bg-[#1B4D3E] text-white px-4 py-2"
              >
                Add Context
              </button>
            </div>
            <Dropbox
              setPdfUrls={setPdfUrls} 
              accessKeyId={process.env.NEXT_PUBLIC_ACCESS_KEY_ID!} 
              secretAccessKey={process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY!} 
              region={process.env.NEXT_PUBLIC_REGION!} 
              bucketName={process.env.NEXT_PUBLIC_BUCKET_NAME!}
              setHasSubmitted={setHasSubmitted}
            />
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
          </div>

          <div className="brutalist-card bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Ask a Question</h2>
            <textarea
              className="w-full p-4 border-2 border-[#1B4D3E] font-mono mb-4 min-h-[150px]"
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

        <div className="col-span-12 md:col-span-7 max-h-screen">
          <div className="brutalist-card bg-white p-6 h-[calc(100vh-12rem)] flex flex-col">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold mb-2">Conversation</h2>
              {memory && (
                <p className="text-sm text-gray-600 font-medium bg-green-50 px-3 py-2 rounded-md border border-green-200">
                  {memory}
                </p>
              )}
            </div>
            {chatHistory.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p className="font-mono">Start a conversation by asking a question...</p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 overflow-y-auto pb-4 max-h-screen">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorAgent;