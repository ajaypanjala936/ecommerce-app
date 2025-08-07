// import React, { createContext, useContext, useState } from 'react';

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [unreadCount, setUnreadCount] = useState(0);

//   return (
//     <ChatContext.Provider value={{ unreadCount, setUnreadCount }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };







import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export const ChatProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.token || !user?.id) {
        console.warn('Cannot fetch unread count: User not authenticated');
        setUnreadCount(0);
        return;
      }
      if (isMarkingRead) {
        console.log('Skipping unread count fetch: Messages recently marked as read');
        return;
      }
      try {
        console.log('Fetching unread count with token:', user.token.slice(0, 10) + '...');
        const response = await fetch(`${API_BASE}/api/chat/unread`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Unread count response:', { status: response.status, ok: response.ok });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch unread count');
        }

        const data = await response.json();
        console.log('Unread count:', data.count);
        setUnreadCount(data.count);
      } catch (err) {
        console.error('Fetch unread count error:', err.message);
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, [user?.token, user?.id, isMarkingRead]);

  const markMessagesRead = () => {
    setIsMarkingRead(true);
    setUnreadCount(0);
    setTimeout(() => setIsMarkingRead(false), 10000); // Allow fetch after next poll
  };

  return (
    <ChatContext.Provider value={{ unreadCount, setUnreadCount, markMessagesRead }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};