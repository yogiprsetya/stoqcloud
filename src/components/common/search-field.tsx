import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { FC } from 'react';
import { cn } from '~/utils/css';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

export const SearchField: FC<SearchFieldProps> = ({ value, onChange, placeholder, className }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />

    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn('pl-10 w-80', className)}
    />
  </div>
);
