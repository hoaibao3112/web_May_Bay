'use client';

import { useState, useEffect, useRef } from 'react';

interface Airport {
    id: number;
    maSanBay: string;
    tenSanBay: string;
    thanhPho: string;
}

interface AirportAutocompleteProps {
    value: string;
    onChange: (value: string, airportId?: number, city?: string) => void;
    placeholder?: string;
    className?: string;
}

export default function AirportAutocomplete({
    value,
    onChange,
    placeholder = "Nhập tên sân bay hoặc thành phố",
    className = ""
}: AirportAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<Airport[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/airport-transfer-search/suggestions?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data);
            }
        } catch (error) {
            console.error('Error fetching airport suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setShowSuggestions(true);
        fetchSuggestions(newValue);
    };

    const handleSelectAirport = (airport: Airport) => {
        onChange(airport.tenSanBay, airport.id, airport.thanhPho);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onFocus={() => value.length >= 2 && setShowSuggestions(true)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${className}`}
                placeholder={placeholder}
                autoComplete="off"
            />

            {showSuggestions && (suggestions.length > 0 || isLoading) && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500 text-sm">Đang tìm kiếm...</div>
                    ) : (
                        suggestions.map((airport) => (
                            <button
                                key={airport.id}
                                onClick={() => handleSelectAirport(airport)}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">✈️</span>
                                        <div>
                                            <div className="font-bold text-gray-900">{airport.tenSanBay}</div>
                                            <div className="text-xs text-gray-500">{airport.thanhPho}, Việt Nam</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono uppercase font-bold">{airport.maSanBay}</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
