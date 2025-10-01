'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '~/utils/css';
import { forwardRef } from 'react';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  dateFormat?: string;
  className?: string;
  disabled?: boolean;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    { value, onChange, placeholder = 'Select date', dateFormat = 'PPP', className, disabled = false },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (date: Date | undefined) => {
      onChange?.(date);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            data-empty={!value}
            disabled={disabled}
            className={cn(
              'data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal',
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, dateFormat) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = 'DatePicker';
