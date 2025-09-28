import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { toast } from '../../hooks/use-toast';
import { Category, fetchCategories } from '../../lib/utils';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCategories } from '../../context/category-context';



// Helper to transform API response to frontend format
function transformApiResponse(categories: any[]): any[] {
  return categories.map(category => {
    // Handle case where subcategories might be undefined or null
    if (!category.subcategories || !Array.isArray(category.subcategories)) {
      return { ...category, subcategories: [] };
    }
    
    const transformedSubcategories = category.subcategories.map((sub: any) => {
      // Handle case where sub might be a string
      if (typeof sub === 'string') {
        return { name: sub, children: [] };
      }
      
      // Handle case where sub is an object
      if (sub && typeof sub === 'object') {
        const children = sub.children && Array.isArray(sub.children) 
          ? sub.children.map((child: any) => {
              if (typeof child === 'string') {
                return { name: child, children: [] };
              }
              return {
                name: child.name,
                children: child.children || []
              };
            })
          : [];
        
        return {
          name: sub.name,
          children
        };
      }
      
      return { name: sub, children: [] };
    });
    
    return {
      ...category,
      subcategories: transformedSubcategories
    };
  });
}

// Helper to flatten subcategories for display (including nested ones)
function flattenSubcategories(subs: any[], level = 0): Array<{ name: string; level: number }> {
  let result: Array<{ name: string; level: number }> = [];
  (subs || []).forEach(sub => {
    const subName = typeof sub === 'string' ? sub : sub.name;
    result.push({ name: subName, level });
    
    // Recursively add nested subcategories
    if (typeof sub === 'object' && sub.children && sub.children.length > 0) {
      result = result.concat(flattenSubcategories(sub.children, level + 1));
    }
  });
  return result;
}

// Helper for tree editing with path arrays
function TreeEditor({ nodes, setNodes }: { nodes: any[]; setNodes: (nodes: any[]) => void }) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());


  
  // Set node name by path
  const setNameByPath = (arr: any[], path: number[], value: string) => {
    if (path.length === 1) {
      arr[path[0]].name = value;
    } else {
      setNameByPath(arr[path[0]].children, path.slice(1), value);
    }
  };
  
  // Add subcategory at path
  const addSubByPath = (arr: any[], path: number[]) => {
    if (path.length === 0) {
      arr.push({ name: '', children: [] });
    } else {
      let node = arr[path[0]];
      if (!node.children) node.children = [];
      if (path.length === 1) {
        node.children.push({ name: '', children: [] });
      } else {
        addSubByPath(node.children, path.slice(1));
      }
    }
  };
  
  // Delete node at path
  const deleteByPath = (arr: any[], path: number[]) => {
    if (path.length === 1) {
      arr.splice(path[0], 1);
    } else {
      deleteByPath(arr[path[0]].children, path.slice(1));
    }
  };

  // Toggle expanded state for a node
  const toggleExpanded = (path: number[]) => {
    const pathKey = path.join('-');
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pathKey)) {
        newSet.delete(pathKey);
      } else {
        newSet.add(pathKey);
      }
      return newSet;
    });
  };

  // Check if a node is expanded
  const isExpanded = (path: number[]) => {
    return expandedNodes.has(path.join('-'));
  };

  // Render tree recursively
  const renderTree = (arr: any[], path: number[] = []) => (
    <ul className="ml-4">
      {arr.map((node, idx) => {
        const currentPath = [...path, idx];
        const hasChildren = node.children && node.children.length > 0;
        const expanded = isExpanded(currentPath);
        
        return (
          <li key={idx} className="mb-2">
            <div className="flex items-center">
              <input
                className="border px-2 py-1 rounded mr-2"
                value={node.name}
                onChange={e => {
                  const updated = JSON.parse(JSON.stringify(nodes));
                  setNameByPath(updated, currentPath, e.target.value);
                  setNodes(updated);
                }}
                placeholder="Subcategory name"
              />
              <button type="button" className="ml-1 text-xs text-red-500" onClick={() => {
                const updated = JSON.parse(JSON.stringify(nodes));
                deleteByPath(updated, currentPath);
                setNodes(updated);
              }}>
                Delete
              </button>
              <button type="button" className="ml-1 text-xs text-green-600" onClick={() => {
                const updated = JSON.parse(JSON.stringify(nodes));
                addSubByPath(updated, currentPath);
                setNodes(updated);
              }}>
                + Sub
              </button>
              {hasChildren && (
                <button 
                  type="button" 
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => toggleExpanded(currentPath)}
                >
                  {expanded ? '▼' : '▶'}
                </button>
              )}
              {hasChildren && (
                <span className="ml-2 text-xs text-gray-500">
                  ({node.children.length} sub)
                </span>
              )}
            </div>
            {/* Render nested children only if expanded */}
            {hasChildren && expanded && (
              <div className="ml-6 mt-2 border-l-2 border-gray-300 pl-4">
                {renderTree(node.children, currentPath)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
  return (
    <div>
      {renderTree(nodes)}
      <button type="button" className="mt-2 px-2 py-1 bg-blue-100 rounded" onClick={() => {
        const updated = JSON.parse(JSON.stringify(nodes));
        addSubByPath(updated, []);
        setNodes(updated);
      }}>
        + Add Subcategory
      </button>
    </div>
  );
}

export default function CategoryManagement() {
  const queryClient = useQueryClient();
  const { categories: contextCategories, loading, refreshCategories } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [treeSubcategories, setTreeSubcategories] = useState<any[]>([]);

  // Transform API response to frontend format
  const categories = transformApiResponse(contextCategories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.name.trim(), subcategories: treeSubcategories }),
      });

      if (!response.ok) {
        throw new Error('Failed to save category');
      }

      toast({
        title: "Success",
        description: editingCategory 
          ? "Category updated successfully" 
          : "Category created successfully",
      });

      // Invalidate categories cache to refresh all components using categories
      console.log('Invalidating categories cache...');
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      console.log('Categories cache invalidated');

      // Also refresh the context
      refreshCategories();

      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '' });
      setTreeSubcategories([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      // Invalidate categories cache to refresh all components using categories
      console.log('Invalidating categories cache...');
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      console.log('Categories cache invalidated');

      // Also refresh the context
      refreshCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setTreeSubcategories(category.subcategories);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setTreeSubcategories([]);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white rounded">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div>
                <Label>Subcategories (tree)</Label>
                <TreeEditor nodes={treeSubcategories} setNodes={setTreeSubcategories} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Subcategories:</Label>
                <div className="space-y-1">
                  {flattenSubcategories(category.subcategories).map((subcategory, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-2 h-2 bg-gray-400 rounded-full mr-2"
                        style={{ marginLeft: `${subcategory.level * 12}px` }}
                      />
                      <Badge variant="secondary" className="text-xs">
                        {subcategory.name}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found. Create your first category to get started.</p>
        </div>
      )}
    </div>
  );
} 
