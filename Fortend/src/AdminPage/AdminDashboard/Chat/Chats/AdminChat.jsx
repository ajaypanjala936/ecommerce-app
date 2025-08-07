


// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../../../context/AuthContext';
// import './AdminChat.css';
// import Feedbacks from '../Feedbacks/Feedbacks';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// const AdminChat = () => {
//   const [chats, setChats] = useState([]);
//   const [reply, setReply] = useState('');
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [error, setError] = useState(null);
//   const [isSending, setIsSending] = useState(false);
//   const [activeView, setActiveView] = useState('chats');
//   const { user, token, refreshToken } = useAuth();

//   const fetchChats = async () => {
//     if (!user?.token || user.role !== 'admin') {
//       setError('Unauthorized or not an admin.');
//       return;
//     }
//     try {
//       console.log('Fetching all chats with token:', user.token.slice(0, 10) + '...');
//       let response = await fetch(`${API_BASE}/api/chat/all`, {
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       console.log('Fetch chats response:', { status: response.status, ok: response.ok });

//       if (response.status === 401) {
//         const newToken = await refreshToken();
//         if (newToken) {
//           response = await fetch(`${API_BASE}/api/chat/all`, {
//             headers: {
//               'Authorization': `Bearer ${newToken}`,
//               'Content-Type': 'application/json'
//             }
//           });
//         }
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Non-JSON response:', text.slice(0, 100));
//         throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch chats');
//       }

//       const data = await response.json();
//       console.log('Fetched chats:', data.length, data.map(chat => ({
//         sender: chat.sender?.email,
//         receiver: chat.receiver?.email,
//         senderRole: chat.sender?.role,
//         receiverRole: chat.receiver?.role
//       })));
//       setChats(data);
//     } catch (err) {
//       console.error('Fetch chats error:', err.message, err.stack);
//       setError(err.message);
//       if (err.message.includes('Failed to refresh token')) {
//         setError('Session expired. Please log in again.');
//       }
//     }
//   };

//   const sendReply = async (e) => {
//     e.preventDefault();
//     if (!reply.trim() || !selectedUserId || !user?.token) {
//       setError('Please enter a reply and select a user.');
//       return;
//     }

//     setIsSending(true);
//     setError(null);

//     try {
//       console.log('Sending reply:', { content: reply, receiverId: selectedUserId });
//       let response = await fetch(`${API_BASE}/api/chat/reply`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ content: reply, receiverId: selectedUserId })
//       });
//       console.log('Send reply response:', { status: response.status, ok: response.ok });

//       if (response.status === 401) {
//         const newToken = await refreshToken();
//         if (newToken) {
//           console.log('Retrying with new token:', newToken.slice(0, 10) + '...');
//           response = await fetch(`${API_BASE}/api/chat/reply`, {
//             method: 'POST',
//             headers: {
//               'Authorization': `Bearer ${newToken}`,
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ content: reply, receiverId: selectedUserId })
//           });
//         }
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Non-JSON response:', text.slice(0, 100));
//         throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Reply error data:', errorData);
//         throw new Error(errorData.error || 'Failed to send reply');
//       }

//       const newMessage = await response.json();
//       console.log('Reply sent:', newMessage);
//       setChats([...chats, newMessage]);
//       setReply('');
//       await fetchChats();
//     } catch (err) {
//       console.error('Send reply error:', err.message, err.stack);
//       setError(`Failed to send reply: ${err.message}`);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const sendHelpfulPrompt = async () => {
//     if (!selectedUserId || !user?.token) {
//       setError('Please select a user.');
//       return;
//     }

//     setIsSending(true);
//     setError(null);

//     try {
//       console.log('Sending helpful prompt:', { content: 'Is this information helpful?', receiverId: selectedUserId });
//       let response = await fetch(`${API_BASE}/api/chat/reply`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ content: 'Is this information helpful?', receiverId: selectedUserId })
//       });
//       console.log('Send helpful prompt response:', { status: response.status, ok: response.ok });

