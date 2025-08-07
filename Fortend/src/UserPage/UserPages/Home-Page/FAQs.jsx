






// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useAuth } from '../../../context/AuthContext';
// import { useChat } from '../../../context/ChatContext';
// import { useNavigate } from 'react-router-dom';
// import './FAQs.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// const FAQs = () => {
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [error, setError] = useState(null);
//   const [isSending, setIsSending] = useState(false);
//   const { user } = useAuth();
//   const { unreadCount, markMessagesRead } = useChat();
//   const navigate = useNavigate();
//   const chatMessagesRef = useRef(null);
//   const lastAdminMessageRef = useRef(null);

//   const faqs = [
//     {
//       question: 'How long does shipping take?',
//       answer: 'Shipping typically takes 3-7 business days, depending on your location. Expedited options are available at checkout.'
//     },
//     {
//       question: 'What is your return policy?',
//       answer: 'We offer a 30-day return policy for unused items in original packaging. Contact support@example.com to initiate a return.'
//     },
//     {
//       question: 'How can I track my order?',
//       answer: 'Once your order ships, you’ll receive a tracking link via email. You can also check order status in your account under "My Orders."'
//     },
//     {
//       question: 'What payment methods do you accept?',
//       answer: 'We accept credit/debit cards, UPI, and select digital wallets. All payments are processed securely.'
//     },
//     {
//       question: 'How do I contact customer support?',
//       answer: 'Reach us at support@example.com or call 1-800-123-4567, Monday to Friday, 9 AM to 5 PM.'
//     }
//   ];

//   const toggleFAQ = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   const openChat = async () => {
//     console.log('Opening chat, user:', { id: user?.id, token: user?.token?.slice(0, 10) + '...', email: user?.email });
//     if (!user) {
//       setError('User data not found. Please log in again.');
//       setTimeout(() => navigate('/login'), 2000);
//       return;
//     }
//     if (!user.token) {
//       setError('Authentication token missing. Please log in again.');
//       setTimeout(() => navigate('/login'), 2000);
//       return;
//     }
//     if (!user.id) {
//       setError('User ID missing. Please log in again.');
//       setTimeout(() => navigate('/login'), 2000);
//       return;
//     }
//     setIsChatOpen(true);
//     setError(null);
//     // Initialize with welcome message
//     setMessages([{
//       _id: 'welcome-message',
//       sender: { _id: 'system', email: 'support@express.com', name: 'Support Team', role: 'admin' },
//       content: 'Welcome to Express.com! How may I help you?',
//       createdAt: new Date(),
//       role: 'admin',
//       isRead: true
//     }]);
//     await fetchMessages(true); // Fetch and mark as read
//   };

//   const closeChat = () => {
//     setIsChatOpen(false);
//     setMessage('');
//     setError(null);
//     setMessages([]);
//   };

//   const fetchMessages = useCallback(async (markAsRead = false) => {
//     if (!user?.token || !user?.id) {
//       console.warn('Cannot fetch messages: User not authenticated', { token: !!user?.token, id: !!user?.id });
//       setError('Cannot fetch messages: User not authenticated.');
//       return;
//     }
//     try {
//       console.log('Fetching messages with token:', user.token.slice(0, 10) + '...', 'User ID:', user.id);
//       const response = await fetch(`${API_BASE}/api/chat`, {
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       console.log('Fetch messages response:', { status: response.status, ok: response.ok });

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Non-JSON response:', text.slice(0, 100));
//         throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch messages');
//       }

