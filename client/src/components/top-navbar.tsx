import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function TopNavbar() {
  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [location, setLocation] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all products once on mount
  useEffect(() => {
    fetch(`/api/products`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then(data => setAllProducts(Array.isArray(data) ? data : []))
      .catch(error => {
        console.error('Error fetching products:', error);
        setAllProducts([]);
      });
  }, []);

  useEffect(() => {
    if (search.trim().length > 0) {
      const s = search.toLowerCase();
      const filtered = allProducts.filter(
        (product: any) =>
          product.name.toLowerCase().includes(s) ||
          (product.shortDescription && product.shortDescription.toLowerCase().includes(s))
      );
      setResults(filtered);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [search, allProducts]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    setLocation(`/products/${id}`);
    setShowDropdown(false);
    setSearch("");
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-2 text-sm">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm" ref={dropdownRef}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maroon-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
            </span>
            <input
              type="text"
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 transition-all duration-200 text-sm placeholder-gray-500 font-medium"
              style={{ boxShadow: '0 2px 8px 0 rgba(128,0,0,0.08)' }}
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => search && setShowDropdown(true)}
            />
          </div>
          {showDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-white/90 backdrop-blur-lg border border-maroon-100 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto animate-fade-in">
              {results.length > 0 ? (
                results.map(product => (
                  <div
                    key={product.id}
                    className="px-4 py-2 cursor-pointer hover:bg-maroon-500/90 hover:text-white transition-all rounded-lg flex flex-col gap-1"
                    onClick={() => handleSelect(product.id)}
                  >
                    <div className="font-semibold text-sm">{product.name}</div>
                    <div className="text-xs text-gray-500 group-hover:text-white">{product.shortDescription}</div>
                  </div>
                ))
              ) : search.trim() !== "" ? (
                <div className="px-4 py-2 text-gray-500">No products found</div>
              ) : null}
            </div>
          )}
        </div>
        {/* Phone & Email */}
        <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-6 ml-auto">
          <div className="flex items-center gap-2 text-primary font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.52l.3 1.2a2 2 0 01-.45 1.95l-.7.7a16.06 16.06 0 006.36 6.36l.7-.7a2 2 0 011.95-.45l1.2.3A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" /></svg>
            <span>9175240313</span>
          </div>
          <div className="flex items-center gap-2 text-primary font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <span>sales@reckonix.co.in</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
