'use client';

import { useState, forwardRef } from 'react';
import { CheckIcon, ChevronsUpDownIcon, AlertCircle } from 'lucide-react';

import { cn } from '~/utils/css';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { FormControl } from './form';
import { Slot } from '@radix-ui/react-slot';

type Option = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  mode?: 'form' | 'standalone';
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
  disabled?: boolean;
};

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      className,
      mode = 'form',
      onSearch,
      isLoading = false,
      error,
      emptyMessage = 'No options found.',
      disabled = false
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    const TriggerWrapper = mode === 'form' ? FormControl : Slot;

    return (
      <Popover
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          if (!open && onSearch) {
            onSearch('');
          }
        }}
      >
        <PopoverTrigger asChild>
          <TriggerWrapper ref={ref}>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={disabled || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  Loading...
                </span>
              ) : value ? (
                options.find((opt) => opt.value === value)?.label || 'Select option...'
              ) : (
                placeholder || 'Select option...'
              )}
              <ChevronsUpDownIcon className="shrink-0 opacity-50" />
            </Button>
          </TriggerWrapper>
        </PopoverTrigger>

        <PopoverContent className={cn('p-0', className)}>
          <Command>
            <CommandInput
              placeholder={placeholder || 'Search...'}
              onValueChange={onSearch}
              disabled={isLoading}
            />

            <CommandList>
              {error ? (
                <div className="py-6 text-center text-sm text-red-500">
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="size-4" />
                    {error}
                  </div>
                </div>
              ) : isLoading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    Loading options...
                  </div>
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.value}
                        onSelect={(currentValue) => {
                          onChange(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn('mr-2 size-4', value === opt.value ? 'opacity-100' : 'opacity-0')}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

Combobox.displayName = 'Combobox';
