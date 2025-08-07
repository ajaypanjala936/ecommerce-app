










// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNotification } from '../context/NotificationContext';
// import './Notification.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
// const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/60?text=No+Image';

// const Notification = () => {
//   const { user, token } = useAuth();
//   const { markNotificationsRead } = useNotification();
//   const [notifications, setNotifications] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Normalize image URL
//   const normalizeImageUrl = (imageUrl) => {
//     if (!imageUrl) return PLACEHOLDER_IMAGE;
//     const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
//     if (normalized.startsWith('http')) return normalized;
//     if (!normalized.startsWith('/')) return `/${normalized}`;
//     return `${API_BASE}${normalized}`;
//   };

//   const fetchNotifications = async (markAsRead = false) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/notifications`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch notifications');
//       }

//       const data = await response.json();
//       setNotifications(
//         data.map(notification => ({
//           ...notification,
//           imageUrl: normalizeImageUrl(notification.imageUrl),
//         }))
//       );

//       if (markAsRead) {
//         try {
//           const unreadIds = data.filter(n => !n.isRead).map(n => n._id);
//           if (unreadIds.length > 0) {
//             const markResponse = await fetch(`${API_BASE}/api/notifications/mark-read`, {
//               method: 'POST',
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//               },
//             });
//             if (!markResponse.ok) {
//               const errorData = await markResponse.json();
//               throw new Error(errorData.error || 'Failed to mark notifications as read');
//             }
//             const result = await markResponse.json();
//             console.log('Notifications marked as read:', result.modifiedCount);
//             markNotificationsRead();
//           }
//         } catch (err) {
//           console.warn('Failed to mark notifications as read:', err.message);
//         }
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteNotification = async (notificationId) => {
//     if (!window.confirm('Are you sure you want to delete this notification?')) return;

//     const originalNotifications = [...notifications];
//     setNotifications(notifications.filter((n) => n._id !== notificationId));

//     try {
//       const response = await fetch(`${API_BASE}/api/notifications/${notificationId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to delete notification');
//       }

//       console.log(`Notification ${notificationId} deleted successfully`);
//     } catch (err) {
//       console.error('Delete notification error:', err.message);
//       setError(err.message);
//       setNotifications(originalNotifications);
//     }
//   };

//   useEffect(() => {
//     if (user && token) {
//       fetchNotifications(true); // Mark as read on initial load
//       const intervalId = setInterval(() => fetchNotifications(false), 10000); // Poll every 10 seconds
//       return () => clearInterval(intervalId);
//     }
//   }, [user, token]);

//   if (!user) {
//     return <div className="notifications-container">Please log in to view your notifications.</div>;
//   }

//   return (
//     <div className="notifications-container">
//       <h2>Notifications</h2>
//       {error && <p className="error-message">{error}</p>}
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : notifications.length === 0 ? (
//         <p>No notifications found.</p>
//       ) : (
//         <ul className="notifications-list">
//           {notifications.map((notification) => (
//             <li key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
//               <div className="notification-content">
//                 {notification.imageUrl && (
//                   <img
//                     src={notification.imageUrl}
//                     alt="Order item"
//                     className="notification-image"
//                     onError={(e) => {
//                       console.error(`Image load error for notification ${notification._id}: ${notification.imageUrl}`);
//                       e.target.src = PLACEHOLDER_IMAGE;
//                     }}
//                   />
//                 )}
//                 <div className="notification-details">
//                   <p>{notification.message}</p>
//                   {notification.totalPrice && (
//                     <p className="notification-price">Total: ${notification.totalPrice.toFixed(2)}</p>
//                   )}
//                   <span className="notification-timestamp">
//                     {new Date(notification.createdAt).toLocaleString()}
//                   </span>
//                 </div>
//                 <button
//                   className="delete-notification-btn"
//                   onClick={() => handleDeleteNotification(notification._id)}
//                   title="Delete notification"
//                 >
//                   🗑️
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notification;




// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNotification } from '../context/NotificationContext';
// import './Notification.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
// const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/60?text=No+Image';

// const Notification = () => {
//   const { user, token } = useAuth();
//   const { markNotificationsRead } = useNotification();
//   const [notifications, setNotifications] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Normalize image URL
//   const normalizeImageUrl = (imageUrl) => {
//     if (!imageUrl) return PLACEHOLDER_IMAGE;
//     const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
//     if (normalized.startsWith('http')) return normalized;
//     if (!normalized.startsWith('/')) return `/${normalized}`;
//     return `${API_BASE}${normalized}`;
//   };

//   const fetchNotifications = async (markAsRead = false) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/notifications`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch notifications');
//       }

//       const data = await response.json();
//       setNotifications(
//         data.map(notification => ({
//           ...notification,
//           imageUrl: normalizeImageUrl(notification.imageUrl),
//         }))
//       );

//       if (markAsRead) {
//         try {
//           const unreadIds = data.filter(n => !n.isRead).map(n => n._id);
//           if (unreadIds.length > 0) {
//             const markResponse = await fetch(`${API_BASE}/api/notifications/mark-read`, {
//               method: 'POST',
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//               },
//             });
//             if (!markResponse.ok) {
//               const errorData = await markResponse.json();
//               throw new Error(errorData.error || 'Failed to mark notifications as read');
//             }
//             const result = await markResponse.json();
//             console.log('Notifications marked as read:', result.modifiedCount);
//             markNotificationsRead();
//           }
//         } catch (err) {
//           console.warn('Failed to mark notifications as read:', err.message);
//         }
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteNotification = async (notificationId) => {
//     if (!window.confirm('Are you sure you want to delete this notification?')) return;

//     const originalNotifications = [...notifications];
//     setNotifications(notifications.filter((n) => n._id !== notificationId));

//     try {
//       const response = await fetch(`${API_BASE}/api/notifications/${notificationId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to delete notification');
//       }

//       console.log(`Notification ${notificationId} deleted successfully`);
//     } catch (err) {
//       console.error('Delete notification error:', err.message);
//       setError(err.message);
//       setNotifications(originalNotifications);
//     }
//   };

//   useEffect(() => {
//     if (user && token) {
//       fetchNotifications(true); // Mark as read on initial load
//       const intervalId = setInterval(() => fetchNotifications(false), 10000); // Poll every 10 seconds
//       return () => clearInterval(intervalId);
//     }
//   }, [user, token]);

//   if (!user) {
//     return <div className="notifications-container">Please log in to view your notifications.</div>;
//   }

//   return (
//     <div className="notifications-container">
//       <h2>Notifications</h2>
//       {error && <p className="error-message">{error}</p>}
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : notifications.length === 0 ? (
//         <p>No notifications found.</p>
//       ) : (
//         <ul className="notifications-list">
//           {notifications.map((notification) => (
//             <li key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
//               <div className="notification-content">
//                 {notification.type === 'chat' ? (
//                   <img
//                     src="https://img.icons8.com/windows/100/chat-message-sent.png"
//                     alt="Message notification"
//                     className="notification-message-icon"
//                     aria-label="Message notification"
//                   />
//                 ) : (
//                   notification.imageUrl && 
//                   notification.imageUrl !== PLACEHOLDER_IMAGE && 
//                   notification.imageUrl.trim() !== '' ? (
//                     <img
//                       src={notification.imageUrl}
//                       alt="Order item"
//                       className="notification-image"
//                       onError={(e) => {
//                         console.error(`Image load error for notification ${notification._id}: ${notification.imageUrl}`);
//                         e.target.src = PLACEHOLDER_IMAGE;
//                       }}
//                     />
//                   ) : (
//                     <img
//                       src="https://img.icons8.com/windows/100/chat-message-sent.png"
//                       alt="Message notification"
//                       className="notification-message-icon"
//                       aria-label="Message notification"
//                     />
//                   )
//                 )}
//                 <div className="notification-details">
//                   <p>{notification.message}</p>
//                   {notification.totalPrice && (
//                     <p className="notification-price">Total: ${notification.totalPrice.toFixed(2)}</p>
//                   )}
//                   <span className="notification-timestamp">
//                     {new Date(notification.createdAt).toLocaleString()}
//                   </span>
//                 </div>
//                 <button
//                   className="delete-notification-btn"
//                   onClick={() => handleDeleteNotification(notification._id)}
//                   title="Delete notification"
//                   aria-label="Delete notification"
//                 >
//                   🗑️
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notification;










import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import './Notification.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/60?text=No+Image';

const Notification = () => {
  const { user, token } = useAuth();
  const { markNotificationsRead } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Normalize image URL
  const normalizeImageUrl = (imageUrl) => {
    if (!imageUrl) return PLACEHOLDER_IMAGE;
    const normalized = imageUrl.replace(/^[Uu]ploads\//, '/Uploads/');
    if (normalized.startsWith('http')) return normalized;
    if (!normalized.startsWith('/')) return `/${normalized}`;
    return `${API_BASE}${normalized}`;
  };

  const fetchNotifications = async (markAsRead = false) => {
    try {
      const response = await fetch(`${API_BASE}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(
        data.map(notification => ({
          ...notification,
          imageUrl: normalizeImageUrl(notification.imageUrl),
        }))
      );

      if (markAsRead) {
        try {
          const unreadIds = data.filter(n => !n.isRead).map(n => n._id);
          if (unreadIds.length > 0) {
            const markResponse = await fetch(`${API_BASE}/api/notifications/mark-read`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            if (!markResponse.ok) {
              const errorData = await markResponse.json();
              throw new Error(errorData.error || 'Failed to mark notifications as read');
            }
            const result = await markResponse.json();
            console.log('Notifications marked as read:', result.modifiedCount);
            markNotificationsRead();
          }
        } catch (err) {
          console.warn('Failed to mark notifications as read:', err.message);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    const originalNotifications = [...notifications];
    setNotifications(notifications.filter((n) => n._id !== notificationId));

    try {
      const response = await fetch(`${API_BASE}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete notification');
      }

      console.log(`Notification ${notificationId} deleted successfully`);
    } catch (err) {
      console.error('Delete notification error:', err.message);
      setError(err.message);
      setNotifications(originalNotifications);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchNotifications(true); // Mark as read on initial load
      const intervalId = setInterval(() => fetchNotifications(false), 10000); // Poll every 10 seconds
      return () => clearInterval(intervalId);
    }
  }, [user, token]);

  if (!user) {
    return <div className="notifications-container">Please log in to view your notifications.</div>;
  }

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
              <div className="notification-content">
                {notification.type === 'chat' ? (
                  <img
                    src="https://img.icons8.com/windows/100/chat-message-sent.png"
                    alt="Message notification"
                    className="notification-message-icon"
                    aria-label="Message notification"
                  />
                ) : (
                  notification.imageUrl && 
                  notification.imageUrl !== PLACEHOLDER_IMAGE && 
                  notification.imageUrl.trim() !== '' ? (
                    <img
                      src={notification.imageUrl}
                      alt="Order item"
                      className="notification-image"
                      onError={(e) => {
                        console.error(`Image load error for notification ${notification._id}: ${notification.imageUrl}`);
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  ) : (
                    <img
                      src="https://img.icons8.com/windows/100/chat-message-sent.png"
                      alt="Message notification"
                      className="notification-message-icon"
                      aria-label="Message notification"
                    />
                  )
                )}
                <div className="notification-details">
                  <p>{notification.message}</p>
                  {notification.totalPrice && (
                    <p className="notification-price">Total: {notification.totalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                  )}
                  <span className="notification-timestamp">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  className="delete-notification-btn"
                  onClick={() => handleDeleteNotification(notification._id)}
                  title="Delete notification"
                  aria-label="Delete notification"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;