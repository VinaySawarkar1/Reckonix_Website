import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Home as HomeIcon, Box, Info, Mail, Users, Building, ChevronDown } from "lucide-react";
import { useCart } from "../context/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import TopNavbar from "./top-navbar";
import { useCategories } from "../context/category-context";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();
  const { categories } = useCategories();
  const [activeCatIdx, setActiveCatIdx] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: "Home", href: "/", icon: <HomeIcon className="h-5 w-5 mr-2 text-primary" /> },
    { name: "About", href: "/about", icon: <Info className="h-5 w-5 mr-2 text-primary" /> },
    { name: "Contact", href: "/contact", icon: <Mail className="h-5 w-5 mr-2 text-primary" /> },
    { name: "Industries", href: "/industries", icon: <Building className="h-5 w-5 mr-2 text-primary" /> },
    { name: "Gallery", href: "/gallery", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V7.5zm0 0L8.25 12.75a2.25 2.25 0 0 0 3.18 0l2.07-2.07a2.25 2.25 0 0 1 3.18 0L21 15.75" /></svg> },
    { name: "Career", href: "/career", icon: <Users className="h-5 w-5 mr-2 text-primary" /> },
    { name: "Cart", href: "/cart", icon: <ShoppingCart className="h-5 w-5 mr-2 text-primary" /> },
  ];

  const isActive = (href: string) => location === href;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="shadow-2xl sticky top-0 z-50" style={{ background:  '#f9f9f9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <div>
                  <h1 className="text-2xl font-bold font-cinzel-decorative" style={{ color: '#800000' }}>
                    RECKONIX
                  </h1>
                  <p className="text-[10px] -mt-1 font-cinzel-decorative tracking-tight" style={{ color: '#800000' }}>
                    Test. Measure. Calibrate.
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-6 flex items-baseline space-x-4">
                {/* Home Link */}
                <Link
                  href="/"
                  className={`px-2 py-1 text-xs font-medium flex items-center transition-all ${
                    isActive('/')
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  <HomeIcon className="h-5 w-5 mr-2 text-primary" />
                  Home
                </Link>
                
                {/* Products Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                    className={`px-2 py-1 text-xs font-medium flex items-center transition-all ${
                      isActive('/products')
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-700 hover:text-primary"
                    }`}
                  >
                    <Box className="h-5 w-5 mr-2 text-primary" />
                    Products
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${productsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {productsDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div className="flex relative">
                          {/* Left: Main categories */}
                          <div
                            className="py-2 w-64 pr-6 bg-white border border-gray-200 shadow-lg rounded-lg"
                            style={{ position: 'relative', zIndex: 10 }}
                          >
                            <Link
                              href="/products"
                              className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors border-b border-gray-200"
                              onClick={() => setProductsDropdownOpen(false)}
                            >
                              All Products
                            </Link>
                            {categories.map((category, idx) => (
                              <Link
                                key={category.id}
                                href={`/products?category=${encodeURIComponent(category.name)}`}
                                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors border-b border-gray-100 ${idx===activeCatIdx? 'bg-gray-100 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}`}
                                onMouseEnter={() => setActiveCatIdx(idx)}
                                onFocus={() => setActiveCatIdx(idx)}
                                onClick={() => {
                                  setActiveCatIdx(idx);
                                  setProductsDropdownOpen(false);
                                }}
                              >
                                {category.name}
                              </Link>
                            ))}
                          </div>
                          {/* Right: Subcategories as a separate card, absolutely positioned to the right of the first card */}
                          <div
                            className="py-2 w-72 pl-6 bg-white border border-gray-200 shadow-lg rounded-lg"
                            style={{ minHeight: '100%', zIndex: 20, position: 'absolute', left: '272px', top: 0 }}
                          >
                            {categories[activeCatIdx] && (
                              <div className="px-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                                {categories[activeCatIdx].name}
                              </div>
                            )}
                            <div className="max-h-64 overflow-auto">
                              {(categories[activeCatIdx]?.subcategories || []).map((subcategory: any, index: number) => {
                                const subName = typeof subcategory === 'string' ? subcategory : subcategory.name;
                                return (
                                  <Link
                                    key={index}
                                    href={`/products?category=${encodeURIComponent(categories[activeCatIdx].name)}&subcategory=${encodeURIComponent(subName)}`}
                                    className="block px-6 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors rounded-md"
                                    onClick={() => setProductsDropdownOpen(false)}
                                  >
                                    {subName}
                                  </Link>
                                );
                              })}
                              {(!categories[activeCatIdx] || (categories[activeCatIdx]?.subcategories || []).length===0) && (
                                <div className="px-4 py-2 text-sm text-gray-500">No subcategories</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Other Navigation Links */}
                {navigation.slice(1).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-2 py-1 text-xs font-medium flex items-center transition-all ${
                      isActive(item.href)
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-700 hover:text-primary"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-primary"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {location !== '/products' && <TopNavbar />}
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden" style={{ background: '#f5f5f5' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Home Link */}
              <Link
                href="/"
                className={`block px-3 py-2 text-base font-medium rounded-md flex items-center transition-all ${
                  isActive('/')
                    ? "text-primary bg-gray-100"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <HomeIcon className="h-5 w-5 mr-2 text-primary" />
                Home
              </Link>
              
              {/* Mobile Products Dropdown */}
              <div className="border-t border-gray-200 pt-2">
                <div className="px-3 py-2 text-base font-medium text-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <Box className="h-5 w-5 mr-2 text-primary" />
                    Products
                  </div>
                </div>
                
                {/* All Products Link */}
                <Link
                  href="/products"
                  className={`block px-6 py-2 text-sm font-medium rounded-md flex items-center transition-all ${
                    isActive('/products')
                      ? "text-primary bg-gray-100"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                
                {/* Category Links */}
                {categories.map((category) => (
                  <div key={category.id} className="border-t border-gray-100">
                    <Link
                      href={`/products?category=${encodeURIComponent(category.name)}`}
                      className="block px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-primary hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="pl-6">
                        {category.subcategories.map((subcategory, index) => {
                          const subcategoryName = typeof subcategory === 'string' ? subcategory : subcategory.name;
                          return (
                            <Link
                              key={index}
                              href={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategoryName)}`}
                              className="block px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subcategoryName}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Other Navigation Links */}
              {navigation.slice(1).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md flex items-center transition-all ${
                    isActive(item.href)
                      ? "text-primary bg-gray-100"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              {/* Mobile Cart */}
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-gray-700">Quote Items</span>
                <div className="flex items-center"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
