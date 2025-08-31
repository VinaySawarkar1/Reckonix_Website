import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/product-card";
import SEO from "../components/seo";
import { Search } from "lucide-react";
import type { Product } from "../../../shared/schema";
import { useCategories } from "@/context/category-context";
import { Gauge, Ruler, Thermometer, Activity, Weight, Microscope, Compass, Wrench, ClipboardList, Layers, ListChecks, BookOpen, FileText, Settings, ChevronDown, ChevronUp, Box, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useLocation, Link } from "wouter";

// Remove hardcoded categories and subcategories. Use dynamic fetch.

// Helper to render nested subcategories as a tree
function SubcategoryTree({ 
  subcategories, 
  onSelect, 
  activeMain, 
  activeSub, 
  parentPath = [], 
  onSubSubHover, 
  hoveredSubSub, 
  hoveredSubSubItems 
}) {
  return (
    <ul>
      {subcategories.map((sub: any) => {
        const subName = typeof sub === 'string' ? sub : sub.name;
        const children = sub.subcategories || [];
        const path = [...parentPath, subName];
        const isActive = activeSub === path.join(' > ');
        return (
          <li key={subName}>
            <button
              className={`w-full flex items-center px-2 py-1 rounded text-xs font-medium transition-all duration-200 group ${isActive ? 'bg-maroon-600 text-white' : 'text-black hover:bg-maroon-700 hover:text-white'}`}
              onClick={() => onSelect(path)}
              onMouseEnter={() => onSubSubHover && onSubSubHover(subName, children)}
              onMouseLeave={() => onSubSubHover && onSubSubHover(null, [])}
            >
              {subName}
            </button>
            {/* Recursive rendering for nested subcategories (if not using hover popup) */}
            {children.length > 0 && !hoveredSubSub && (
              <div className="ml-4 mt-1">
                <SubcategoryTree
                  subcategories={children}
                  onSelect={onSelect}
                  activeMain={activeMain}
                  activeSub={activeSub}
                  parentPath={path}
                  onSubSubHover={onSubSubHover}
                  hoveredSubSub={hoveredSubSub}
                  hoveredSubSubItems={hoveredSubSubItems}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const { categories, loading } = useCategories();
  const [location, setLocation] = useLocation();

  const { data: products = [], isLoading, refetch } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    refetchOnWindowFocus: true,
    staleTime: 0, // Always consider data stale
  });



  const safeProducts = Array.isArray(products) ? products : [];

  // Build sidebar category structure dynamically from fetched categories
  const sidebar = categories.map(category => ({
    name: category.name,
    subcategories: category.subcategories || []
  }));
  
  // Sidebar selection logic
  const [activeMain, setActiveMain] = useState("");
  const [activeSub, setActiveSub] = useState("");
  
  // Sidebar expand/collapse state
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    // By default, all categories are collapsed
    const collapsed: Record<string, boolean> = {};
    return collapsed;
  });
  
  // Sync selected category/subcategory from URL query params
  useEffect(() => {
    function syncFromSearch() {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      const subcategoryParam = urlParams.get('subcategory');
      if (categoryParam) {
        setActiveMain(categoryParam);
        setExpanded({ [categoryParam]: true });
        setActiveSub(subcategoryParam || "");
      } else if (categories.length > 0) {
        setActiveMain(categories[0].name);
        setExpanded({ [categories[0].name]: true });
        setActiveSub("");
      }
    }

    // Initial sync
    syncFromSearch();

    // Listen to browser navigation
    const onPop = () => syncFromSearch();
    window.addEventListener('popstate', onPop);

    // Patch pushState/replaceState to emit a custom event and listen to it
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    const notify = () => window.dispatchEvent(new Event('locationchange'));
    // @ts-ignore
    history.pushState = function (...args) { const r = origPush.apply(this, args as any); notify(); return r; } as any;
    // @ts-ignore
    history.replaceState = function (...args) { const r = origReplace.apply(this, args as any); notify(); return r; } as any;
    const onLocChange = () => syncFromSearch();
    window.addEventListener('locationchange', onLocChange);

    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('locationchange', onLocChange);
      // restore originals
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, [categories]);
  const toggleExpand = (mainName: string) => {
  setExpanded({ [mainName]: true });
  };
  // New: handle tree path for subcategory selection
  const handleSubcategorySelect = (path: string[]) => {
    const subcategoryPath = path.join(' > ');
    setActiveSub(subcategoryPath);
    
    // Update URL with both category and subcategory
    const newUrl = `/products?category=${encodeURIComponent(activeMain)}&subcategory=${encodeURIComponent(subcategoryPath)}`;
    setLocation(newUrl);
    // Also ensure state is in sync immediately
    setExpanded({ [activeMain]: true });
  };
  // Filter products based on sidebar selection (tree path)
  const sidebarFilteredProducts = safeProducts.filter(product => {
    if (!activeMain) return true;
    if (activeMain && !activeSub) return product.category === activeMain;
    // For nested subcategories, match full path
    return product.category === activeMain && product.subcategory === activeSub;
  }).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sidebar icon mapping for main categories (maroon theme)
  const mainIcons = {
    "Calibration System": (isActive: boolean, isHovered: boolean) => <Gauge className={`inline-block mr-2 h-5 w-5 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Metrology Systems": (isActive: boolean, isHovered: boolean) => <Microscope className={`inline-block mr-2 h-5 w-5 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Measuring Systems": (isActive: boolean, isHovered: boolean) => <Ruler className={`inline-block mr-2 h-5 w-5 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
  };
  // Sidebar icon mapping for subcategories (maroon theme, relevant icons)
  const subIcons: Record<string, (isActive: boolean, isHovered: boolean) => JSX.Element> = {
    "Dimensional Calibration": (isActive, isHovered) => <Ruler className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Electrical Calibration": (isActive, isHovered) => <Activity className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Thermal Calibration": (isActive, isHovered) => <Thermometer className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Pressure Calibration": (isActive, isHovered) => <Gauge className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Flow Calibration": (isActive, isHovered) => <Layers className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Mass and Weight Calibration": (isActive, isHovered) => <Weight className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    // Unimetro/Metrology Systems
    "Vision Measuring System": (isActive, isHovered) => <Compass className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Pro Series Vision Measuring System": (isActive, isHovered) => <ClipboardList className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Manual Vision Measuring System": (isActive, isHovered) => <ClipboardList className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Compact CNC Vision Measuring System": (isActive, isHovered) => <Wrench className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Gantry Large-Range CNC Vision Measuring System": (isActive, isHovered) => <Wrench className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Tool Vision Measuring System": (isActive, isHovered) => <Wrench className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Coordinate Measurement Machine": (isActive, isHovered) => <Compass className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Fixture Kits": (isActive, isHovered) => <Layers className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    // Polwax/Measuring Instruments
    "Dataloggers": (isActive, isHovered) => <ClipboardList className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "Transmitters": (isActive, isHovered) => <Settings className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    "IoT Gateway": (isActive, isHovered) => <ListChecks className={`inline-block mr-2 h-4 w-4 ${isActive || isHovered ? 'text-white' : 'text-black'}`} />,
    // Fallback
  };
  function getSubIcon(sub: string, isActive: boolean, isHovered: boolean) {
    return (subIcons[sub] || ((ia, ih) => <FileText className={`inline-block mr-2 h-4 w-4 ${ia || ih ? 'text-white' : 'text-black'}`} />))(isActive, isHovered);
  }

  // For floating subcategory menu
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Add to component state:
  const [hoveredMain, setHoveredMain] = useState<string | null>(null);
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const [hoveredSubSub, setHoveredSubSub] = useState<string | null>(null);
  const [hoveredSubSubItems, setHoveredSubSubItems] = useState<any[]>([]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Products - Calibration & Testing Equipment"
        description="Browse our comprehensive range of precision calibration, testing, and measuring equipment. From vision measuring machines to coordinate measuring machines and calibration systems."
        keywords="calibration equipment, testing systems, measuring instruments, vision measuring machine, coordinate measuring machine, tool presetter, dataloggers, transmitters, IoT gateway"
        url="/products"
      />
      <div className="min-h-screen bg-gray-50">
      {/* Sidebar and Main Content in a flex row for correct sticky context */}
      <div className="flex flex-row bg-white">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className="hidden md:flex sticky top-16 w-56 z-30 flex-col bg-gradient-to-b from-maroon-900 via-maroon-800 to-maroon-900 shadow-2xl border-r border-maroon-700 max-h-[calc(100vh-64px)] overflow-hidden"
        >
          {/* Header with maroon gradient background */}
          <div className="bg-gradient-to-r from-maroon-600 via-maroon-700 to-maroon-600 p-4 border-b border-maroon-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Box className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Categories</h3>
                <p className="text-maroon-100 text-xs">Browse our products</p>
              </div>
            </div>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-maroon-600 scrollbar-track-maroon-800 hover:scrollbar-thumb-maroon-500">
            <nav className="p-4 space-y-2">
              {sidebar.map((main, index) => (
                <motion.div 
                  key={main.name} 
                  className="relative group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <button
                    onMouseEnter={() => {
                      setHoveredMain(main.name);
                      toggleExpand(main.name);
                    }}
                    onMouseLeave={() => setHoveredMain(null)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeMain === main.name 
                        ? 'bg-gradient-to-r from-maroon-500 to-maroon-600 text-white shadow-lg shadow-maroon-500/25' 
                        : 'text-maroon-200 hover:text-maroon-100 hover:bg-maroon-700/50'
                    }`}
                    onClick={() => {
                      setActiveMain(main.name);
                      setActiveSub("");
                      toggleExpand(main.name);
                      const newUrl = `/products?category=${encodeURIComponent(main.name)}`;
                      setLocation(newUrl);
                    }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                      activeMain === main.name 
                        ? 'bg-white/20 text-white' 
                        : 'bg-maroon-700/50 text-maroon-300 group-hover:bg-maroon-600/50 group-hover:text-maroon-100'
                    }`}>
                      {(mainIcons[main.name as keyof typeof mainIcons] || (() => <Gauge className="h-4 w-4" />))(true, true)}
                    </div>
                    <span className="flex-1 text-left">{main.name}</span>
                    {main.subcategories && main.subcategories.length > 0 && (
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                        activeMain === main.name ? 'rotate-180' : 'group-hover:rotate-90'
                      }`} />
                    )}
                  </button>

                  {/* Subcategories with improved styling */}
                  {main.subcategories && main.subcategories.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: activeMain === main.name ? 'auto' : 0, 
                        opacity: activeMain === main.name ? 1 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 ml-4 space-y-1">
                        <SubcategoryTree
                          subcategories={main.subcategories}
                          onSelect={handleSubcategorySelect}
                          activeMain={activeMain}
                          activeSub={activeSub}
                          onSubSubHover={(subcategory, items) => {
                            setHoveredSubSub(subcategory);
                            setHoveredSubSubItems(items);
                          }}
                          hoveredSubSub={hoveredSubSub}
                          hoveredSubSubItems={hoveredSubSubItems}
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-maroon-700 bg-maroon-800/50">
            <div className="text-center">
              <p className="text-maroon-300 text-xs">Total Categories: {sidebar.length}</p>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 md:ml-6 lg:ml-8 bg-white min-h-screen relative z-10">
          <main className="p-0 pt-0 mt-0">

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-2 w-full">
          <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-sm border-gray-300 rounded w-full"
              />
            </div>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="px-4 py-2 h-8 text-sm"
            >
              Refresh
            </Button>
          </div>
        </div>
        {/* Results Summary */}
            <div className="mb-8">
          <p className="text-gray-600">
                Showing {sidebarFilteredProducts.length} product{sidebarFilteredProducts.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
                {activeMain && ` in ${activeMain}`}
                {activeSub && ` > ${activeSub}`}
              </p>
            </div>
            {/* Product Cards */}
            {sidebarFilteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sidebarFilteredProducts.map((product: Product, index: number) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
            ))}
          </div>
        ) : (
              <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse different categories
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                    setActiveMain(sidebar[0]?.name || "");
                    setActiveSub("");
              }}
              className="bg-[#800000] text-white hover:bg-[#6b0000]"
            >
              Clear Filters
            </Button>
              </div>
        )}
          </main>
        </div>
      </div>
    </div>
    </>
  );
}
