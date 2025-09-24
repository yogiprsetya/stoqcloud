import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <Link href="/" className="flex items-center space-x-3 group">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        <span className="text-xl font-semibold accent-text">FormyGlow</span>
      </Link>
    </div>
  );
};