//       if (response.status === 401) {
//         const newToken = await refreshToken();
//         if (newToken) {
//           console.log('Retrying with new token:', newToken.slice(0, 10) + '...');
//           response = await fetch(`${API_BASE}/api/chat/reply`, {
//             method: 'POST',
//             headers: {
//               'Authorization': `Bearer ${newToken}`,
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ content: 'Is this information helpful?', receiverId: selectedUserId })
//           });
//         }
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Non-JSON response:', text.slice(0, 100));
//         throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Helpful prompt error data:', errorData);
//         throw new Error(errorData.error || 'Failed to send helpful prompt');
//       }

//       const newMessage = await response.json();
//       console.log('Helpful prompt sent:', newMessage);
//       setChats([...chats, newMessage]);
//       await fetchChats();
//     } catch (err) {
//       console.error('Send helpful prompt error:', err.message, err.stack);
//       setError(`Failed to send helpful prompt: ${err.message}`);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const sendResolutionPrompt = async () => {
//     if (!selectedUserId || !user?.token) {
//       setError('Please select a user.');
//       return;
//     }

//     setIsSending(true);
//     setError(null);

//     try {
//       console.log('Sending resolution prompt:', { content: 'Is your problem solved?', receiverId: selectedUserId });
//       let response = await fetch(`${API_BASE}/api/chat/reply`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ content: 'Is your problem solved?', receiverId: selectedUserId })
//       });
//       console.log('Send resolution prompt response:', { status: response.status, ok: response.ok });

//       if (response.status === 401) {
//         const newToken = await refreshToken();
//         if (newToken) {
//           console.log('Retrying with new token:', newToken.slice(0, 10) + '...');
//           response = await fetch(`${API_BASE}/api/chat/reply`, {
//             method: 'POST',
//             headers: {
//               'Authorization': `Bearer ${newToken}`,
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ content: 'Is your problem solved?', receiverId: selectedUserId })
//           });
//         }
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Non-JSON response:', text.slice(0, 100));
//         throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Resolution prompt error data:', errorData);
//         throw new Error(errorData.error || 'Failed to send resolution prompt');
//       }

//       const newMessage = await response.json();
//       console.log('Resolution prompt sent:', newMessage);
//       setChats([...chats, newMessage]);
//       await fetchChats();
//     } catch (err) {
//       console.error('Send resolution prompt error:', err.message, err.stack);
//       setError(`Failed to send resolution prompt: ${err.message}`);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const clearUserChat = async () => {
//     if (!selectedUserId || !user?.token) {
//       setError('Please select a user.');
//       return;
//     }

//     setIsSending(true);
//     setError(null);

//     try {
//       console.log('Clearing chat for user:', selectedUserId);
//       let response = await fetch(`${API_BASE}/api/chat/clear-user`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ userId: selectedUserId })
//       });
//       console.log('Clear user chat response:', { status: response.status, ok: response.ok });

//       if (response.status === 401) {
//         const newToken = await refreshToken();
//         if (newToken) {
//           console.log('Retrying with new token:', newToken.slice(0, 10) + '...');
//           response = await fetch(`${API_BASE}/api/chat/clear-user`, {
//             method: 'POST',
//             headers: {
//               'Authorization': `Bearer ${newToken}`,
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ userId: selectedUserId })
//           });
//         }
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Clear user chat error data:', errorData);
//         throw new Error(errorData.error || 'Failed to clear user chat');
//       }

//       console.log('User chat cleared for:', selectedUserId);
//       await fetchChats();
//     } catch (err) {
//       console.error('Clear user chat error:', err.message, err.stack);
//       setError(`Failed to clear user chat: ${err.message}`);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const markMessagesAsRead = async (userId) => {
//     if (!user?.token || !userId) return;

