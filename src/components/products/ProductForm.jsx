// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
// import Button from '../ui/Button';
// import { PRODUCT_SIZES } from '../../constants/config';
// import { validateProduct } from '../../utils/validators';

// const ProductForm = ({ product, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     size: '',
//     image: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const createProductMutation = useCreateProduct();
//   const updateProductMutation = useUpdateProduct();

//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || '',
//         size: product.size || '',
//         image: product.image || ''
//       });
//     }
//   }, [product]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate form
//     const validation = validateProduct(formData);
//     if (!validation.isValid) {
//       setErrors(validation.errors);
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         ...formData,
//         price: Number(formData.price)
//       };

//       if (product) {
//         await updateProductMutation.mutateAsync({ id: product._id, data: payload });
//       } else {
//         await createProductMutation.mutateAsync(payload);
//       }

//       onSuccess();
//     } catch (error) {
//       console.error('Operation failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
//           <h2 className="text-xl font-semibold">
//             {product ? 'Edit Product' : 'Add New Product'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Product Name *
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.name ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description *
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               rows="3"
//               className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.description ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Price (₹) *
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               required
//               min="0"
//               step="0.01"
//               className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.price ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Size *
//             </label>
//             <select
//               name="size"
//               value={formData.size}
//               onChange={handleChange}
//               required
//               className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.size ? 'border-red-500' : 'border-gray-300'
//               }`}
//             >
//               <option value="">Select Size</option>
//               {PRODUCT_SIZES.map(size => (
//                 <option key={size} value={size}>{size}</option>
//               ))}
//             </select>
//             {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Image URL
//             </label>
//             <input
//               type="url"
//               name="image"
//               value={formData.image}
//               onChange={handleChange}
//               placeholder="https://example.com/image.jpg"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex space-x-3 pt-4">
//             <Button
//               type="button"
//               onClick={onClose}
//               variant="outline"
//               className="flex-1"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               loading={loading}
//               className="flex-1"
//             >
//               {product ? 'Update Product' : 'Create Product'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;




















import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import Button from '../ui/Button';
import { PRODUCT_SIZES } from '../../constants/config';
import { validateProduct } from '../../utils/validators';

const ProductForm = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        size: product.size || '',
        image: null // file upload ke liye reset
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData(prev => ({
        ...prev,
        image: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateProduct(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", Number(formData.price));
      data.append("size", formData.size);
      if (formData.image) {
        data.append("image", formData.image);
      }

      if (product) {
        await updateProductMutation.mutateAsync({ id: product._id, data });
      } else {
        await createProductMutation.mutateAsync(data);
      }

      onSuccess();
    } catch (error) {
      console.error('Operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size *
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.size ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Size</option>
              {PRODUCT_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image *
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
