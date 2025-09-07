import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Save, RotateCcw } from 'lucide-react';
import { useCategories } from '@/context/category-context';

interface Product {
  id: number;
  _id?: string; // MongoDB ObjectId
  name: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  imageUrl: string;
  rank: number;
}

interface ProductReorderProps {
  products: Product[];
  onReorder: (updates: { id: string | number; rank: number }[]) => void;
  loading?: boolean;
}

const ProductReorder: React.FC<ProductReorderProps> = ({ products, onReorder, loading = false }) => {
  const { categories } = useCategories();
  const [groupedProducts, setGroupedProducts] = useState<Record<string, Product[]>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Group products by category and sort by rank
  useEffect(() => {
    const grouped = products.reduce((acc, product) => {
      // Handle undefined/null categories
      const category = product.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    // Sort each category by rank
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
    });

    setGroupedProducts(grouped);
  }, [products]);

  const handleDragStart = (e: React.DragEvent, productId: number | string) => {
    if (productId !== undefined && productId !== null) {
      e.dataTransfer.setData('text/plain', productId.toString());
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetProductId: number, category: string) => {
    e.preventDefault();
    const draggedProductId = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (draggedProductId === targetProductId) return;

    const categoryProducts = [...groupedProducts[category]];
    const draggedIndex = categoryProducts.findIndex(p => p.id === draggedProductId);
    const targetIndex = categoryProducts.findIndex(p => p.id === targetProductId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove dragged item and insert at target position
    const [draggedProduct] = categoryProducts.splice(draggedIndex, 1);
    categoryProducts.splice(targetIndex, 0, draggedProduct);

    // Update ranks for all products in the category
    const updatedProducts = categoryProducts.map((product, index) => ({
      ...product,
      rank: index
    }));

    setGroupedProducts(prev => ({
      ...prev,
      [category]: updatedProducts
    }));

    setHasChanges(true);
  };

  const handleSave = () => {
    const updates: { id: string | number; rank: number }[] = [];
    Object.values(groupedProducts).forEach(categoryProducts => {
      categoryProducts.forEach(product => {
        // Handle both numeric id and MongoDB _id
        const productId = product.id || product._id;
        
        // Skip products with invalid IDs (undefined, null, empty string)
        if (!productId || productId === undefined || productId === null || productId === '') {
          // Console log removed for production
          return;
        }
        
        // Only include products with valid IDs and ranks
        if ((typeof productId === 'number' && !isNaN(productId)) || 
            (typeof productId === 'string' && productId.length > 0)) {
          const rank = typeof product.rank === 'number' ? product.rank : 0;
          updates.push({ id: productId, rank });
        } else {
          // Console log removed for production
        }
      });
    });

    // Console log removed for production
    
    if (updates.length === 0) {
      // Console log removed for production
      return;
    }
    
    onReorder(updates);
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to original order
    const grouped = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
    });

    setGroupedProducts(grouped);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Order Management</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Order'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">{categoryProducts.length} products</Badge>
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryProducts.map((product, index) => {
                  const productId = product.id || product._id;
                  const hasValidId = productId && productId !== undefined && productId !== null && productId !== '';
                  const isDraggable = hasValidId && (typeof productId === 'number' || typeof productId === 'string');
                  
                  return (
                    <div
                      key={product.id || product._id}
                      draggable={isDraggable}
                      onDragStart={isDraggable ? (e) => handleDragStart(e, productId) : undefined}
                      onDragOver={isDraggable ? handleDragOver : undefined}
                      onDrop={isDraggable ? (e) => handleDrop(e, productId, category) : undefined}
                      className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                        isDraggable 
                          ? 'bg-white hover:bg-gray-50 cursor-move' 
                          : 'bg-gray-100 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <GripVertical className={`h-4 w-4 ${isDraggable ? 'text-gray-400' : 'text-gray-300'}`} />
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.shortDescription}</div>
                          {!hasValidId && (
                            <div className="text-xs text-red-500 mt-1">
                              ⚠️ Cannot reorder - Invalid ID
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={isDraggable ? "outline" : "secondary"}>#{index + 1}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(groupedProducts).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found to reorder.
        </div>
      )}
    </div>
  );
};

export default ProductReorder; 
