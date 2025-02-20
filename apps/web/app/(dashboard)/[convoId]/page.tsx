"use client"
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Dropbox } from '@repo/ui/dropbox';
import { LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams } from 'next/navigation';

interface conversation{

}

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  isLoading?: boolean;
  isStreaming?: boolean;
}

const TutorAgent = () => {
  const [pdfUrls,setPdfUrls] = useState<string[]>([])
  const[conversation,setConversation] = useState<any>({})
  const[referenceLinks, setReferenceLinks] = useState<string>();
  const[urls, setUrls] = useState<string[]>([]);
  const[hasSubmitted,setHasSubmitted] = useState(false)
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const[memory,setMemory] = useState<string>("currently no memory")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const useChatRef = useRef<ChatMessage[]>()
  const router = useRouter();
  const params = useParams()
  const [responseLoading,setResponseLoading] = useState(false)
  const convoId = params.convoId
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showContext, setShowContext] = useState(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

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
        console.log(res.data.conversation)
        setConversation(res.data.conversation)
        setChatHistory(res.data.conversation.messages)
        if(res.status===200 ){
          setMemory("Memory Updated Successfully")
        }
        else{
          setMemory("Currently there is no memory for this conversation")
        }
        setTimeout(scrollToBottom, 100);
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
      token = localStorage.getItem("authToken") as string
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
    
    setChatHistory(prev => [...prev, { type: 'user', content: question }]);
    setChatHistory(prev => [...prev, { 
      type: 'ai', 
      content: '', 
      isLoading: true,
      isStreaming: true 
    }]);
    
    try {
        setQuestion('');
        const token = localStorage.getItem("authToken") as string;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversations/chat-stream`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question,
                conversationId: convoId,
                chatHistory
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No reader available');
        }
        
        let messageString = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                setChatHistory((prev:any) => {
                    const newHistory = [...prev];
                    const lastMessage = newHistory[newHistory.length - 1];
                    return [...prev.slice(0, -1), { 
                        ...lastMessage, 
                        isLoading: false,
                        isStreaming: false 
                    }];
                });
                break;
            }

            // Decode the chunk
            const text = new TextDecoder().decode(value);
            const lines = text.split('\n');

            for (const line of lines) {
                if (line.trim() === '') continue;
                
                try {
                    // Clean the line and remove the SSE prefix
                    const cleanedLine = line.trim().replace(/^data: /, '');
                    const data = JSON.parse(cleanedLine);
                    
                    if (data.text) {
                        messageString += data.text;
                        
                        // Update chat history with the new chunk
                        setChatHistory(prev => {
                            const newHistory = [...prev];
                            const lastMessage = newHistory[newHistory.length - 1];
                            return [...prev.slice(0, -1), {
                                type: 'ai',
                                content: messageString,
                                isStreaming: true
                            }];
                        });
                    }
                } catch (e) {
                    console.error('Error parsing chunk:', e);
                    console.log('Problematic line:', line);
                }
            }
        }

        // After the stream is complete, update the chat history in the backend
        useChatRef.current = [...(useChatRef.current || []), 
            { type: 'user', content: question },
            { type: 'ai', content: messageString }
        ];
        
        await sendChatHistoryToBackend(useChatRef.current);
        
    } catch (error) {
        console.error('Error:', error);
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = {
                type: 'ai',
                content: 'Sorry, an error occurred.',
                isLoading: false,
                isStreaming: false
            };
            return newHistory;
        });
    }
  };

  const sendChatHistoryToBackend = async (chatHistory: ChatMessage[]) => {
    try {

      const token= localStorage.getItem("authToken") as string
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversations/updateChatHistory`, {
        conversationId: convoId,
        chatHistory: chatHistory
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log(response.data)
    } catch (error) {
      console.error('Error updating chat history:', error);
    }
  }

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
    <div className="p-1 sm:p-2 max-w-[1920px] mx-auto overflow-y-auto h-[calc(100dvh-1rem)]">
      <div className="flex items-center justify-between mb-2 p-1 bg-white brutalist-card mx-2 md:mx-0 text-sm md:text-base">
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-2xl font-bold truncate">
            {conversation?.topic || 'New Conversation'}
          </h1>
          <button 
            onClick={() => router.push('/tutor-agent')} 
            className="brutalist-button bg-[#1B4D3E] text-white px-4 py-2 flex items-center gap-2"
          >
            <span>←</span> Back to Conversations
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => setShowContext(!showContext)}
        className="md:hidden w-full mb-2 py-1.5 px-2 brutalist-card bg-white flex items-center justify-between mx-2 text-sm"
      >
        <span>Learning Context</span>
        {showContext ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      <div className="grid grid-cols-12 gap-2 sm:gap-4 px-2 md:px-0">
        <div className="col-span-12 md:col-span-5 space-y-2 sm:space-y-4">
          <div className={`brutalist-card bg-white p-1.5 sm:p-3 max-h-[400px] overflow-y-auto text-sm md:text-base ${showContext ? 'block' : 'hidden md:block'}`}>
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

          <div className="brutalist-card bg-white p-1.5 sm:p-3 text-sm md:text-base">
            <h2 className="text-xl font-bold mb-4">Ask a Question</h2>
            <textarea
              className="w-full resize-none border rounded p-2 h-[60px] md:h-[120px]"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to learn about?"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // Prevent default to avoid new line
                  handleAskQuestion();
                }
              }}
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

        <div className="col-span-12 md:col-span-7">
          <div className="brutalist-card bg-white p-1.5 sm:p-3 h-[calc(100dvh-26rem)] md:h-[calc(100dvh-12rem)] flex flex-col text-sm md:text-base">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold mb-2">Conversation</h2>
              {memory && (
                <p className={`text-sm font-medium px-3 py-2 rounded-md border ${
                  memory === "Currently there is no memory for this conversation"
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-green-50 text-green-600 border-green-200"
                }`}>
                  {memory}
                </p>
              )}
            </div>
            {chatHistory.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p className="font-mono">Start a conversation by asking a question...</p>
              </div>
            ) : (
              <div 
                ref={chatContainerRef}
                className="space-y-4 flex-1 overflow-y-auto pb-4"
              >
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-[#1B4D3E] text-white'
                          : 'bg-gray-100 text-gray-800'
                      } ${message.isStreaming ? 'animate-pulse' : ''}`}
                    >
                      {message.isStreaming ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#1B4D3E] rounded-full animate-bounce" 
                               style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-[#1B4D3E] rounded-full animate-bounce" 
                               style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-[#1B4D3E] rounded-full animate-bounce" 
                               style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          {message.content.split('\n').map((line, i) => (
                            <p key={i} className="mb-2">{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
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