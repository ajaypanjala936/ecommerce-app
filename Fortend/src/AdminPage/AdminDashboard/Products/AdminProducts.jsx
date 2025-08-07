







// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import './AdminProducts.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// const AdminProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('All');
//   const [stockFilter, setStockFilter] = useState('all');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     category: 'Electronics',
//     price: '',
//     stock: '',
//     description: '',
//     image: null,
//   });
//   const [editProduct, setEditProduct] = useState({
//     _id: '',
//     name: '',
//     category: 'Electronics',
//     price: '',
//     stock: '',
//     description: '',
//     image: null,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user, token, logout } = useAuth();
//   const navigate = useNavigate();
//   const categories = ['Electronics', 'Apparel', 'Accessories', 'Fitness', 'Home'];

//   // Redirect if not admin
//   useEffect(() => {
//     if (!user || !token || user.role !== 'admin') {
//       console.log('Redirecting: Not admin or not authenticated', { userRole: user?.role, hasToken: !!token });
//       setError('Access denied. Admin login required.');
//       setLoading(false);
//       navigate('/admin/login');
//     }
//   }, [user, token, navigate]);

//   // Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (!token) {
//         setError('No authentication token available');
//         setLoading(false);
//         return;
//       }

//       try {
//         console.log('Fetching products with token:', token.substring(0, 10) + '...');
//         const response = await fetch(`${API_BASE}/api/products`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const responseText = await response.text();
//         if (!response.ok) {
//           try {
//             const errorData = JSON.parse(responseText);
//             if (response.status === 401) {
//               throw new Error('Unauthorized: Please log in again');
//             }
//             throw new Error(errorData.error || `Failed to fetch products (Status: ${response.status})`);
//           } catch (e) {
//             console.error('Non-JSON response from /api/products:', responseText);
//             throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
//           }
//         }
//         const data = JSON.parse(responseText);
//         console.log('Fetched products:', data.map((p) => ({ _id: p._id, name: p.name })));
//         setProducts(data);
//         setFilteredProducts(data);
//       } catch (err) {
//         console.error('Fetch products error:', err.message);
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
//       fetchProducts();
//     }
//   }, [user, token, logout, navigate]);

//   // Filter products based on search query, category, and stock
//   useEffect(() => {
//     let filtered = products;

//     // Apply search query filter
//     const lowerQuery = searchQuery.toLowerCase().trim();
//     if (lowerQuery) {
//       filtered = filtered.filter(
//         (product) =>
//           product.name.toLowerCase().includes(lowerQuery) ||
//           product.category.toLowerCase().includes(lowerQuery) ||
//           product.description?.toLowerCase().includes(lowerQuery)
//       );
//     }

//     // Apply category filter
//     if (categoryFilter !== 'All') {
//       filtered = filtered.filter((product) => product.category === categoryFilter);
//     }

//     // Apply stock filter
//     if (stockFilter === 'low') {
//       filtered = filtered.filter((product) => product.stock < 50 && product.stock > 0);
//     } else if (stockFilter === 'in') {
//       filtered = filtered.filter((product) => product.stock >= 50);
//     } else if (stockFilter === 'out') {
//       filtered = filtered.filter((product) => product.stock === 0);
//     }

//     console.log('Filters:', { searchQuery: lowerQuery, categoryFilter, stockFilter });
//     console.log('Filtered products:', filtered.map((p) => ({ _id: p._id, name: p.name })));
//     setFilteredProducts(filtered);
//   }, [searchQuery, categoryFilter, stockFilter, products]);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery('');
//   };

//   const handleCategoryFilterChange = (e) => {
//     setCategoryFilter(e.target.value);
//   };

//   const handleStockFilterChange = (e) => {
//     setStockFilter(e.target.value);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditProduct((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         setError('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
//         return;
//       }
//       setNewProduct((prev) => ({
//         ...prev,
//         image: file,
//       }));
//       setError(null);
//     }
//   };

