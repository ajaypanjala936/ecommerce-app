



// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import { Line, Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
// import './Sales.css';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// const Sales = () => {
//   const { user, token, logout } = useAuth();
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState('last30days');
//   const [stats, setStats] = useState({
//     totalRevenue: 0,
//     averageOrderValue: 0,
//     ordersByStatus: { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 },
//     topProducts: [],
//   });

//   // Redirect if not admin or no token
//   useEffect(() => {
//     if (!user || !token || user.role !== 'admin') {
//       console.log('Redirecting: Not admin or not authenticated', { userRole: user?.role, hasToken: !!token });
//       setError('Access denied. Admin login required.');
//       setLoading(false);
//       navigate('/adminlogin');
//     }
//   }, [user, token, navigate]);

//   useEffect(() => {
//     const fetchSalesData = async () => {
//       if (!token) {
//         setError('No authentication token available. Please log in again.');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         console.log('Fetching orders with token:', token.substring(0, 10) + '...');

//         // Fetch orders
//         const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const ordersText = await ordersResponse.text();
//         if (!ordersResponse.ok) {
//           try {
//             const errorData = JSON.parse(ordersText);
//             if (ordersResponse.status === 401) {
//               throw new Error('Unauthorized: Please log in again');
//             }
//             throw new Error(errorData.error || `Failed to fetch orders (Status: ${ordersResponse.status})`);
//           } catch (e) {
//             console.error('Non-JSON response from /api/orders:', ordersText);
//             throw new Error(`Invalid response from server: ${ordersText.slice(0, 100)}`);
//           }
//         }
//         const ordersData = JSON.parse(ordersText);
//         console.log('Fetched orders:', ordersData.length);
//         console.log('Sample order items:', ordersData[0]?.items); // Debug items structure

//         // Fetch products
//         console.log('Fetching products...');
//         const productsResponse = await fetch(`${API_BASE}/api/products`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const productsText = await productsResponse.text();
//         if (!productsResponse.ok) {
//           try {
//             const errorData = JSON.parse(productsText);
//             throw new Error(errorData.error || `Failed to fetch products (Status: ${productsResponse.status})`);
//           } catch (e) {
//             console.error('Non-JSON response from /api/products:', productsText);
//             throw new Error(`Invalid response from server: ${productsText.slice(0, 100)}`);
//           }
//         }
//         const productsData = JSON.parse(productsText);
//         console.log('Fetched products:', productsData.map(p => ({ _id: p._id, name: p.name })));
//         setProducts(productsData);

//         // Filter orders by date range
//         const now = new Date();
//         let startDate;
//         if (dateRange === 'last7days') {
//           startDate = new Date(now.setDate(now.getDate() - 7));
//         } else if (dateRange === 'last30days') {
//           startDate = new Date(now.setDate(now.getDate() - 30));
//         } else if (dateRange === 'last90days') {
//           startDate = new Date(now.setDate(now.getDate() - 90));
//         } else {
//           startDate = new Date(0); // All time
//         }
//         console.log('Filtering orders with startDate:', startDate);

//         const filteredOrders = ordersData
//           .map(order => {
//             // Fallback: Calculate amount from items if totalAmount is 0 or undefined
//             let amount = order.totals?.totalAmount || 0;
//             if (amount === 0 && order.items?.length > 0) {
//               amount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//               console.warn(`Order ${order._id} has zero totalAmount, calculated from items: $${amount.toFixed(2)}`);
//             }
//             return { ...order, totals: { ...order.totals, totalAmount: amount } };
//           })
//           .filter((order) => new Date(order.createdAt) >= startDate);
//         console.log('Filtered orders:', filteredOrders.length);
//         setOrders(filteredOrders);

//         // Calculate stats
//         const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totals.totalAmount, 0);
//         const averageOrderValue = filteredOrders.length ? totalRevenue / filteredOrders.length : 0;
//         const ordersByStatus = filteredOrders.reduce(
//           (acc, order) => {
//             acc[order.status] = (acc[order.status] || 0) + 1;
//             return acc;
//           },
//           { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 }
//         );

//         const productSales = filteredOrders
//           .flatMap((order) => order.items)
//           .reduce((acc, item) => {
//             // Use item.product if available, else fallback to item._id
//             const productId = item.product || item._id;
//             acc[productId] = acc[productId] || { productId, name: item.name, quantity: 0 };
//             acc[productId].quantity += item.quantity;
//             return acc;
//           }, {});
//         console.log('Product sales:', Object.values(productSales)); // Debug productSales

