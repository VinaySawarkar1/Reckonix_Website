import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function IconCard({ icon: Icon, title, description }: IconCardProps) {
  return (
    <motion.div 
      className="text-center group"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="bg-maroon-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-maroon-600 transition-all"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="h-8 w-8 text-white" />
      </motion.div>
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