//       const data = await response.json();
//       console.log('Fetched messages:', data.length);
//       // Merge welcome message with fetched messages
//       setMessages(prev => {
//         const welcomeMsg = prev.find(msg => msg._id === 'welcome-message') || {
//           _id: 'welcome-message',
//           sender: { _id: 'system', email: 'support@express.com', name: 'Support Team', role: 'admin' },
//           content: 'Welcome to Express.com! How may I help you?',
//           createdAt: new Date(),
//           role: 'admin',
//           isRead: true
//         };
//         // Check for new admin messages to append "Is this helpful?"
//         const lastAdminMsgId = lastAdminMessageRef.current;
//         const newAdminMessages = data.filter(msg => 
//           msg.sender._id.toString() !== user.id.toString() && 
//           (!lastAdminMsgId || new Date(msg.createdAt) > new Date(lastAdminMsgId))
//         );
//         if (newAdminMessages.length > 0) {
//           lastAdminMessageRef.current = newAdminMessages[newAdminMessages.length - 1].createdAt;
//           return [
//             welcomeMsg,
//             ...data,
//             {
//               _id: `helpful-${Date.now()}`,
//               sender: { _id: 'system', email: 'support@express.com', name: 'Support Team', role: 'admin' },
//               content: 'Is this helpful?',
//               createdAt: new Date(),
//               role: 'admin',
//               isRead: true
//             }
//           ];
//         }
//         return [welcomeMsg, ...data];
//       });

//       // Mark messages as read when chat is opened
//       if (markAsRead && isChatOpen) {
//         try {
//           const adminIds = [...new Set(
//             data
//               .filter(msg => msg.sender._id.toString() !== user.id.toString())
//               .map(msg => msg.sender._id.toString())
//           )];
//           console.log('Admin sender IDs:', adminIds);

//           for (const adminId of adminIds) {
//             const markResponse = await fetch(`${API_BASE}/api/chat/mark-read`, {
//               method: 'POST',
//               headers: {
//                 'Authorization': `Bearer ${user.token}`,
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({ userId: adminId })
//             });
//             if (!markResponse.ok) {
//               const errorData = await markResponse.json();
//               console.warn('Failed to mark messages as read:', errorData.error);
//               continue;
//             }
//             const result = await markResponse.json();
//             console.log('Marked messages as read for admin:', adminId, 'Modified:', result.modifiedCount);
//           }
//           markMessagesRead();
//         } catch (err) {
//           console.warn('Failed to mark messages as read:', err.message);
//         }
//       }
//     } catch (err) {
//       console.error('Fetch messages error:', err.message, err.stack);
//       setError(err.message);
//     }
//   }, [user?.token, user?.id, isChatOpen, markMessagesRead]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!message.trim() || !user?.token || !user?.id) {
//       setError('Please enter a message and ensure you are logged in.');
//       return;
//     }

//     setIsSending(true);
//     setError(null);

//     try {
//       console.log('Sending message:', { content: message, userId: user.id });
//       const response = await fetch(`${API_BASE}/api/chat`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ content: message })
//       });
//       console.log('Send message response:', { status: response.status, ok: response.ok });

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Non-JSON response:', text.slice(0, 100));
//         throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to send message');
//       }

//       const newMessage = await response.json();
//       console.log('New message received:', newMessage);
//       setMessages(prev => [...prev, newMessage]);
//       setMessage('');
//     } catch (err) {
//       console.error('Send message error:', err.message, err.stack);
//       setError(err.message);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   // Auto-scroll to the latest message
//   useEffect(() => {
//     if (chatMessagesRef.current) {
//       chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
//     }
//   }, [messages]);

//   useEffect(() => {
//     let intervalId;
//     if (isChatOpen) {
//       fetchMessages(true); // Initial fetch with mark as read
//       intervalId = setInterval(() => fetchMessages(false), 5000); // Poll every 5 seconds
//     }
//     return () => clearInterval(intervalId);
//   }, [isChatOpen, fetchMessages]);

