'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/atoms/Input';
import { cn } from '@/shared/lib/utils';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearchChange?: (value: string) => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onSearchChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onSearchChange?.(e.target.value);
    };

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          className={cn('pl-9', className)}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