//   const handleEditFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         setError('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
//         return;
//       }
//       setEditProduct((prev) => ({
//         ...prev,
//         image: file,
//       }));
//       setError(null);
//     }
//   };

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     if (!user || !token || user.role !== 'admin') {
//       setError('You are not authorized to add products');
//       return;
//     }
//     try {
//       const price = parseFloat(newProduct.price);
//       const stock = parseInt(newProduct.stock);
//       if (isNaN(price) || price < 0) {
//         throw new Error('Price must be a non-negative number');
//       }
//       if (isNaN(stock) || stock < 0) {
//         throw new Error('Stock must be a non-negative integer');
//       }

//       const formData = new FormData();
//       formData.append('name', newProduct.name);
//       formData.append('category', newProduct.category);
//       formData.append('price', price);
//       formData.append('stock', stock);
//       formData.append('description', newProduct.description);
//       if (newProduct.image) {
//         formData.append('image', newProduct.image);
//       }

//       console.log('Adding product:', newProduct.name);
//       const response = await fetch(`${API_BASE}/api/products`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const responseText = await response.text();
//       if (!response.ok) {
//         try {
//           const errorData = JSON.parse(responseText);
//           throw new Error(errorData.message || `Failed to add product (Status: ${response.status})`);
//         } catch (e) {
//           console.error('Non-JSON response from /api/products POST:', responseText);
//           throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
//         }
//       }

//       const addedProduct = JSON.parse(responseText);
//       console.log('Added product:', addedProduct);
//       setProducts([...products, addedProduct]);
//       setFilteredProducts([...products, addedProduct]);
//       setNewProduct({
//         name: '',
//         category: 'Electronics',
//         price: '',
//         stock: '',
//         description: '',
//         image: null,
//       });
//       setShowAddModal(false);
//       setError(null);
//     } catch (err) {
//       console.error('Add product error:', err.message);
//       setError(err.message);
//     }
//   };

//   const handleEditProduct = (product) => {
//     setEditProduct({
//       _id: product._id,
//       name: product.name,
//       category: product.category,
//       price: product.price.toString(),
//       stock: product.stock.toString(),
//       description: product.description || '',
//       image: null,
//     });
//     setShowEditModal(true);
//     setError(null);
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     if (!user || !token || user.role !== 'admin') {
//       setError('You are not authorized to update products');
//       return;
//     }
//     try {
//       const price = parseFloat(editProduct.price);
//       const stock = parseInt(editProduct.stock);
//       if (isNaN(price) || price < 0) {
//         throw new Error('Price must be a non-negative number');
//       }
//       if (isNaN(stock) || stock < 0) {
//         throw new Error('Stock must be a non-negative integer');
//       }

//       const formData = new FormData();
//       formData.append('name', editProduct.name);
//       formData.append('category', editProduct.category);
//       formData.append('price', price);
//       formData.append('stock', stock);
//       formData.append('description', editProduct.description);
//       if (editProduct.image) {
//         formData.append('image', editProduct.image);
//       }

//       console.log('Updating product:', editProduct._id);
//       const response = await fetch(`${API_BASE}/api/products/${editProduct._id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const responseText = await response.text();
//       if (!response.ok) {
//         try {
//           const errorData = JSON.parse(responseText);
//           throw new Error(errorData.message || `Failed to update product (Status: ${response.status})`);
//         } catch (e) {
//           console.error('Non-JSON response from /api/products PUT:', responseText);
//           throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
//         }
//       }

//       const updatedProduct = JSON.parse(responseText);
//       console.log('Updated product:', updatedProduct);
//       setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
//       setFilteredProducts(filteredProducts.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
//       setEditProduct({
//         _id: '',
//         name: '',
//         category: 'Electronics',
//         price: '',
//         stock: '',
//         description: '',
//         image: null,
//       });
//       setShowEditModal(false);
//       setError(null);
//     } catch (err) {
//       console.error('Update product error:', err.message);
//       setError(err.message);
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     if (!user || !token || user.role !== 'admin') {
//       setError('You are not authorized to delete products');
//       return;
//     }
//     if (!window.confirm('Are you sure you want to delete this product?')) {
//       return;
//     }
//     try {
//       console.log(`Deleting product ID: ${id}`);
//       const response = await fetch(`${API_BASE}/api/products/${id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const responseText = await response.text();
//       if (!response.ok) {
//         try {
//           const errorData = JSON.parse(responseText);
//           throw new Error(errorData.error || `Failed to delete product (Status: ${response.status})`);
//         } catch (e) {
//           console.error('Non-JSON response from /api/products DELETE:', responseText);
//           throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
//         }
//       }

//       console.log('Deleted product ID:', id);
//       setProducts(products.filter((product) => product._id !== id));
//       setFilteredProducts(filteredProducts.filter((product) => product._id !== id));
//       setError(null);
//     } catch (err) {
//       console.error('Delete product error:', err.message);
//       setError(err.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="ap-loading">
//         <div className="ap-spinner"></div>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="ap-error">
//         <h2>Error</h2>
//         <p>{error}</p>
//         <button className="ap-retry-btn" onClick={() => window.location.reload()}>
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="ap-container">
//       <h2>Product Management</h2>
//       <div className="ap-actions">
//         <div className="ap-filter-container">
//           <div className="ap-search-container">
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//               className="ap-search-input"
//               aria-label="Search products"
//             />
//             {searchQuery && (
//               <button
//                 type="button"
//                 className="ap-clear-search"
//                 onClick={handleClearSearch}
//                 aria-label="Clear search"
//               >
//                 ×
//               </button>
//             )}
//           </div>
//           <select
//             value={categoryFilter}
//             onChange={handleCategoryFilterChange}
//             className="ap-filter-select"
//             aria-label="Filter by category"
//           >
//             <option value="All">All Categories</option>
//             {categories.map((category) => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//           <select
//             value={stockFilter}
//             onChange={handleStockFilterChange}
//             className="ap-filter-select"
//             aria-label="Filter by stock"
//           >
//             <option value="all">All Stock Levels</option>
//             <option value="low">Low Stock (&lt; 50)</option>
//             <option value="in">In Stock (≥ 50)</option>
//             <option value="out">Out of Stock</option>
//           </select>
//         </div>
//         <button className="ap-btn ap-btn-primary" onClick={() => setShowAddModal(true)}>
//           Add New Product
//         </button>
//       </div>

//       <div className="ap-table-responsive">
//         <table className={`ap-table ${filteredProducts.length === 0 ? 'ap-table-empty' : ''}`}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Product Name</th>
//               <th>Category</th>
//               <th>Price</th>
//               <th>Stock</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map((product) => (
//               <tr key={product._id}>
//                 <td>{product._id}</td>
//                 <td>{product.name}</td>
//                 <td>{product.category}</td>
//                 <td>${product.price?.toFixed(2)}</td>
//                 <td className={product.stock < 50 ? 'ap-low-stock' : ''}>{product.stock}</td>
//                 <td className="ap-action-buttons">
//                   <Link to={`/admin/products/${product._id}`} className="ap-btn ap-btn-view">
//                     View
//                   </Link>
//                   <button className="ap-btn ap-btn-edit" onClick={() => handleEditProduct(product)}>
//                     Edit
//                   </button>
//                   <button className="ap-btn ap-btn-delete" onClick={() => handleDeleteProduct(product._id)}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {filteredProducts.length === 0 && (
//           <div className="ap-empty-message">
//             <p>No products match your filters.</p>
//           </div>
//         )}
//       </div>

//       {showAddModal && (
//         <div className="ap-modal-overlay">
//           <div className="ap-modal-content">
//             <div className="ap-modal-header">
//               <h3>Add New Product</h3>
//               <button className="ap-close-btn" onClick={() => setShowAddModal(false)} aria-label="Close modal">
//                 ×
//               </button>
//             </div>
//             <form onSubmit={handleAddProduct} className="ap-add-form">
//               {error && <p className="ap-form-error">{error}</p>}
//               <div className="ap-form-group">
//                 <label htmlFor="name">Product Name</label>
//                 <input
//                   id="name"
//                   type="text"
//                   name="name"
//                   value={newProduct.name}
//                   onChange={handleInputChange}
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div className="ap-form-group">
//                 <label htmlFor="category">Category</label>
//                 <select
//                   id="category"
//                   name="category"
//                   value={newProduct.category}
//                   onChange={handleInputChange}
//                   required
//                   aria-required="true"
//                 >
//                   {categories.map((category) => (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="ap-form-group">
//                 <label htmlFor="price">Price ($)</label>
//                 <input
//                   id="price"
//                   type="number"
//                   name="price"
//                   value={newProduct.price}
//                   onChange={handleInputChange}
//                   min="0"
//                   step="0.01"
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div className="ap-form-group">
//                 <label htmlFor="stock">Stock</label>
//                 <input
//                   id="stock"
//                   type="number"
//                   name="stock"
//                   value={newProduct.stock}
//                   onChange={handleInputChange}
//                   min="0"
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div className="ap-form-group">
//                 <label htmlFor="description">Description</label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={newProduct.description}
//                   onChange={handleInputChange}
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div className="ap-form-group">
//                 <label htmlFor="image">Product Image</label>
//                 <input
//                   id="image"
//                   type="file"
//                   name="image"
//                   accept="image/jpeg,image/png,image/gif,image/webp"
//                   onChange={handleFileChange}
//                 />
//                 {newProduct.image && <p className="ap-file-selected">Selected: {newProduct.image.name}</p>}
//               </div>
//               <div className="ap-modal-actions">
//                 <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setShowAddModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="ap-btn ap-btn-primary">
//                   Add Product
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {showEditModal && (
//         <div className="ap-modal-overlay">
//           <div className="ap-modal-content">
//             <div className="ap-modal-header">
//               <h3>Edit Product</h3>
//               <button className="ap-close-btn" onClick={() => setShowEditModal(false)} aria-label="Close modal">
//                 ×
//               </button>
//             </div>
//             <form onSubmit={handleUpdateProduct} className="ap-edit-form">
//               {error && <p className="ap-form-error">{error}</p>}
//               <div className="ap-form-group">
//                 <label htmlFor="edit-name">Product Name</label>
//                 <input
//                   id="edit-name"
//                   type="text"
//                   name="name"
//                   value={editProduct.name}
//                   onChange={handleEditInputChange}
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div className="ap-form-group">
//                 <label htmlFor="edit-category">Category</label>
//                 <select
//                   id="edit-category"
//                   name="category"
//                   value={editProduct.category}
//                   onChange={handleEditInputChange}
//                   required
//                   aria-required="true"
//                 >
//                   {categories.map((category) => (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="ap-form-group">
//                 <label htmlFor="edit-price">Price ($)</label>
//                 <input
//                   id="edit-price"
//                   type="number"
//                   name="price"
//                   value={editProduct.price}
//                   onChange={handleEditInputChange}
//                   min="0"
//                   step="0.01"
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div className="ap-form-group">
//                 <label htmlFor="edit-stock">Stock</label>
//                 <input
//                   id="edit-stock"
//                   type="number"
//                   name="stock"
//                   value={editProduct.stock}
//                   onChange={handleEditInputChange}
//                   min="0"
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div className="ap-form-group">
//                 <label htmlFor="edit-description">Description</label>
//                 <textarea
//                   id="edit-description"
//                   name="description"
//                   value={editProduct.description}
//                   onChange={handleEditInputChange}
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div className="ap-form-group">
//                 <label htmlFor="edit-image">Product Image</label>
//                 <input
//                   id="edit-image"
//                   type="file"
//                   name="image"
//                   accept="image/jpeg,image/png,image/gif,image/webp"
//                   onChange={handleEditFileChange}
//                 />
//                 {editProduct.image && <p className="ap-file-selected">Selected: {editProduct.image.name}</p>}
//               </div>
//               <div className="ap-modal-actions">
//                 <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setShowEditModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="ap-btn ap-btn-primary">
//                   Update Product
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminProducts;








import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminProducts.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    description: '',
    image: null,
  });
  const [editProduct, setEditProduct] = useState({
    _id: '',
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const categories = ['Electronics', 'Apparel', 'Accessories', 'Fitness', 'Home'];

  // Redirect if not admin
  useEffect(() => {
    if (!user || !token || user.role !== 'admin') {
      console.log('Redirecting: Not admin or not authenticated', { userRole: user?.role, hasToken: !!token });
      setError('Access denied. Admin login required.');
      setLoading(false);
      navigate('/admin/login');
    }
  }, [user, token, navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        setError('No authentication token available');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching products with token:', token.substring(0, 10) + '...');
        const response = await fetch(`${API_BASE}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const responseText = await response.text();
        if (!response.ok) {
          try {
            const errorData = JSON.parse(responseText);
            if (response.status === 401) {
              throw new Error('Unauthorized: Please log in again');
            }
            throw new Error(errorData.error || `Failed to fetch products (Status: ${response.status})`);
          } catch (e) {
            console.error('Non-JSON response from /api/products:', responseText);
            throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
          }
        }
        const data = JSON.parse(responseText);
        console.log('Fetched products:', data.map((p) => ({ _id: p._id, name: p.name })));
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Fetch products error:', err.message);
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
      fetchProducts();
    }
  }, [user, token, logout, navigate]);

  // Filter products based on search query, category, and stock
  useEffect(() => {
    let filtered = products;

    // Apply search query filter
    const lowerQuery = searchQuery.toLowerCase().trim();
    if (lowerQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery) ||
          product.description?.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    // Apply stock filter
    if (stockFilter === 'low') {
      filtered = filtered.filter((product) => product.stock < 50 && product.stock > 0);
    } else if (stockFilter === 'in') {
      filtered = filtered.filter((product) => product.stock >= 50);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter((product) => product.stock === 0);
    }

    console.log('Filters:', { searchQuery: lowerQuery, categoryFilter, stockFilter });
    console.log('Filtered products:', filtered.map((p) => ({ _id: p._id, name: p.name })));
    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, stockFilter, products]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleStockFilterChange = (e) => {
    setStockFilter(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
        return;
      }
      setNewProduct((prev) => ({
        ...prev,
        image: file,
      }));
      setError(null);
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
        return;
      }
      setEditProduct((prev) => ({
        ...prev,
        image: file,
      }));
      setError(null);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user || !token || user.role !== 'admin') {
      setError('You are not authorized to add products');
      return;
    }
    try {
      const price = parseFloat(newProduct.price);
      const stock = parseInt(newProduct.stock);
      if (isNaN(price) || price < 0) {
        throw new Error('Price must be a non-negative number');
      }
      if (isNaN(stock) || stock < 0) {
        throw new Error('Stock must be a non-negative integer');
      }

      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category', newProduct.category);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('description', newProduct.description);
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      console.log('Adding product:', newProduct.name);
      const response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `Failed to add product (Status: ${response.status})`);
        } catch (e) {
          console.error('Non-JSON response from /api/products POST:', responseText);
          throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
        }
      }

      const addedProduct = JSON.parse(responseText);
      console.log('Added product:', addedProduct);
      setProducts([...products, addedProduct]);
      setFilteredProducts([...products, addedProduct]);
      setNewProduct({
        name: '',
        category: 'Electronics',
        price: '',
        stock: '',
        description: '',
        image: null,
      });
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      console.error('Add product error:', err.message);
      setError(err.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct({
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      image: null,
    });
    setShowEditModal(true);
    setError(null);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!user || !token || user.role !== 'admin') {
      setError('You are not authorized to update products');
      return;
    }
    try {
      const price = parseFloat(editProduct.price);
      const stock = parseInt(editProduct.stock);
      if (isNaN(price) || price < 0) {
        throw new Error('Price must be a non-negative number');
      }
      if (isNaN(stock) || stock < 0) {
        throw new Error('Stock must be a non-negative integer');
      }

      const formData = new FormData();
      formData.append('name', editProduct.name);
      formData.append('category', editProduct.category);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('description', editProduct.description);
      if (editProduct.image) {
        formData.append('image', editProduct.image);
      }

      console.log('Updating product:', editProduct._id);
      const response = await fetch(`${API_BASE}/api/products/${editProduct._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `Failed to update product (Status: ${response.status})`);
        } catch (e) {
          console.error('Non-JSON response from /api/products PUT:', responseText);
          throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
        }
      }

      const updatedProduct = JSON.parse(responseText);
      console.log('Updated product:', updatedProduct);
      setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
      setFilteredProducts(filteredProducts.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
      setEditProduct({
        _id: '',
        name: '',
        category: 'Electronics',
        price: '',
        stock: '',
        description: '',
        image: null,
      });
      setShowEditModal(false);
      setError(null);
    } catch (err) {
      console.error('Update product error:', err.message);
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!user || !token || user.role !== 'admin') {
      setError('You are not authorized to delete products');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      console.log(`Deleting product ID: ${id}`);
      const response = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseText = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || `Failed to delete product (Status: ${response.status})`);
        } catch (e) {
          console.error('Non-JSON response from /api/products DELETE:', responseText);
          throw new Error(`Invalid response from server: ${responseText.slice(0, 100)}`);
        }
      }

      console.log('Deleted product ID:', id);
      setProducts(products.filter((product) => product._id !== id));
      setFilteredProducts(filteredProducts.filter((product) => product._id !== id));
      setError(null);
    } catch (err) {
      console.error('Delete product error:', err.message);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="ap-loading">
        <div className="ap-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ap-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="ap-retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="ap-container">
      <h2>Product Management</h2>
      <div className="ap-actions">
        <div className="ap-filter-container">
          <div className="ap-search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="ap-search-input"
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                type="button"
                className="ap-clear-search"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <select
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            className="ap-filter-select"
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={handleStockFilterChange}
            className="ap-filter-select"
            aria-label="Filter by stock"
          >
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock (&lt; 50)</option>
            <option value="in">In Stock (≥ 50)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
        <button className="ap-btn ap-btn-primary" onClick={() => setShowAddModal(true)}>
          Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="ap-table-responsive">
        <table className={`ap-table ${filteredProducts.length === 0 ? 'ap-table-empty' : ''}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                <td className={product.stock < 50 ? 'ap-low-stock' : ''}>{product.stock}</td>
                <td className="ap-action-buttons">
                  <Link to={`/admin/products/${product._id}`} className="ap-btn ap-btn-view">
                    View
                  </Link>
                  <button className="ap-btn ap-btn-edit" onClick={() => handleEditProduct(product)}>
                    Edit
                  </button>
                  <button className="ap-btn ap-btn-delete" onClick={() => handleDeleteProduct(product._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="ap-empty-message">
            <p>No products match your filters.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="ap-modal-overlay">
          <div className="ap-modal-content">
            <div className="ap-modal-header">
              <h3>Add New Product</h3>
              <button className="ap-close-btn" onClick={() => setShowAddModal(false)} aria-label="Close modal">
                ×
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="ap-add-form">
              {error && <p className="ap-form-error">{error}</p>}
              <div className="ap-form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
              </div>
              <div className="ap-form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ap-form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  aria-required="true"
                />
              </div>
              <div className="ap-form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                  aria-required="true"
                />
              </div>
              <div className="ap-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
              </div>
              <div className="ap-form-group">
                <label htmlFor="image">Product Image</label>
                <input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                />
                {newProduct.image && <p className="ap-file-selected">Selected: {newProduct.image.name}</p>}
              </div>
              <div className="ap-modal-actions">
                <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="ap-btn ap-btn-primary">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="ap-modal-overlay">
          <div className="ap-modal-content">
            <div className="ap-modal-header">
              <h3>Edit Product</h3>
              <button className="ap-close-btn" onClick={() => setShowEditModal(false)} aria-label="Close modal">
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateProduct} className="ap-edit-form">
              {error && <p className="ap-form-error">{error}</p>}
              <div className="ap-form-group">
                <label htmlFor="edit-name">Product Name</label>
                <input
                  id="edit-name"
                  type="text"
                  name="name"
                  value={editProduct.name}
                  onChange={handleEditInputChange}
                  required
                  aria-required="true"
                />
              </div>
              <div className="ap-form-group">
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  name="category"
                  value={editProduct.category}
                  onChange={handleEditInputChange}
                  required
                  aria-required="true"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ap-form-group">
                <label htmlFor="edit-price">Price (₹)</label>
                <input
                  id="edit-price"
                  type="number"
                  name="price"
                  value={editProduct.price}
                  onChange={handleEditInputChange}
                  min="0"
                  step="0.01"
                  required
                  aria-required="true"
                />
              </div>
              <div className="ap-form-group">
                <label htmlFor="edit-stock">Stock</label>
                <input
                  id="edit-stock"
                  type="number"
                  name="stock"
                  value={editProduct.stock}
                  onChange={handleEditInputChange}
                  min="0"
                  required
                  aria-required="true"
                />
              </div>
              <div className="ap-form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editProduct.description}
                  onChange={handleEditInputChange}
                  required
                  aria-required="true"
                />
              </div>
              <div className="ap-form-group">
                <label htmlFor="edit-image">Product Image</label>
                <input
                  id="edit-image"
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleEditFileChange}
                />
                {editProduct.image && <p className="ap-file-selected">Selected: {editProduct.image.name}</p>}
              </div>
              <div className="ap-modal-actions">
                <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="ap-btn ap-btn-primary">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;