import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { FaTrash } from 'react-icons/fa';
import './Feedbacks.css';

const Feedbacks = () => {
  const { user, token } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/contact/feedbacks', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch feedbacks');
        }
        const data = await response.json();
        setFeedbacks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    if (token) {
      fetchFeedbacks();
    }
  }, [token]);

  // Handle delete feedback
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/contact/feedbacks/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete feedback');
        }
        setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="feedbacks-content">
      {loading && <p className="feedbacks-loading">Loading feedbacks...</p>}
      {error && <p className="feedbacks-error">{error}</p>}

      {!loading && !error && (
        <div className="feedbacks-table-container">
          <table className="feedbacks-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>User ID</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-feedbacks">
                    No feedbacks available.
                  </td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr key={feedback._id}>
                    <td>{feedback.name}</td>
                    <td>{feedback.email}</td>
                    <td>{feedback.message}</td>
                    <td>{feedback.userId || 'N/A'}</td>
                    <td>{new Date(feedback.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(feedback._id)}
                        aria-label={`Delete feedback from ${feedback.name}`}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Feedbacks;