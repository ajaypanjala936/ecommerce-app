


// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import './Wallet.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// const Wallet = () => {
//   const { user, token } = useAuth();
//   const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [creditForm, setCreditForm] = useState({ amount: '', description: '' });
//   const [creditError, setCreditError] = useState(null);
//   const [creditSuccess, setCreditSuccess] = useState(null);
//   const [isCreditLoading, setIsCreditLoading] = useState(false);
//   const [showCreditForm, setShowCreditForm] = useState(false);

//   // Fetch wallet data
//   useEffect(() => {
//     const fetchWallet = async () => {
//       try {
//         const response = await fetch(`${API_BASE}/api/wallet`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Failed to fetch wallet');
//         }

//         const data = await response.json();
//         setWallet(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (user && token) {
//       fetchWallet();
//     }
//   }, [user, token]);

//   // Handle form input changes
//   const handleCreditChange = (e) => {
//     setCreditForm({ ...creditForm, [e.target.name]: e.target.value });
//   };

//   // Handle credit submission
//   const handleCreditSubmit = async (e) => {
//     e.preventDefault();
//     setCreditError(null);
//     setCreditSuccess(null);
//     setIsCreditLoading(true);

//     try {
//       const response = await fetch(`${API_BASE}/api/wallet/credit`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           amount: parseFloat(creditForm.amount),
//           description: creditForm.description || 'Added funds',
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to add funds');
//       }

//       const data = await response.json();
//       setWallet(data); // Update wallet with new balance and transactions
//       setCreditSuccess('Funds added successfully');
//       setCreditForm({ amount: '', description: '' }); // Reset form
//       setShowCreditForm(false); // Hide form after success
//     } catch (err) {
//       setCreditError(err.message);
//     } finally {
//       setIsCreditLoading(false);
//     }
//   };

//   // Toggle credit form visibility
//   const toggleCreditForm = () => {
//     setShowCreditForm(!showCreditForm);
//     setCreditError(null);
//     setCreditSuccess(null);
//     setCreditForm({ amount: '', description: '' });
//   };

//   if (!user) {
//     return <div className="wallet-container">Please log in to view your wallet.</div>;
//   }

//   return (
//     <div className="wallet-container">
//       <h2>Wallet</h2>
//       {error && <p className="error-message">{error}</p>}
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <div className="wallet-balance">
//             <h3>Balance</h3>
//             <p>${wallet.balance.toFixed(2)}</p>
//             <button
//               onClick={toggleCreditForm}
//               className="toggle-credit-button"
//               disabled={isCreditLoading}
//             >
//               {showCreditForm ? 'Cancel' : 'Add Funds'}
//             </button>
//           </div>
//           {showCreditForm && (
//             <div className="wallet-add-funds">
//               <h3>Add Funds</h3>
//               <form onSubmit={handleCreditSubmit} className="credit-form">
//                 {creditError && <p className="error-message">{creditError}</p>}
//                 {creditSuccess && <p className="success-message">{creditSuccess}</p>}
//                 <div className="form-group">
//                   <label htmlFor="amount">Amount ($)</label>
//                   <input
//                     type="number"
//                     id="amount"
//                     name="amount"
//                     value={creditForm.amount}
//                     onChange={handleCreditChange}
//                     placeholder="Enter amount"
//                     required
//                     min="0.01"
//                     step="0.01"
//                     disabled={isCreditLoading}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="description">Description (optional)</label>
//                   <input
//                     type="text"
//                     id="description"
//                     name="description"
//                     value={creditForm.description}
//                     onChange={handleCreditChange}
//                     placeholder="e.g., Added funds"
//                     disabled={isCreditLoading}
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="submit-button"
//                   disabled={isCreditLoading}
//                 >
//                   {isCreditLoading ? 'Adding...' : 'Add Funds'}
//                 </button>
//               </form>
//             </div>
//           )}
//           <div className="wallet-transactions">
//             <h3>Transaction History</h3>
//             {wallet.transactions.length === 0 ? (
//               <p>No transactions found.</p>
//             ) : (
//               <ul>
//                 {[...wallet.transactions]
//                   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//                   .map((txn) => (
//                     <li key={txn._id}>
//                       <span className={txn.type === 'credit' ? 'credit-amount' : 'debit-amount'}>
//                         {txn.type === 'credit' ? '+' : '-'}${txn.amount.toFixed(2)}
//                       </span>
//                       <span>{txn.description}</span>
//                       <span>{new Date(txn.createdAt).toLocaleString()}</span>
//                     </li>
//                   ))}
//               </ul>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Wallet;