//   return (
//     <div className="faq-page">
//       <div className="faq-header">
//         <h1>Frequently Asked Questions</h1>
//         <button className="faq-chat-btn" onClick={openChat}>
//           Chat with Support
//           {unreadCount > 0 && (
//             <span className="faq-notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
//           )}
//         </button>
//       </div>
//       <div className="faq-list">
//         {faqs.map((faq, index) => (
//           <div key={index} className="faq-card">
//             <button
//               className="faq-question"
//               onClick={() => toggleFAQ(index)}
//               aria-expanded={activeIndex === index}
//               aria-controls={`faq-answer-${index}`}
//             >
//               <span>{faq.question}</span>
//               <span className="faq-toggle-icon">{activeIndex === index ? '−' : '+'}</span>
//             </button>
//             <div
//               id={`faq-answer-${index}`}
//               className={`faq-answer ${activeIndex === index ? 'faq-answer-active' : ''}`}
//               role="region"
//               aria-hidden={activeIndex !== index}
//             >
//               <p>{faq.answer}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {isChatOpen && (
//         <div className="faq-chat-modal" role="dialog" aria-label="Chat with Support">
//           <div className="faq-chat-content">
//             <button
//               className="faq-chat-close"
//               onClick={closeChat}
//               aria-label="Close chat"
//             >
//               ×
//             </button>
//             <h2>Chat with Support</h2>
//             {error && <p className="faq-chat-error">{error}</p>}
//             <div className="faq-chat-messages" ref={chatMessagesRef}>
//               {messages.length === 1 && messages[0]._id === 'welcome-message' && !error && (
//                 <p className="faq-chat-empty">Start the conversation...</p>
//               )}
//               {messages.map((msg, index) => (
//                 <div
//                   key={msg._id || index}
//                   className={`faq-chat-message ${
//                     msg.sender._id.toString() === user?.id?.toString() ? 'faq-user-message' : 'faq-admin-message'
//                   }`}
//                 >
//                   <div className="faq-message-content">
//                     <span className="faq-message-sender">{msg.sender.name}</span>
//                     <p>{msg.content}</p>
//                     <span className="faq-message-timestamp">
//                       {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <form onSubmit={sendMessage} className="faq-chat-form">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type your message..."
//                 aria-label="Chat message input"
//                 disabled={isSending}
//               />
//               <button type="submit" disabled={!message.trim() || isSending}>
//                 {isSending ? 'Sending...' : 'Send'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FAQs;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useChat } from '../../../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import './FAQs.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showResolutionButtons, setShowResolutionButtons] = useState(false);
  const [showHelpfulButtons, setShowHelpfulButtons] = useState(false);
  const { user } = useAuth();
  const { unreadCount, markMessagesRead } = useChat();
  const navigate = useNavigate();
  const chatMessagesRef = useRef(null);

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Shipping typically takes 3-7 business days, depending on your location. Expedited options are available at checkout.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused items in original packaging. Contact support@example.com to initiate a return.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you’ll receive a tracking link via email. You can also check order status in your account under "My Orders."'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, UPI, and select digital wallets. All payments are processed securely.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'Reach us at support@example.com or call 1-800-123-4567, Monday to Friday, 9 AM to 5 PM.'
    }
  ];

  const welcomeMessage = {
    _id: 'welcome-message',
    sender: { _id: 'system', email: 'support@express.com', name: 'Support Team', role: 'admin' },
    content: 'Welcome to Express.com! How may I help you?',
    createdAt: new Date(),
    role: 'admin',
    isRead: true
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const openChat = async () => {
    console.log('Opening chat, user:', { id: user?.id, token: user?.token?.slice(0, 10) + '...', email: user?.email });
    if (!user) {
      setError('User data not found. Please log in again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (!user.token) {
      setError('Authentication token missing. Please log in again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (!user.id) {
      setError('User ID missing. Please log in again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setIsChatOpen(true);
    setError(null);
    setMessages([welcomeMessage]);
    setShowResolutionButtons(false);
    setShowHelpfulButtons(false);
    await fetchMessages(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setMessage('');
    setError(null);
    setMessages([]);
    setShowResolutionButtons(false);
    setShowHelpfulButtons(false);
  };

  const fetchMessages = useCallback(async (markAsRead = false) => {
    if (!user?.token || !user?.id) {
      console.warn('Cannot fetch messages: User not authenticated', { token: !!user?.token, id: !!user?.id });
      setError('Cannot fetch messages: User not authenticated.');
      return;
    }
    try {
      console.log('Fetching messages with token:', user.token.slice(0, 10) + '...', 'User ID:', user.id);
      const response = await fetch(`${API_BASE}/api/chat`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Fetch messages response:', { status: response.status, ok: response.ok });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.slice(0, 100));
        throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch messages');
      }

      const data = await response.json();
      console.log('Fetched messages:', data.length);
      setMessages(prev => {
        const welcomeMsg = prev.find(msg => msg._id === 'welcome-message') || welcomeMessage;
        // Check for unanswered prompts from admin
        let hasResolutionPrompt = false;
        let hasHelpfulPrompt = false;
        const sortedData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        // Find the latest helpful prompt
        let latestHelpfulPromptIndex = -1;
        for (let i = sortedData.length - 1; i >= 0; i--) {
          const msg = sortedData[i];
          if (
            msg.sender._id.toString() !== user.id.toString() &&
            msg.content.toLowerCase() === 'is this information helpful?'
          ) {
            latestHelpfulPromptIndex = i;
            break;
          }
        }
        // Check if the latest helpful prompt is unanswered
        if (latestHelpfulPromptIndex >= 0) {
          hasHelpfulPrompt = true;
          for (let i = latestHelpfulPromptIndex + 1; i < sortedData.length; i++) {
            const msg = sortedData[i];
            if (
              msg.sender._id.toString() === user.id.toString() &&
              msg.content.includes('information was')
            ) {
              hasHelpfulPrompt = false;
              break;
            }
          }
        }
        // Find the latest resolution prompt
        let latestResolutionPromptIndex = -1;
        for (let i = sortedData.length - 1; i >= 0; i--) {
          const msg = sortedData[i];
          if (
            msg.sender._id.toString() !== user.id.toString() &&
            msg.content.toLowerCase() === 'is your problem solved?'
          ) {
            latestResolutionPromptIndex = i;
            break;
          }
        }
        // Check if the latest resolution prompt is unanswered
        if (latestResolutionPromptIndex >= 0) {
          hasResolutionPrompt = true;
          for (let i = latestResolutionPromptIndex + 1; i < sortedData.length; i++) {
            const msg = sortedData[i];
            if (
              msg.sender._id.toString() === user.id.toString() &&
              (msg.content === 'Yes' || msg.content === 'No')
            ) {
              hasResolutionPrompt = false;
              break;
            }
          }
        }
        setShowResolutionButtons(hasResolutionPrompt);
        setShowHelpfulButtons(hasHelpfulPrompt);
        return data.length === 0 ? [welcomeMsg] : [welcomeMsg, ...data];
      });

      if (markAsRead && isChatOpen) {
        try {
          const adminIds = [...new Set(
            data
              .filter(msg => msg.sender._id.toString() !== user.id.toString())
              .map(msg => msg.sender._id.toString())
          )];
          console.log('Admin sender IDs:', adminIds);

          for (const adminId of adminIds) {
            const markResponse = await fetch(`${API_BASE}/api/chat/mark-read`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ userId: adminId })
            });
            if (!markResponse.ok) {
              const errorData = await markResponse.json();
              console.warn('Failed to mark messages as read:', errorData.error);
              continue;
            }
            const result = await markResponse.json();
            console.log('Marked messages as read for admin:', adminId, 'Modified:', result.modifiedCount);
          }
          markMessagesRead();
        } catch (err) {
          console.warn('Failed to mark messages as read:', err.message);
        }
      }
    } catch (err) {
      console.error('Fetch messages error:', err.message, err.stack);
      setError(err.message);
    }
  }, [user?.token, user?.id, isChatOpen, markMessagesRead]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user?.token || !user?.id) {
      setError('Please enter a message and ensure you are logged in.');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      console.log('Sending message:', { content: message, userId: user.id });
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message })
      });
      console.log('Send message response:', { status: response.status, ok: response.ok });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.slice(0, 100));
        throw new Error(`Expected JSON, received ${contentType || 'unknown'}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const newMessage = await response.json();
      console.log('New message received:', newMessage);
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setShowResolutionButtons(false);
      setShowHelpfulButtons(false);
    } catch (err) {
      console.error('Send message error:', err.message, err.stack);
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleHelpfulResponse = async (isHelpful) => {
    if (!user?.token || !user?.id) {
      setError('User not authenticated.');
      return;
    }
    const content = isHelpful ? 'Yes, the information was helpful' : 'No, the information was not helpful';
    try {
      console.log('Sending helpful response:', { content, userId: user.id });
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      console.log('Send helpful response:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send response');
      }

      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
      setShowHelpfulButtons(false);
    } catch (err) {
      console.error('Send helpful response error:', err.message, err.stack);
      setError(err.message);
    }
  };

  const handleResolutionResponse = async (isResolved) => {
    if (!user?.token || !user?.id) {
      setError('User not authenticated.');
      return;
    }
    const content = isResolved ? 'Yes' : 'No';
    try {
      console.log('Sending resolution response:', { content, userId: user.id });
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      console.log('Send resolution response:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send response');
      }

      const newMessage = await response.json();
      setMessages(prev => {
        const updatedMessages = [...prev, newMessage];
        if (!isResolved) {
          updatedMessages.push({
            _id: `continue-${Date.now()}`,
            sender: { _id: 'system', email: 'support@express.com', name: 'Support Team', role: 'admin' },
            content: 'Please provide more details or ask another question.',
            createdAt: new Date(),
            role: 'admin',
            isRead: true
          });
        }
        return updatedMessages;
      });
      setShowResolutionButtons(false);
    } catch (err) {
      console.error('Send resolution response error:', err.message, err.stack);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let intervalId;
    if (isChatOpen) {
      fetchMessages(true);
      intervalId = setInterval(() => fetchMessages(false), 5000);
    }
    return () => clearInterval(intervalId);
  }, [isChatOpen, fetchMessages]);

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <button className="faq-chat-btn" onClick={openChat}>
          Chat with Support
          {unreadCount > 0 && (
            <span className="faq-notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-card">
            <button
              className="faq-question"
              onClick={() => toggleFAQ(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span>{faq.question}</span>
              <span className="faq-toggle-icon">{activeIndex === index ? '−' : '+'}</span>
            </button>
            <div
              id={`faq-answer-${index}`}
              className={`faq-answer ${activeIndex === index ? 'faq-answer-active' : ''}`}
              role="region"
              aria-hidden={activeIndex !== index}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {isChatOpen && (
        <div className="faq-chat-modal" role="dialog" aria-label="Chat with Support">
          <div className="faq-chat-content">
            <button
              className="faq-chat-close"
              onClick={closeChat}
              aria-label="Close chat"
            >
              ×
            </button>
            <h2>Chat with Support</h2>
            {error && <p className="faq-chat-error">{error}</p>}
            <div className="faq-chat-messages" ref={chatMessagesRef}>
              {messages.length === 1 && messages[0]._id === 'welcome-message' && !error && (
                <p className="faq-chat-empty">Start the conversation...</p>
              )}
              {messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`faq-chat-message ${
                    msg.sender._id.toString() === user?.id?.toString() ? 'faq-user-message' : 'faq-admin-message'
                  }`}
                >
                  <div className="faq-message-content">
                    <span className="faq-message-sender">{msg.sender.name}</span>
                    <p>{msg.content}</p>
                    <span className="faq-message-timestamp">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {showResolutionButtons && (
                <div className="faq-resolution-prompt">
                  <div className="faq-resolution-buttons">
                    <button
                      className="faq-resolution-btn faq-resolution-yes"
                      onClick={() => handleResolutionResponse(true)}
                    >
                      Yes
                    </button>
                    <button
                      className="faq-resolution-btn faq-resolution-no"
                      onClick={() => handleResolutionResponse(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
              {showHelpfulButtons && (
                <div className="faq-helpful-prompt">
                  <div className="faq-helpful-buttons">
                    <button
                      className="faq-helpful-btn faq-helpful-yes"
                      onClick={() => handleHelpfulResponse(true)}
                      aria-label="Yes, information was helpful"
                    >
                      👍
                    </button>
                    <button
                      className="faq-helpful-btn faq-helpful-no"
                      onClick={() => handleHelpfulResponse(false)}
                      aria-label="No, information was not helpful"
                    >
                      👎
                    </button>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={sendMessage} className="faq-chat-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                aria-label="Chat message input"
                disabled={isSending || showResolutionButtons || showHelpfulButtons}
              />
              <button type="submit" disabled={!message.trim() || isSending || showResolutionButtons || showHelpfulButtons}>
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQs;