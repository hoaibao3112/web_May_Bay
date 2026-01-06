'use client';

import { useState, useEffect, useRef } from 'react';

interface City {
  id: number;
  name: string;
  code: string;
}

interface BusStation {
  id: number;
  tenBenXe: string;
  thanhPho: string;
  diaChi?: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Nhập thành phố",
  className = ""
}: LocationAutocompleteProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [popularCities, setPopularCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Tải danh sách thành phố Việt Nam khi component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch('http://localhost:5000/catalog/thanh-pho-vn');
        if (res.ok) {
          const data = await res.json();
          setCities(data);
        }
      } catch (error) {
        console.error('Lỗi tải danh sách thành phố:', error);
      }
    };
    
    const fetchPopularCities = async () => {
      try {
        // Lấy danh sách các thành phố có bến xe
        const res = await fetch('http://localhost:5000/bus-stations');
        if (res.ok) {
          const stations: BusStation[] = await res.json();
          // Lấy các thành phố duy nhất và phổ biến
          const citiesSet = new Set(stations.map(s => s.thanhPho));
          const popular = Array.from(citiesSet)
            .filter(city => city) // Loại bỏ null/undefined
            .slice(0, 8); // Top 8 thành phố
          setPopularCities(popular);
        }
      } catch (error) {
        console.error('Lỗi tải thành phố phổ biến:', error);
        // Fallback với các thành phố phổ biến
        setPopularCities([
          'Hồ Chí Minh', 
          'Hà Nội', 
          'Đà Nẵng', 
          'Nha Trang',
          'Đà Lạt',
          'Cần Thơ',
          'Vũng Tàu',
          'Huế'
        ]);
      }
    };
    
    fetchCities();
    fetchPopularCities();
  }, []);

  // Lọc thành phố khi người dùng nhập
  useEffect(() => {
    if (!value || value.length === 0) {
      setFilteredCities([]);
      return;
    }

    const searchTerm = value.toLowerCase().trim();
    
    // Loại bỏ dấu tiếng Việt để tìm kiếm tốt hơn
    const removeDiacritics = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const filtered = cities.filter(city => {
      const cityName = city.name.toLowerCase();
      const cityNameNoDiacritics = removeDiacritics(cityName);
      const searchNoDiacritics = removeDiacritics(searchTerm);
      
      return cityName.includes(searchTerm) || 
             cityNameNoDiacritics.includes(searchNoDiacritics) ||
             city.code.toLowerCase().includes(searchTerm);
    });

    setFilteredCities(filtered.slice(0, 10)); // Giới hạn 10 gợi ý
  }, [value, cities]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSelectCity = (cityName: string) => {
    onChange(cityName);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    // Hiển thị gợi ý khi focus
    setShowSuggestions(true);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${className}`}
        placeholder={placeholder}
        autoComplete="off"
      />
      
      {/* Dropdown Suggestions */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Nếu đang gõ và có kết quả tìm kiếm */}
          {value && filteredCities.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                KẾT QUẢ TÌM KIẾM
              </div>
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelectCity(city.name)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📍</span>
                      <div>
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-xs text-gray-500">Việt Nam</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono uppercase">{city.code}</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Nếu đang gõ nhưng không có kết quả */}
          {value && filteredCities.length === 0 && (
            <div className="p-4">
              <p className="text-gray-500 text-center text-sm">
                ❌ Không tìm thấy thành phố "{value}"
              </p>
              <p className="text-gray-400 text-center text-xs mt-1">
                Vui lòng thử từ khóa khác
              </p>
            </div>
          )}

          {/* Nếu chưa gõ gì - hiển thị các thành phố phổ biến */}
          {!value && popularCities.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b flex items-center gap-2">
                <span>⭐</span>
                <span>ĐIỂM ĐẾN PHỔ BIẾN</span>
              </div>
              {popularCities.map((cityName, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectCity(cityName)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🚌</span>
                    <div>
                      <div className="font-medium text-gray-900">{cityName}</div>
                      <div className="text-xs text-gray-500">Nhiều tuyến xe khách</div>
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
