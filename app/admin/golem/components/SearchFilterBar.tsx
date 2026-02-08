'use client';

import { Search } from 'lucide-react';

type FilterOption = {
  value: string | number;
  label: string;
};

type FilterConfig = {
  value: string | number;
  onChange: (value: string) => void;
  options: FilterOption[];
};

type SearchFilterBarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: FilterConfig[];
  placeholder?: string;
};

export function SearchFilterBar({ searchQuery, onSearchChange, filters, placeholder = 'Search...' }: SearchFilterBarProps) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
        />
      </div>
      {filters.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
          aria-label={`Filter ${index + 1}`}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ))}
    </div>
  );
}
