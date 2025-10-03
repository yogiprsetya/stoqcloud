import React, { useState, useCallback } from 'react';
import { useDebounce } from './use-debounce';

interface UseComboboxSearchOptions {
  onSearch: (keyword: string) => void;
  debounceMs?: number;
  initialKeyword?: string;
}

/**
 * Custom hook untuk menangani search di Combobox dengan debouncing
 * @param options - Konfigurasi untuk search
 * @returns Object dengan search state dan handlers
 */
export function useComboboxSearch({
  onSearch,
  debounceMs = 300,
  initialKeyword = ''
}: UseComboboxSearchOptions) {
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
  const debouncedKeyword = useDebounce(searchKeyword, debounceMs);

  // Trigger search ketika debounced keyword berubah
  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  // Reset search
  const resetSearch = useCallback(() => {
    setSearchKeyword('');
  }, []);

  // Effect untuk trigger onSearch ketika debounced keyword berubah
  React.useEffect(() => {
    onSearch(debouncedKeyword);
  }, [debouncedKeyword, onSearch]);

  return {
    searchKeyword,
    debouncedKeyword,
    handleSearch,
    resetSearch
  };
}
