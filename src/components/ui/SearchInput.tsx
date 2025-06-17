import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

const SearchInput = ({ onSearch, placeholder = 'Search...', initialValue = '', className = '' }: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch]);

  return (
    <div className={`relative rounded-md shadow-sm ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-input pl-10 py-2"
        placeholder={placeholder}
      />
      {searchTerm && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => {
            setSearchTerm('');
            onSearch('');
          }}
        >
          <span className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Clear search</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

export default SearchInput;