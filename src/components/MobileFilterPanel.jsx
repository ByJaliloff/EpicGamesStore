import { useState, useContext, useEffect } from "react";
import { GameContext } from "../context/DataContext";
import { FiX, FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";

const extractUniqueValues = (games, key) => {
  const values = games.flatMap((game) =>
    Array.isArray(game[key]) ? game[key] : []
  );
  return [...new Set(values)];
};

const extractSingleValues = (games, key) => {
  const values = games
    .map((game) => game[key])
    .filter((val) => val !== undefined && val !== null && val !== "");
  return [...new Set(values)];
};

export default function MobileFilterPanel({ 
  filters, 
  onFilterChange, 
  searchQuery, 
  onSearchChange, 
  onClose, 
  onApply,
  onClear 
}) {
  const { games, dlcs } = useContext(GameContext);
  const allItems = [...games, ...dlcs];

  const typeMapping = {
    basedgame: "Base Game",
    editor: "Editor",
    demo: "Demo",
    edition: "Edition",
    addon: "Addon",
  };

  const [localFilters, setLocalFilters] = useState(filters);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [openSections, setOpenSections] = useState({});

  const sections = [
    { title: "Genre", key: "genre", values: extractUniqueValues(allItems, "genre") },
    { title: "Features", key: "features", values: extractUniqueValues(allItems, "features") },
    { title: "Types", key: "type", values: extractSingleValues(allItems, "type") },
    { title: "Platform", key: "platforms", values: extractUniqueValues(allItems, "platforms") },
  ];

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleValue = (key, value) => {
    setLocalFilters((prev) => {
      const current = prev[key];
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: newValues };
    });
  };

  const handlePriceChange = (price) => {
    setLocalFilters((prev) => ({
      ...prev,
      price: prev.price === price ? null : price,
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onSearchChange(localSearchQuery);
    onApply();
  };

  const handleClear = () => {
    const clearedFilters = {
      genre: [],
      features: [],
      type: [],
      platforms: [],
      price: null,
    };
    setLocalFilters(clearedFilters);
    setLocalSearchQuery("");
    onFilterChange(clearedFilters);
    onSearchChange("");
    onClear();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(localFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) count += value.length;
      else if (value !== null) count += 1;
    });
    if (localSearchQuery?.trim()) count += 1;
    return count;
  };

  return (
    <div className="fixed inset-0 z-65 bg-[#18181C] flex flex-col">
      <div className="flex items-center justify-between p-[48px_44px_16px_44px]">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1">
            <FiX className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-lg font-semibold text-white">
            Filters ({getActiveFilterCount()})
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={localSearchQuery || ""}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder="Keywords"
              className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] text-white rounded-lg focus:outline-none border-0"
            />
          </div>
        </div>

        <div className="border-b border-gray-700">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between p-[30px_44px] text-left"
          >
            <span className="text-white font-medium text-sm tracking-wider">Price</span>
            {openSections.price ? (
              <FiChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {openSections.price && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {["Free", "Under $5", "Under $10", "Under $20", "Under $50"].map((label) => (
                  <button
                    key={label}
                    onClick={() => handlePriceChange(label)}
                    className={`w-full p-[12px_28px] text-left rounded transition-colors text-sm tracking-wider font-semibold ${
                      localFilters.price === label
                        ? "bg-[#26BBFF] text-black"
                        : "text-gray-300 hover:bg-[#2a2a2a]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {sections.map(({ title, key, values }) => (
          <div key={title} className="border-b border-gray-700">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between p-[30px_44px] text-left"
            >
              <span className="text-white font-medium text-sm tracking-wider">{title}</span>
              {openSections[key] ? (
                <FiChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {openSections[key] && (
              <div className="px-4 pb-4">
                <div className="space-y-2">
                  {values.map((val) => (
                    <button
                      key={val}
                      onClick={() => toggleValue(key, val)}
                      className={`w-full p-[12px_28px] text-left rounded transition-colors text-sm tracking-wider font-semibold ${
                        localFilters[key].includes(val)
                          ? "bg-[#26BBFF] text-black"
                          : "text-gray-300 hover:bg-[#2a2a2a]"
                      }`}
                    >
                      {key === "type" ? (typeMapping[val] || val) : val}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 pt-10">
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 py-3 px-4 bg-transparent border border-gray-700 text-white rounded font-medium"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 px-4 bg-[#26BBFF] text-black rounded font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}