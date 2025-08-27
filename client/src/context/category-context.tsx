import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchCategories, Category } from "@/lib/utils";

interface CategoryContextType {
  categories: Category[];
  refreshCategories: () => void;
  loading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
    // Only fetch once on mount
    // No polling
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, refreshCategories: loadCategories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategories must be used within a CategoryProvider");
  return context;
}; 