//     try {
//       console.log('Marking messages as read for user:', userId);
//       const response = await fetch(`${API_BASE}/api/chat/mark-read`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ userId })
//       });

//       console.log('Mark read response:', { status: response.status, ok: response.ok });

//       if (response.status === 401) {
//         const newToken = await refreshToken();
//         if (newToken) {
//           console.log('Retrying mark-read with new token:', newToken.slice(0, 10) + '...');
//           await fetch(`${API_BASE}/api/chat/mark-read`, {
//             method: 'POST',
//             headers: {
//               'Authorization': `Bearer ${newToken}`,
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ userId })
//           });
//         }
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Mark read error data:', errorData);
//         throw new Error(errorData.error || 'Failed to mark messages as read');
//       }

//       console.log(`Marked messages as read for user: ${userId}`);
//       await fetchChats();
//     } catch (err) {
//       console.error('Mark read error:', err.message, err.stack);
//       setError(`Failed to mark messages as read: ${err.message}`);
//     }
//   };

//   useEffect(() => {
//     if (activeView === 'chats') {
//       fetchChats();
//       const intervalId = setInterval(fetchChats, 5000);
//       return () => clearInterval(intervalId);
//     }
//   }, [user?.token, user?.role, refreshToken, activeView]);

//   const groupedChats = chats.reduce((acc, chat) => {
//     if (!chat.sender || !chat.sender._id) {
//       console.warn('Skipping chat with missing sender:', chat);
//       return acc;
//     }
//     const userId = chat.role === 'user' ? chat.sender._id.toString() : (chat.receiver?._id?.toString() || null);
//     if (!userId) {
//       console.warn('Skipping chat with missing userId:', chat);
//       return acc;
//     }
//     const userRole = chat.role === 'user' ? chat.sender.role : chat.receiver?.role;
//     if (userRole === 'admin') {
//       console.log('Skipping admin user:', userId, chat.sender.email || chat.receiver?.email);
//       return acc;
//     }
//     if (!acc[userId]) {
//       acc[userId] = {
//         user: chat.sender,
//         messages: [],
//         unreadCount: 0
//       };
//     }
//     acc[userId].messages.push(chat);
//     if (chat.role === 'user' && !chat.isRead) {
//       acc[userId].unreadCount += 1;
//     }
//     return acc;
//   }, {});

//   const handleUserClick = (userId) => {
//     console.log('Selected user:', userId);
//     setSelectedUserId(userId);
//     if (groupedChats[userId]?.unreadCount > 0) {
//       markMessagesAsRead(userId);
//     }
//   };

//   return (
//     <div className="admin-chat-container">
//       <div className="top-navigation">
//         <button
//           className={`nav-button ${activeView === 'chats' ? 'active' : ''}`}
//           onClick={() => setActiveView('chats')}
//         >
//           Chats
//         </button>
//         <button
//           className={`nav-button ${activeView === 'feedback' ? 'active' : ''}`}
//           onClick={() => setActiveView('feedback')}
//         >
//           Feedback
//         </button>
//       </div>

