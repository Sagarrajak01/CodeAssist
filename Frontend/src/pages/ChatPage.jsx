import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import ChatInputBox from '../components/chat/ChatInputBox';

const ChatPage = () => {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const queryParams = new URLSearchParams(useLocation().search);
  const repoFromUrl = queryParams.get('repo');

  useEffect(() => {
    api.get('/repos').then(res => {
      const completedRepos = res.data.data.filter(r => r.status === 'completed');
      setRepos(completedRepos);
      
      if (repoFromUrl && completedRepos.find(r => r._id === repoFromUrl)) {
        setSelectedRepo(repoFromUrl);
      } else if (completedRepos.length > 0) {
        setSelectedRepo(completedRepos[0]._id);
      }
    }).catch(err => console.error(err));
  }, [repoFromUrl]);

  useEffect(() => {
    if (!selectedRepo) return;
    
    setIsLoading(true);
    setMessages([]);
    
    api.get(`/chat/history/${selectedRepo}`)
      .then(res => setMessages(res.data.data.map(msg => ({ role: msg.role, content: msg.content }))))
      .catch(err => console.error("Failed to load history:", err))
      .finally(() => setIsLoading(false));
  }, [selectedRepo]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedRepo) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await api.post('/chat', { repoId: selectedRepo, message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error: Failed to connect to AI engine. Is the Python service running?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col space-y-4">
      <ChatHeader 
        repos={repos} 
        selectedRepo={selectedRepo} 
        onSelectRepo={(val) => { setSelectedRepo(val); setMessages([]); }} 
      />
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors">
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInputBox 
          input={input} 
          setInput={setInput} 
          handleSend={handleSend} 
          isLoading={isLoading} 
          hasRepos={repos.length > 0} 
        />
      </div>
    </div>
  );
};

export default ChatPage;