//         let topProducts = Object.values(productSales)
//           .sort((a, b) => b.quantity - a.quantity)
//           .slice(0, 5)
//           .map((product) => ({
//             ...product,
//             productId: product.productId,
//           }));

//         // Fallback: Map topProducts to valid _id from productsData
//         topProducts = topProducts.map((product) => {
//           const matchedProduct = productsData.find((p) => p.name === product.name || p._id === product.productId);
//           if (matchedProduct) {
//             return { ...product, productId: matchedProduct._id };
//           } else {
//             console.warn(`No matching product found for: ${product.name}, ID: ${product.productId}`);
//             return product;
//           }
//         });

//         console.log('Top products:', topProducts); // Debug final topProducts
//         setStats({ totalRevenue, averageOrderValue, ordersByStatus, topProducts });
//       } catch (err) {
//         console.error('Fetch sales data error:', err.message);
//         setError(err.message);
//         if (err.message.includes('Unauthorized')) {
//           logout();
//           navigate('/admin/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user && token && user.role === 'admin') {
//       fetchSalesData();
//     } else {
//       setLoading(false);
//       setError('Not authenticated. Please log in as admin.');
//     }
//   }, [user, token, dateRange, logout, navigate]);

//   const getSalesOverTimeData = () => {
//     const days = dateRange === 'last7days' ? 7 : dateRange === 'last30days' ? 30 : dateRange === 'last90days' ? 90 : 365;
//     const labels = Array.from({ length: days }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - (days - 1 - i));
//       return date.toLocaleDateString();
//     });

//     const salesData = labels.map((label) => {
//       const dailyOrders = orders.filter((order) => new Date(order.createdAt).toLocaleDateString() === label);
//       return dailyOrders.reduce((sum, order) => sum + order.totals.totalAmount, 0);
//     });

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Sales ($)',
//           data: salesData,
//           borderColor: 'rgba(30, 136, 229, 1)',
//           backgroundColor: 'rgba(30, 136, 229, 0.2)',
//           fill: true,
//           tension: 0.4,
//         },
//       ],
//     };
//   };

//   const getOrdersByStatusData = () => ({
//     labels: Object.keys(stats.ordersByStatus),
//     datasets: [
//       {
//         data: Object.values(stats.ordersByStatus),
//         backgroundColor: ['#ff9800', '#f57c00', '#1e88e5', '#4caf50', '#d32f2f'],
//         borderColor: ['#fff'],
//         borderWidth: 2,
//       },
//     ],
//   });

//   if (loading) return <div className="loading">Loading sales data...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   return (
//     <div className="sales-container">
//       <h2>Sales Analytics</h2>

//       <div className="sales-controls">
//         <label>
//           Date Range:
//           <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} aria-label="Select date range">
//             <option value="last7days">Last 7 Days</option>
//             <option value="last30days">Last 30 Days</option>
//             <option value="last90days">Last 90 Days</option>
//             <option value="all">All Time</option>
//           </select>
//         </label>
//       </div>

//       {orders.length === 0 ? (
//         <div className="no-data">
//           No orders found for the selected period. Try changing the date range or placing new orders.
//         </div>
//       ) : (
//         <>
//           <div className="stats-grid">
//             <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} />
//             <StatCard title="Average Order Value" value={`$${stats.averageOrderValue.toFixed(2)}`} />
//             <StatCard title="Total Orders" value={orders.length} />
//             <StatCard title="Shipped Orders" value={stats.ordersByStatus.Shipped} />
//             <StatCard title="Delivered Orders" value={stats.ordersByStatus.Delivered} />
//           </div>