//       {activeView === 'chats' ? (
//         <div className="chat-layout">
//           <div className="user-list">
//             <h2>Users</h2>
//             {Object.values(groupedChats).length === 0 ? (
//               <p className="no-users">No users found.</p>
//             ) : (
//               <ul>
//                 {Object.values(groupedChats).map((chatGroup) => (
//                   <li
//                     key={chatGroup.user._id}
//                     className={`user-item ${selectedUserId === chatGroup.user._id ? 'active' : ''}`}
//                     onClick={() => handleUserClick(chatGroup.user._id)}
//                   >
//                     <span>{chatGroup.user.name || chatGroup.user.email}</span>
//                     {chatGroup.unreadCount > 0 && (
//                       <span className="unread-badge">{chatGroup.unreadCount}</span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <div className="chat-area">
//             <div className="chat-header">
//               <h2>Customer Support Chats</h2>
//               {error && <p className="error-message">{error}</p>}
//             </div>
//             {selectedUserId ? (
//               <div className="chat-content">
//                 <div className="messages">
//                   {groupedChats[selectedUserId]?.messages.map((msg, index) => (
//                     <div
//                       key={msg._id || index}
//                       className={`message ${
//                         msg.role === 'admin' ? 'admin-message' : 'user-message'
//                       }`}
//                     >
//                       <div className="message-content">
//                         <p>{msg.content}</p>
//                         <span className="timestamp">
//                           {new Date(msg.createdAt).toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="reply-controls">
//                   <form onSubmit={sendReply} className="reply-form">
//                     <input
//                       type="text"
//                       value={reply}
//                       onChange={(e) => setReply(e.target.value)}
//                       placeholder="Type your reply..."
//                       className="reply-input"
//                       aria-label="Reply message"
//                       disabled={isSending}
//                     />
//                     <button
//                       type="submit"
//                       className="send-button"
//                       disabled={!reply.trim() || isSending}
//                     >
//                       {isSending ? 'Sending...' : 'Send'}
//                     </button>
//                   </form>
//                   <button
//                     className="helpful-button"
//                     onClick={sendHelpfulPrompt}
//                     disabled={isSending || !selectedUserId}
//                     aria-label="Ask if information is helpful"
//                     title="Ask if information is helpful"
//                   >
//                     +
//                   </button>
//                   <button
//                     className="resolved-button"
//                     onClick={sendResolutionPrompt}
//                     disabled={isSending || !selectedUserId}
//                     aria-label="Ask if problem is solved"
//                     title="Ask if problem is solved"
//                   >
//                     +
//                   </button>
//                   <button
//                     className="clear-chat-button"
//                     onClick={clearUserChat}
//                     disabled={isSending || !selectedUserId}
//                     aria-label="Clear user chat"
//                     title="Clear user chat"
//                   >
//                     Clear Chat
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="no-chat-selected">
//                 Select a user to view their chat
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="feedbacks-container">
//           <Feedbacks />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminChat;










