import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product & { images?: { url: string }[] };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    toast({
      title: "Added to Quote",
      description: `${product.name} has been added to your quote request.`,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Calibration Systems":
        return "bg-maroon-100 text-maroon-600";
      case "Metrology Systems":
        return "bg-blue-100 text-blue-600";
      case "Measuring Instruments":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all h-full w-64 min-w-[220px] max-w-xs">
        <Link href={`/products/${product.id}`}>
          <div className="relative">
            {/** Use first image from images array if available, else fallback */}
            <img 
              src={
                product.images && product.images.length > 0
                  ? product.images[0].url
                  : (product.imageUrl || "/default-placeholder.jpg")
              }
              alt={product.name}
              className="w-full h-48 object-contain bg-white"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </Link>
        
        <CardContent className="p-3 flex flex-col h-full">
          <div className="mb-2 flex flex-row items-center gap-1.5">
            <Badge className={getCategoryColor(product.category) + " rounded-full font-bold text-[10px] px-2 py-1"}>
              {product.category.replace(" Systems", "").replace(" Instruments", "")}
            </Badge>
            <Badge className="bg-green-100 text-green-700 rounded-full font-bold text-[10px] px-2 py-1">
              {product.subcategory}
            </Badge>
          </div>
          
          <Link href={`/products/${product.id}`} className="flex-1">
            <h4 className="font-semibold text-base text-gray-900 mb-1 hover:text-maroon-500 transition-colors line-clamp-2">
              {product.name}
            </h4>
            <p className="text-gray-600 text-xs mb-3 line-clamp-3 leading-snug">
              {product.shortDescription}
            </p>
          </Link>
          
          <div className="flex justify-between items-center mt-auto pt-3 border-t">
            <Link 
              href={`/products/${product.id}`}
              className="text-[#800000] hover:text-[#6b0000] font-medium text-xs transition-colors"
            >
              View Details
            </Link>
            <Button 
              onClick={handleAddToCart}
              size="sm"
              className="bg-[#800000] text-white hover:bg-[#6b0000] transition-all px-2 py-1 text-xs"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
