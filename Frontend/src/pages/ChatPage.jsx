import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  const location = useLocation();
  const navigate = useNavigate();
  const repoFromUrl = new URLSearchParams(location.search).get('repo');

  useEffect(() => {
    let cancelled = false;

    const loadRepos = async () => {
      try {
        const res = await api.get('/repos');
        const completedRepos = (res.data.data || []).filter(
          repo => repo.status === 'completed'
        );

        if (cancelled) return;

        setRepos(completedRepos);

        if (
          repoFromUrl &&
          completedRepos.some(repo => repo._id === repoFromUrl)
        ) {
          setSelectedRepo(repoFromUrl);
        } else if (completedRepos.length > 0) {
          setSelectedRepo(completedRepos[0]._id);
        } else {
          setSelectedRepo('');
        }
      } catch (err) {
        console.error('Failed to load repositories:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });

        if (!cancelled) {
          setRepos([]);

          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
      }
    };

    loadRepos();

    return () => {
      cancelled = true;
    };
  }, [repoFromUrl, navigate]);

  useEffect(() => {
    if (!selectedRepo) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    const loadHistory = async () => {
      setIsLoading(true);

      try {
        const res = await api.get(`/chat/history/${selectedRepo}`);

        if (!cancelled) {
          setMessages(
            (res.data.data || []).map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load chat history:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });

        if (!cancelled) {
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }

          setMessages([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [selectedRepo, navigate]);

  const handleSend = async (e) => {
    e.preventDefault();

    const userMsg = input.trim();

    if (!userMsg || !selectedRepo || isLoading) return;

    setInput('');
    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMsg }
    ]);
    setIsLoading(true);

    try {
      const res = await api.post('/chat', {
        repoId: selectedRepo,
        message: userMsg
      });

      if (!res.data?.success || typeof res.data.answer !== 'string') {
        throw new Error('The backend returned an unexpected AI response.');
      }

      setMessages(prev => [
        ...prev,
        { role: 'ai', content: res.data.answer }
      ]);
    } catch (err) {
      console.error('Chat request failed:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });

      const status = err.response?.status;

      let errorMessage;

      if (status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
        localStorage.removeItem('token');
        navigate('/login');
      } else if (status === 404) {
        errorMessage =
          'The chat endpoint or selected repository was not found.';
      } else if (status === 500 || status === 502 || status === 503) {
        errorMessage =
          err.response?.data?.message ||
          'The backend or AI service failed. Check the backend terminal.';
      } else if (!err.response) {
        errorMessage =
          'Cannot reach the backend. Check whether Node.js is running on port 5000.';
      } else {
        errorMessage =
          err.response.data?.message ||
          `Request failed with status ${status}.`;
      }

      setMessages(prev => [
        ...prev,
        { role: 'ai', content: `Error: ${errorMessage}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col space-y-4">
      <ChatHeader
        repos={repos}
        selectedRepo={selectedRepo}
        onSelectRepo={setSelectedRepo}
      />

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors">
        <MessageList
          messages={messages}
          isLoading={isLoading}
        />

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