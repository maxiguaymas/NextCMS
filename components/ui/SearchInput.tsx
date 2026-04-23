'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchInputProps {
  placeholder?: string;
  minChars?: number;
  debounceMs?: number;
}

export default function SearchInput({
  placeholder = "Buscar...",
  minChars = 2,
  debounceMs = 300,
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get("q") || "";
  const [value, setValue] = useState(initialQuery);
  
  // Ref para el timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Función de búsqueda con debounce integrado
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setValue(searchValue);
    
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Nuevo timeout para debounce
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchValue.trim().length >= minChars) {
        params.set("q", searchValue.trim());
      } else if (searchValue.trim().length === 0) {
        params.delete("q");
      }
      
      // Resetear a página 1 cuando se busca
      params.set("page", "1");
      
      // Construir la nueva URL
      const newUrl = `/posts?${params.toString()}`;
      router.push(newUrl);
    }, debounceMs);
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setValue("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.set("page", "1");
    router.push(`/posts?${params.toString()}`);
  };

  // Cleanup al unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <label className="flex flex-col min-w-40 h-14 w-full group">
      <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
        <div className="text-[#5f7a8c] flex border-none bg-white dark:bg-white/5 items-center justify-center pl-4 rounded-r-xl border-r-0">
          <span className="material-symbols-outlined">search</span>
        </div>
        <input 
          value={value}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#068ce5]/50 border-none bg-white dark:bg-white/5 focus:border-none h-full placeholder:text-[#5f7a8c] px-4 rounded-l-none border-l-0 text-base font-normal leading-normal transition-all" 
          placeholder={placeholder} 
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center pr-4 text-[#5f7a8c] hover:text-[#068ce5] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>
    </label>
  );
}