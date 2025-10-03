import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { ComponentProps, FC } from 'react';
import { cn } from '~/utils/css';

type SearchFieldProps = Omit<ComponentProps<'input'>, 'onChange'> & {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
};

export const SearchField: FC<SearchFieldProps> = ({ className, onChange, ...props }) => (
  <div className={cn('relative', className)}>
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
    <Input {...props} onChange={(e) => onChange?.(e.target.value)} className="pl-10 w-full" />
  </div>
);
