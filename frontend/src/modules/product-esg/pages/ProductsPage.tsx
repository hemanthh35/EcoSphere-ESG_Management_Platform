import { useState } from 'react';
import { useProducts, useDeleteProduct, useProductStatistics } from '@/hooks/useProducts';
import type { ProductESGProfile } from '@/types/product';
import { ProductStatus } from '@/types/product';
import { ProductForm } from '../components/ProductForm';
import { Search, Plus, Edit2, Trash2, Box, Leaf, BarChart2 } from 'lucide-react';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductESGProfile | null>(null);

  const { data: stats } = useProductStatistics();
  const { data: productsData, isLoading } = useProducts({ search: search || undefined });
  const deleteMutation = useDeleteProduct();

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: ProductESGProfile) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product ESG Profiles</h1>
          <p className="text-sm text-slate-500 mt-1">Master repository for product sustainability data</p>
        </div>
        <button 
          onClick={handleCreate}
          className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Products</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.data?.total_products || 0}</p>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
            <Box className="w-6 h-6 text-slate-600" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Profiles</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats?.data?.active_products || 0}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg ESG Score</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats?.data?.avg_esg_score || '-'}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Carbon Factor</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{stats?.data?.avg_carbon_factor || '-'}</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
            <Leaf className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search by code or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Product Code</th>
                <th className="px-6 py-4">Name & Dept</th>
                <th className="px-6 py-4">ESG Score</th>
                <th className="px-6 py-4">Carbon Factor</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading products...</td>
                </tr>
              ) : productsData?.data?.items?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                productsData?.data?.items?.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{product.product_code}</td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{product.product_name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{product.department_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {product.esg_score != null ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                          product.esg_score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                          product.esg_score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.esg_score}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {product.carbon_factor !== null ? `${product.carbon_factor} ${product.carbon_unit || ''}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {product.sustainability_rating ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-slate-200 bg-slate-50">
                          {product.sustainability_rating}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.status === ProductStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm 
          productId={editingProduct?.id}
          initialData={editingProduct} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}
