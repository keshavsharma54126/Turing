"use client"

import { useState, useEffect } from 'react';
import { MessageSquarePlus, Loader2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Conversation {
  id:string,
  userId:string,
  topic:string,
  message:[]
  createdAt:Date
}

const TutorAgent = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const router = useRouter()

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        let token= ''
        if(typeof Window !==undefined ){
          token = localStorage.getItem("authToken") as string
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/conversation`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setConversations(response.data.conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  const handleStartConversation = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversations/newSession`,
        {
          topic
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const fetchConversations = async () => {
        try {
          let token= ''
          if(typeof Window !==undefined ){
            token = localStorage.getItem("authToken") as string
          }
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/conversation`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setConversations(response.data.conversations);
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      };
  
      fetchConversations();

    } catch (error) {
      console.error('Error creating conversation:', error);
    }
    setLoading(false);
  };

  const navigateToConversation  = (conversation:Conversation)=>{
    setSelectedConversation(conversation.id) 
    router.push(`/${conversation.id}`)
  }

  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    try {
      const token = localStorage.getItem('authToken');
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(res.data.message)

    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Topic Input Section */}
      <div className="mb-6">
        <label htmlFor="topic" className="block text-lg font-medium text-gray-700 mb-2">
          What would you like to learn about?
        </label>
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., 'JavaScript Promises' or 'React Hooks')"
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#31a783] focus:ring-2 focus:ring-[#31a783] focus:ring-opacity-50 outline-none transition-colors font-mono"
        />
      </div>

      <button
        onClick={handleStartConversation}
        disabled={!topic.trim()}
        className={`w-full brutalist-button ${
          topic.trim() 
            ? 'bg-[#31a783] hover:bg-[#42bba3]' 
            : 'bg-gray-400 cursor-not-allowed'
        } text-white px-4 py-3 flex items-center justify-center gap-2 mb-6 transition-colors`}
      >
        <MessageSquarePlus size={20} />
        <span className="font-mono">Start Learning About {topic || '...'}</span>
      </button>

      {/* Conversations List */}
      <div className="space-y-4 overflow-y-auto h-screen">
        {conversations.map((conversation:Conversation) => (
          <div
            key={conversation.id}
            onClick={()=> navigateToConversation(conversation)}
            className={`p-4 cursor-pointer hover:bg-[#42bba3] transition-colors rounded-lg border ${
              selectedConversation === conversation.id ? 'bg-[#31a783] text-white' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold mb-1 truncate">{conversation.topic}</h3>
                <span className="text-xs text-gray-500">
                  {new Date(conversation.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={(e) => handleDeleteConversation(e, conversation.id)}
                className="p-2 hover:bg-red-100 rounded-full transition-colors"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorAgent;
