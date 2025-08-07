import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export const NotificationProvider = ({ children }) => {
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.id || !token) {
        console.warn('Cannot fetch unread notification count: User not authenticated');
        setUnreadNotificationCount(0);
        return;
      }
      if (isMarkingRead) {
        console.log('Skipping unread notification count fetch: Notifications recently marked as read');
        return;
      }
      try {
        console.log('Fetching unread notification count with token:', token.slice(0, 10) + '...');
        const response = await fetch(`${API_BASE}/api/notifications/unread`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Unread notification count response:', { status: response.status, ok: response.ok });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch unread notification count');
        }

        const data = await response.json();
        console.log('Unread notification count:', data.count);
        setUnreadNotificationCount(data.count);
      } catch (err) {
        console.error('Fetch unread notification count error:', err.message);
        setUnreadNotificationCount(0);
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, [user?.id, token, isMarkingRead]);

  const markNotificationsRead = () => {
    setIsMarkingRead(true);
    setUnreadNotificationCount(0);
    setTimeout(() => setIsMarkingRead(false), 10000); // Allow fetch after next poll
  };

  return (
    <NotificationContext.Provider value={{ unreadNotificationCount, setUnreadNotificationCount, markNotificationsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};