//           <div className="charts-grid">
//             <div className="chart-card">
//               <h3>Sales Over Time</h3>
//               <div className="chart-wrapper">
//                 <Line
//                   data={getSalesOverTimeData()}
//                   options={{
//                     responsive: true,
//                     plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
//                     scales: {
//                       x: { title: { display: true, text: 'Date' } },
//                       y: { title: { display: true, text: 'Sales ($)' } },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="chart-card">
//               <h3>Orders by Status</h3>
//               <div className="chart-wrapper pie-chart">
//                 <Pie
//                   data={getOrdersByStatusData()}
//                   options={{
//                     responsive: true,
//                     plugins: {
//                       legend: { position: 'right' },
//                       tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="top-products">
//             <h3>Top Products</h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Product ID</th>
//                   <th>Name</th>
//                   <th>Units Sold</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {stats.topProducts.length > 0 ? (
//                   stats.topProducts.map((product) => (
//                     <tr key={product.productId}>
//                       <td>{product.productId}</td>
//                       <td>{product.name}</td>
//                       <td>{product.quantity}</td>
//                       <td>
//                         <Link
//                           to={`/admin/products/${product.productId}`}
//                           className="ap-btn ap-btn-view"
//                           aria-label={`View product ${product.name}`}
//                         >
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="no-products">
//                       No products sold in this period
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// const StatCard = ({ title, value }) => (
//   <div className="stat-card">
//     <h3>{title}</h3>
//     <p className="stat-value">{value}</p>
//   </div>
// );

// export default Sales;