import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import './AdminChat.css';
import Feedbacks from '../Feedbacks/Feedbacks';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const AdminChat = () => {
  const [chats, setChats] = useState([]);
  const [reply, setReply] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [activeView, setActiveView] = useState('chats');
  const [showPromptMenu, setShowPromptMenu] = useState(false);
  const { user, token, refreshToken } = useAuth();

  const fetchChats = async () => {
    if (!user?.token || user.role !== 'admin') {
      setError('Unauthorized or not an admin.');
      return;
    }
    try {
      console.log('Fetching all chats with token:', user.token.slice(0, 10) + '...');
      let response = await fetch(`${API_BASE}/api/chat/all`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Fetch chats response:', { status: response.status, ok: response.ok });

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          response = await fetch(`${API_BASE}/api/chat/all`, {
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            }
          });
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.slice(0, 100));
        throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch chats');
      }

      const data = await response.json();
      console.log('Fetched chats:', data.length, data.map(chat => ({
        sender: chat.sender?.email,
        receiver: chat.receiver?.email,
        senderRole: chat.sender?.role,
        receiverRole: chat.receiver?.role
      })));
      setChats(data);
    } catch (err) {
      console.error('Fetch chats error:', err.message, err.stack);
      setError(err.message);
      if (err.message.includes('Failed to refresh token')) {
        setError('Session expired. Please log in again.');
      }
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedUserId || !user?.token) {
      setError('Please enter a reply and select a user.');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      console.log('Sending reply:', { content: reply, receiverId: selectedUserId });
      let response = await fetch(`${API_BASE}/api/chat/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: reply, receiverId: selectedUserId })
      });
      console.log('Send reply response:', { status: response.status, ok: response.ok });

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          console.log('Retrying with new token:', newToken.slice(0, 10) + '...');
          response = await fetch(`${API_BASE}/api/chat/reply`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: reply, receiverId: selectedUserId })
          });
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.slice(0, 100));
        throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Reply error data:', errorData);
        throw new Error(errorData.error || 'Failed to send reply');
      }

      const newMessage = await response.json();
      console.log('Reply sent:', newMessage);
      setChats([...chats, newMessage]);
      setReply('');
      await fetchChats();
    } catch (err) {
      console.error('Send reply error:', err.message, err.stack);
      setError(`Failed to send reply: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const sendPrompt = async (promptContent) => {
    if (!selectedUserId || !user?.token) {
      setError('Please select a user.');
      return;
    }

    setIsSending(true);
    setError(null);
    setShowPromptMenu(false);

    try {
      console.log('Sending prompt:', { content: promptContent, receiverId: selectedUserId });
      let response = await fetch(`${API_BASE}/api/chat/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: promptContent, receiverId: selectedUserId })
      });
      console.log('Send prompt response:', { status: response.status, ok: response.ok });

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          console.log('Retrying with new token:', newToken.slice(0, 10) + '...');
          response = await fetch(`${API_BASE}/api/chat/reply`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: promptContent, receiverId: selectedUserId })
          });
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.slice(0, 100));
        throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Prompt error data:', errorData);
        throw new Error(errorData.error || 'Failed to send prompt');
      }

      const newMessage = await response.json();
      console.log('Prompt sent:', newMessage);
      setChats([...chats, newMessage]);
      await fetchChats();
    } catch (err) {
      console.error('Send prompt error:', err.message, err.stack);
      setError(`Failed to send prompt: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const clearUserChat = async () => {
    if (!selectedUserId || !user?.token) {
      setError('Please select a user.');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      console.log('Clearing chat for user:', selectedUserId);
      let response = await fetch(`${API_BASE}/api/chat/clear-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: selectedUserId })
      });
      console.log('Clear user chat response:', { status: response.status, ok: response.ok });

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          console.log('Retrying with new token:', newToken.slice(0, 10) + '...');
          response = await fetch(`${API_BASE}/api/chat/clear-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: selectedUserId })
          });
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Clear user chat error data:', errorData);
        throw new Error(errorData.error || 'Failed to clear user chat');
      }

      console.log('User chat cleared for:', selectedUserId);
      await fetchChats();
    } catch (err) {
      console.error('Clear user chat error:', err.message, err.stack);
      setError(`Failed to clear user chat: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const markMessagesAsRead = async (userId) => {
    if (!user?.token || !userId) return;

    try {
      console.log('Marking messages as read for user:', userId);
      const response = await fetch(`${API_BASE}/api/chat/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      console.log('Mark read response:', { status: response.status, ok: response.ok });

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          console.log('Retrying mark-read with new token:', newToken.slice(0, 10) + '...');
          await fetch(`${API_BASE}/api/chat/mark-read`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
          });
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mark read error data:', errorData);
        throw new Error(errorData.error || 'Failed to mark messages as read');
      }

      console.log(`Marked messages as read for user: ${userId}`);
      await fetchChats();
    } catch (err) {
      console.error('Mark read error:', err.message, err.stack);
      setError(`Failed to mark messages as read: ${err.message}`);
    }
  };

  useEffect(() => {
    if (activeView === 'chats') {
      fetchChats();
      const intervalId = setInterval(fetchChats, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user?.token, user?.role, refreshToken, activeView]);

  const groupedChats = chats.reduce((acc, chat) => {
    if (!chat.sender || !chat.sender._id) {
      console.warn('Skipping chat with missing sender:', chat);
      return acc;
    }
    const userId = chat.role === 'user' ? chat.sender._id.toString() : (chat.receiver?._id?.toString() || null);
    if (!userId) {
      console.warn('Skipping chat with missing userId:', chat);
      return acc;
    }
    const userRole = chat.role === 'user' ? chat.sender.role : chat.receiver?.role;
    if (userRole === 'admin') {
      console.log('Skipping admin user:', userId, chat.sender.email || chat.receiver?.email);
      return acc;
    }
    if (!acc[userId]) {
      acc[userId] = {
        user: chat.sender,
        messages: [],
        unreadCount: 0
      };
    }
    acc[userId].messages.push(chat);
    if (chat.role === 'user' && !chat.isRead) {
      acc[userId].unreadCount += 1;
    }
    return acc;
  }, {});

  const handleUserClick = (userId) => {
    console.log('Selected user:', userId);
    setSelectedUserId(userId);
    setShowPromptMenu(false);
    if (groupedChats[userId]?.unreadCount > 0) {
      markMessagesAsRead(userId);
    }
  };

  const togglePromptMenu = () => {
    setShowPromptMenu(prev => !prev);
  };

  const promptOptions = [
    'Is this information helpful?',
    'Is your problem solved?',
    'How may I help you?',
    'Do you need further assistance?',
    'Can I provide more details?'
  ];

  return (
    <div className="admin-chat-container">
      <div className="top-navigation">
        <button
          className={`nav-button ${activeView === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveView('chats')}
        >
          Chats
        </button>
        <button
          className={`nav-button ${activeView === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveView('feedback')}
        >
          Feedback
        </button>
      </div>

      {activeView === 'chats' ? (
        <div className="chat-layout">
          <div className="user-list">
            <h2>Users</h2>
            {Object.values(groupedChats).length === 0 ? (
              <p className="no-users">No users found.</p>
            ) : (
              <ul>
                {Object.values(groupedChats).map((chatGroup) => (
                  <li
                    key={chatGroup.user._id}
                    className={`user-item ${selectedUserId === chatGroup.user._id ? 'active' : ''}`}
                    onClick={() => handleUserClick(chatGroup.user._id)}
                  >
                    <span>{chatGroup.user.name || chatGroup.user.email}</span>
                    {chatGroup.unreadCount > 0 && (
                      <span className="unread-badge">{chatGroup.unreadCount}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="chat-area">
            <div className="chat-header">
              <h2>Customer Support Chats</h2>
              {error && <p className="error-message">{error}</p>}
            </div>
            {selectedUserId ? (
              <div className="chat-content">
                <div className="messages">
                  {groupedChats[selectedUserId]?.messages.map((msg, index) => (
                    <div
                      key={msg._id || index}
                      className={`message ${
                        msg.role === 'admin' ? 'admin-message' : 'user-message'
                      }`}
                    >
                      <div className="message-content">
                        <p>{msg.content}</p>
                        <span className="timestamp">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="reply-controls">
                  <form onSubmit={sendReply} className="reply-form">
                    <input
                      type="text"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply..."
                      className="reply-input"
                      aria-label="Reply message"
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      className="send-button"
                      disabled={!reply.trim() || isSending}
                    >
                      {isSending ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                  <div className="prompt-container">
                    <button
                      className="prompt-button"
                      onClick={togglePromptMenu}
                      disabled={isSending || !selectedUserId}
                      aria-label="Select a prompt"
                      title="Select a prompt"
                    >
                      +
                    </button>
                    {showPromptMenu && (
                      <ul className="prompt-menu">
                        {promptOptions.map((prompt, index) => (
                          <li
                            key={index}
                            className="prompt-option"
                            onClick={() => sendPrompt(prompt)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                sendPrompt(prompt);
                              }
                            }}
                          >
                            {prompt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    className="clear-chat-button"
                    onClick={clearUserChat}
                    disabled={isSending || !selectedUserId}
                    aria-label="Clear user chat"
                    title="Clear user chat"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-chat-selected">
                Select a user to view their chat
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="feedbacks-container">
          <Feedbacks />
        </div>
      )}
    </div>
  );
};

export default AdminChat;