import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './Wallet.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const Wallet = () => {
  const { user, token } = useAuth();
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [creditForm, setCreditForm] = useState({ amount: '', description: '' });
  const [creditError, setCreditError] = useState(null);
  const [creditSuccess, setCreditSuccess] = useState(null);
  const [isCreditLoading, setIsCreditLoading] = useState(false);
  const [showCreditForm, setShowCreditForm] = useState(false);

  // Fetch wallet data
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/wallet`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch wallet');
        }

        const data = await response.json();
        setWallet(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && token) {
      fetchWallet();
    }
  }, [user, token]);

  // Handle form input changes
  const handleCreditChange = (e) => {
    setCreditForm({ ...creditForm, [e.target.name]: e.target.value });
  };

  // Handle credit submission
  const handleCreditSubmit = async (e) => {
    e.preventDefault();
    setCreditError(null);
    setCreditSuccess(null);
    setIsCreditLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/wallet/credit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(creditForm.amount),
          description: creditForm.description || 'Added funds',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add funds');
      }

      const data = await response.json();
      setWallet(data); // Update wallet with new balance and transactions
      setCreditSuccess('Funds added successfully');
      setCreditForm({ amount: '', description: '' }); // Reset form
      setShowCreditForm(false); // Hide form after success
    } catch (err) {
      setCreditError(err.message);
    } finally {
      setIsCreditLoading(false);
    }
  };

  // Toggle credit form visibility
  const toggleCreditForm = () => {
    setShowCreditForm(!showCreditForm);
    setCreditError(null);
    setCreditSuccess(null);
    setCreditForm({ amount: '', description: '' });
  };

  if (!user) {
    return <div className="wallet-container">Please log in to view your wallet.</div>;
  }

  return (
    <div className="wallet-container">
      <h2>Wallet</h2>
      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="wallet-balance">
            <h3>Balance</h3>
            <p>{wallet.balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
            <button
              onClick={toggleCreditForm}
              className="toggle-credit-button"
              disabled={isCreditLoading}
            >
              {showCreditForm ? 'Cancel' : 'Add Funds'}
            </button>
          </div>
          {showCreditForm && (
            <div className="wallet-add-funds">
              <h3>Add Funds</h3>
              <form onSubmit={handleCreditSubmit} className="credit-form">
                {creditError && <p className="error-message">{creditError}</p>}
                {creditSuccess && <p className="success-message">{creditSuccess}</p>}
                <div className="form-group">
                  <label htmlFor="amount">Amount (₹)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={creditForm.amount}
                    onChange={handleCreditChange}
                    placeholder="Enter amount"
                    required
                    min="0.01"
                    step="0.01"
                    disabled={isCreditLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description (optional)</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={creditForm.description}
                    onChange={handleCreditChange}
                    placeholder="e.g., Added funds"
                    disabled={isCreditLoading}
                  />
                </div>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isCreditLoading}
                >
                  {isCreditLoading ? 'Adding...' : 'Add Funds'}
                </button>
              </form>
            </div>
          )}
          <div className="wallet-transactions">
            <h3>Transaction History</h3>
            {wallet.transactions.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              <ul>
                {[...wallet.transactions]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((txn) => (
                    <li key={txn._id}>
                      <span className={txn.type === 'credit' ? 'credit-amount' : 'debit-amount'}>
                        {txn.type === 'credit' ? '+' : '-'}{txn.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </span>
                      <span>{txn.description}</span>
                      <span>{new Date(txn.createdAt).toLocaleString()}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Wallet;