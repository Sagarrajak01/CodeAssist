import React from 'react';
import ReactMarkdown from 'react-markdown';
import Icons from '../icons/Icons';

const MessageList = ({ messages, isLoading }) => (
  <div className="flex-1 p-6 overflow-y-auto space-y-6">
    {messages.length === 0 ? (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
          <Icons.MessageSquare />
        </div>
        <p>Select a repository and ask a question about its architecture or code.</p>
        <p className="text-sm mt-2">Example: "Where is the user authentication logic located?"</p>
      </div>
    ) : (
      messages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] p-4 rounded-xl shadow-sm overflow-hidden ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700 rounded-bl-none'}`}>
            {msg.role === 'user' ? (
               <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            ) : (
              <div className="markdown-body text-sm leading-relaxed prose dark:prose-invert max-w-none">
                <ReactMarkdown
                  children={msg.content}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      return !inline ? (
                        <pre className="bg-slate-800 text-slate-50 p-4 rounded-xl overflow-x-auto my-3 text-sm border border-slate-700">
                          <code className={className} {...props}>{children}</code>
                        </pre>
                      ) : (
                        <code className="bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded px-1.5 py-0.5 font-mono text-xs" {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))
    )}
    {isLoading && (
      <div className="flex justify-start">
        <div className="max-w-[80%] p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-bl-none animate-pulse flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
        </div>
      </div>
    )}
  </div>
);

export default MessageList;