import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import './Sales.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const Sales = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    averageOrderValue: 0,
    ordersByStatus: { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 },
    topProducts: [],
  });

  // Redirect if not admin or no token
  useEffect(() => {
    if (!user || !token || user.role !== 'admin') {
      console.log('Redirecting: Not admin or not authenticated', { userRole: user?.role, hasToken: !!token });
      setError('Access denied. Admin login required.');
      setLoading(false);
      navigate('/adminlogin');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!token) {
        setError('No authentication token available. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching orders with token:', token.substring(0, 10) + '...');

        // Fetch orders
        const ordersResponse = await fetch(`${API_BASE}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersText = await ordersResponse.text();
        if (!ordersResponse.ok) {
          try {
            const errorData = JSON.parse(ordersText);
            if (ordersResponse.status === 401) {
              throw new Error('Unauthorized: Please log in again');
            }
            throw new Error(errorData.error || `Failed to fetch orders (Status: ${ordersResponse.status})`);
          } catch (e) {
            console.error('Non-JSON response from /api/orders:', ordersText);
            throw new Error(`Invalid response from server: ${ordersText.slice(0, 100)}`);
          }
        }
        const ordersData = JSON.parse(ordersText);
        console.log('Fetched orders:', ordersData.length);
        console.log('Sample order items:', ordersData[0]?.items);

        // Fetch products
        console.log('Fetching products...');
        const productsResponse = await fetch(`${API_BASE}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productsText = await productsResponse.text();
        if (!productsResponse.ok) {
          try {
            const errorData = JSON.parse(productsText);
            throw new Error(errorData.error || `Failed to fetch products (Status: ${productsResponse.status})`);
          } catch (e) {
            console.error('Non-JSON response from /api/products:', productsText);
            throw new Error(`Invalid response from server: ${productsText.slice(0, 100)}`);
          }
        }
        const productsData = JSON.parse(productsText);
        console.log('Fetched products:', productsData.map(p => ({ _id: p._id, name: p.name })));
        setProducts(productsData);

        // Filter orders by date range
        const now = new Date();
        let startDate;
        if (dateRange === 'last7days') {
          startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (dateRange === 'last30days') {
          startDate = new Date(now.setDate(now.getDate() - 30));
        } else if (dateRange === 'last90days') {
          startDate = new Date(now.setDate(now.getDate() - 90));
        } else {
          startDate = new Date(0); // All time
        }
        console.log('Filtering orders with startDate:', startDate);

        const filteredOrders = ordersData
          .map(order => {
            // Fallback: Calculate amount from items if totalAmount is 0 or undefined
            let amount = order.totals?.totalAmount || 0;
            if (amount === 0 && order.items?.length > 0) {
              amount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              console.warn(`Order ${order._id} has zero totalAmount, calculated from items: ${amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`);
            }
            return { ...order, totals: { ...order.totals, totalAmount: amount } };
          })
          .filter((order) => new Date(order.createdAt) >= startDate);
        console.log('Filtered orders:', filteredOrders.length);
        setOrders(filteredOrders);

        // Calculate stats
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totals.totalAmount, 0);
        const averageOrderValue = filteredOrders.length ? totalRevenue / filteredOrders.length : 0;
        const ordersByStatus = filteredOrders.reduce(
          (acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          },
          { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 }
        );

        const productSales = filteredOrders
          .flatMap((order) => order.items)
          .reduce((acc, item) => {
            // Use item.product if available, else fallback to item._id
            const productId = item.product || item._id;
            acc[productId] = acc[productId] || { productId, name: item.name, quantity: 0 };
            acc[productId].quantity += item.quantity;
            return acc;
          }, {});
        console.log('Product sales:', Object.values(productSales));

        let topProducts = Object.values(productSales)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5)
          .map((product) => ({
            ...product,
            productId: product.productId,
          }));

        // Fallback: Map topProducts to valid _id from productsData
        topProducts = topProducts.map((product) => {
          const matchedProduct = productsData.find((p) => p.name === product.name || p._id === product.productId);
          if (matchedProduct) {
            return { ...product, productId: matchedProduct._id };
          } else {
            console.warn(`No matching product found for: ${product.name}, ID: ${product.productId}`);
            return product;
          }
        });

        console.log('Top products:', topProducts);
        setStats({ totalRevenue, averageOrderValue, ordersByStatus, topProducts });
      } catch (err) {
        console.error('Fetch sales data error:', err.message);
        setError(err.message);
        if (err.message.includes('Unauthorized')) {
          logout();
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && token && user.role === 'admin') {
      fetchSalesData();
    } else {
      setLoading(false);
      setError('Not authenticated. Please log in as admin.');
    }
  }, [user, token, dateRange, logout, navigate]);

  const getSalesOverTimeData = () => {
    const days = dateRange === 'last7days' ? 7 : dateRange === 'last30days' ? 30 : dateRange === 'last90days' ? 90 : 365;
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString();
    });

    const salesData = labels.map((label) => {
      const dailyOrders = orders.filter((order) => new Date(order.createdAt).toLocaleDateString() === label);
      return dailyOrders.reduce((sum, order) => sum + order.totals.totalAmount, 0);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Sales (₹)',
          data: salesData,
          borderColor: 'rgba(30, 136, 229, 1)',
          backgroundColor: 'rgba(30, 136, 229, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const getOrdersByStatusData = () => ({
    labels: Object.keys(stats.ordersByStatus),
    datasets: [
      {
        data: Object.values(stats.ordersByStatus),
        backgroundColor: ['#ff9800', '#f57c00', '#1e88e5', '#4caf50', '#d32f2f'],
        borderColor: ['#fff'],
        borderWidth: 2,
      },
    ],
  });

  if (loading) return <div className="loading">Loading sales data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="sales-container">
      <h2>Sales Analytics</h2>

      <div className="sales-controls">
        <label>
          Date Range:
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} aria-label="Select date range">
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </label>
      </div>

      {orders.length === 0 ? (
        <div className="no-data">
          No orders found for the selected period. Try changing the date range or placing new orders.
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard 
              title="Total Revenue" 
              value={stats.totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} 
            />
            <StatCard 
              title="Average Order Value" 
              value={stats.averageOrderValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} 
            />
            <StatCard title="Total Orders" value={orders.length} />
            <StatCard title="Shipped Orders" value={stats.ordersByStatus.Shipped} />
            <StatCard title="Delivered Orders" value={stats.ordersByStatus.Delivered} />
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Sales Over Time</h3>
              <div className="chart-wrapper">
                <Line
                  data={getSalesOverTimeData()}
                  options={{
                    responsive: true,
                    plugins: { 
                      legend: { position: 'top' }, 
                      tooltip: { 
                        mode: 'index', 
                        intersect: false,
                        callbacks: {
                          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`
                        }
                      } 
                    },
                    scales: {
                      x: { title: { display: true, text: 'Date' } },
                      y: { title: { display: true, text: 'Sales (₹)' } },
                    },
                  }}
                />
              </div>
            </div>
            <div className="chart-card">
              <h3>Orders by Status</h3>
              <div className="chart-wrapper pie-chart">
                <Pie
                  data={getOrdersByStatusData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'right' },
                      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="top-products">
            <h3>Top Products</h3>
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Units Sold</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.length > 0 ? (
                  stats.topProducts.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <Link
                          to={`/admin/products/${product.productId}`}
                          className="ap-btn ap-btn-view"
                          aria-label={`View product ${product.name}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-products">
                      No products sold in this period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h3>{title}</h3>
    <p className="stat-value">{value}</p>
  </div>
);

export default Sales;