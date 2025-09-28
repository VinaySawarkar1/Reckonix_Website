import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, Category } from "@/lib/utils";

interface CategoryContextType {
  categories: Category[];
  refreshCategories: () => void;
  loading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const { data: categories = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('CategoryProvider: categories updated', categories.length, 'categories');

  const refreshCategories = () => {
    console.log('CategoryProvider: manually refreshing categories...');
    refetch();
  };

  return (
    <CategoryContext.Provider value={{ categories, refreshCategories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategories must be used within a CategoryProvider");
  return context;
}; 
