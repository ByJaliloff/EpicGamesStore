import { FiSearch, FiChevronDown } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { GameContext } from "../context/DataContext";
import { IoClose } from "react-icons/io5";

export default function SearchNav() {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { games, dlcs, user } = useContext(GameContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (query.trim()) {
        navigate(`/browse?q=${encodeURIComponent(query)}`);
        setShowDropdown(false);
      }
    }
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch((prev) => !prev);
    setQuery("");
  };

  const highlightText = (text, searchQuery) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <span key={index} className="text-[#26BBFF] font-bold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    if (query.trim().length > 0) {
      const allItems = [
        ...games.map((item) => ({ ...item, type: "game" })),
        ...dlcs
      ];
      const filtered = allItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(filtered.slice(0, 4)); 
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [query, games, dlcs]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <div className="bg-[#0f0f10] sticky top-0 h-[80px] md:h-[100px] z-50">
      <div className="py-4 flex items-center h-full justify-between max-w-[90%] sm:max-w-[90%] md:max-w-[88%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto relative">
        <div className="flex items-center gap-6 relative flex-grow">
          <div className="hidden md:flex items-center bg-[#202024] hover:bg-[#404044] px-4 py-2 rounded-full text-sm text-white w-full max-w-[250px] relative z-50">
            <FiSearch
              onClick={handleSearch}
              className="mr-2 text-gray-400 cursor-pointer"
            />
            <input
              type="text"
              placeholder="Search store"
              className="bg-transparent outline-none placeholder-gray-400 text-white w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <div className={`md:hidden flex items-center z-50 ${showMobileSearch ? 'hidden' : 'block'}`}>
            <FiSearch
              className="text-white text-xl cursor-pointer transition-transform duration-200 active:scale-95"
              onClick={toggleMobileSearch}
            />
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link
              to="/"
              className={`transition ${
                location.pathname === "/"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Discover
            </Link>

            <Link
              to="/browse"
              className={`transition ${
                location.pathname === "/browse"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Browse
            </Link>

            <Link
              to="/news"
              className={`transition ${
                location.pathname === "/news"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              News
            </Link>
          </div>

          {showDropdown && !showMobileSearch && (
            <div
              ref={dropdownRef}
              className="hidden md:block absolute top-[50px] left-5 w-[600px] overflow-hidden animate-slideDown"
              style={{
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(32, 32, 36, 0.7)',
                backdropFilter: 'blur(75px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div className="px-4 pt-4 pb-1 text-[12px] text-gray-300 font-bold uppercase">
                Top Results
              </div>

              {filteredResults.length === 0 ? (
                <div className="text-gray-400 text-sm p-4">No results found</div>
              ) : (
                filteredResults.map((item, index) => (
                  <Link
                    to={`/details/${item.id}`}
                    key={item.id}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-start gap-3 px-4 p-3 hover:bg-[#4E4548] transition-all duration-200 text-white active:bg-[#5E5558]"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-11 h-14 rounded object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-[#ffffffa6] font-semibold mb-[2px] tracking-wider">
                        {item.type === "addon"
                          ? "Add-On"
                          : item.type === "edition"
                          ? "Edition"
                          : item.type === "demo"
                          ? "Demo"
                          : item.type === "editor"
                          ? "Editor"
                          : "Base Game"}
                      </span>
                      <span className="font-bold text-sm leading-tight text-[#ffffff] tracking-wider">
                        {highlightText(item.title, query)}
                      </span>
                    </div>
                  </Link>
                ))
              )}

              <button
                className="w-full text-left text-gray-300 font-semibold text-sm px-4 py-2 pb-4 cursor-pointer hover:bg-[#4E4548] transition-all duration-200 active:bg-[#5E5558]"
                onClick={() => {
                  navigate(`/browse?q=${encodeURIComponent(query)}`);
                  setShowDropdown(false);
                }}
              >
                View results →
              </button>
            </div>
          )}
        </div>

        {showMobileSearch && (
          <>
            <div className="absolute top-0 left-0 w-full bg-[#18181C] h-[80px] px-4 py-3 flex items-center z-[60] animate-slideDown">
              <FiSearch className="mr-2 text-white text-xl" />
              <input
                type="text"
                placeholder="Search store"
                className="bg-transparent outline-none placeholder-gray-400 text-white w-full text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
              />
              <IoClose
                className="ml-2 text-white text-2xl cursor-pointer transition-transform duration-200 active:scale-95"
                onClick={toggleMobileSearch}
              />
            </div>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-[80px] left-0 right-0 mx-4 z-[59] overflow-hidden animate-slideDown"
                style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(32, 32, 36, 0.7)',
                  backdropFilter: 'blur(75px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div className="px-4 pt-4 pb-1 text-[12px] text-gray-300 font-bold uppercase">
                  Top Results
                </div>

                {filteredResults.length === 0 ? (
                  <div className="text-gray-400 text-sm p-4">No results found</div>
                ) : (
                  filteredResults.map((item, index) => (
                    <Link
                      to={`/details/${item.id}`}
                      key={item.id}
                      onClick={() => {
                        setShowDropdown(false);
                        setShowMobileSearch(false);
                      }}
                      className="flex items-start gap-3 px-4 p-3 hover:bg-[#4E4548] transition-all duration-200 text-white active:bg-[#5E5558]"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-9 h-12 rounded object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-[#ffffffa6] font-semibold mb-[2px]">
                          {item.type === "addon"
                            ? "Add-On"
                            : item.type === "edition"
                            ? "Edition"
                            : item.type === "demo"
                            ? "Demo"
                            : item.type === "editor"
                            ? "Editor"
                            : "Base Game"}
                        </span>
                        <span className="font-bold text-sm leading-tight text-[#ffffff]">
                          {highlightText(item.title, query)}
                        </span>
                      </div>
                    </Link>
                  ))
                )}

                <button
                  className="w-full text-left text-gray-300 font-semibold text-sm px-4 py-2 pb-4 cursor-pointer hover:bg-[#4E4548] transition-all duration-200 active:bg-[#5E5558]"
                  onClick={() => {
                    navigate(`/browse?q=${encodeURIComponent(query)}`);
                    setShowDropdown(false);
                    setShowMobileSearch(false);
                  }}
                >
                  View results →
                </button>
              </div>
            )}
          </>
        )}

        <div className={`flex md:hidden items-center justify-center absolute left-1/2 transform -translate-x-1/2 ${showMobileSearch ? 'hidden' : 'block'}`}>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-white hover:text-gray-300 transition-all duration-200 text-sm font-medium active:scale-95"
            >
              {location.pathname === "/" ? "Discover" : 
               location.pathname === "/browse" ? "Browse" : 
               location.pathname === "/news" ? "News" : "Discover"}
              <FiChevronDown
                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-7 w-screen px-4 z-50 animate-slideDown">
                <div className="bg-[#0F0F10] rounded-none shadow-lg p-[27px_32px] w-full flex flex-col items-center">
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={`block w-full font-medium text-gray-400 px-4 py-3 text-sm border-b border-[#333] text-left transition-all duration-200 active:bg-[#202024] ${
                      location.pathname === "/" ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Discover
                  </Link>
                  <Link
                    to="/browse"
                    onClick={() => setIsOpen(false)}
                    className={`block w-full font-medium text-gray-400 px-4 py-3 text-sm border-b border-[#333] text-left transition-all duration-200 active:bg-[#202024] ${
                      location.pathname === "/browse" ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Browse
                  </Link>
                  <Link
                    to="/news"
                    onClick={() => setIsOpen(false)}
                    className={`block w-full font-medium text-gray-400 px-4 py-3 text-sm text-left transition-all duration-200 active:bg-[#202024] ${
                      location.pathname === "/news" ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    News
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center text-sm space-x-4 font-medium">
          <Link
            to="/wishlist"
            className="text-gray-400 hover:text-white transition"
          >
            Wishlist
          </Link>

          <Link to="/basket" className="text-gray-400 hover:text-white transition">
            Cart
          </Link>
        </div>

        <div className={`flex md:hidden items-center space-x-4 text-xl text-gray-400 ${showMobileSearch ? 'hidden' : 'flex'}`}>
          <Link
            to="/wishlist" 
            className="hover:text-white transition-all duration-200 active:scale-95"
          >
            <FaRegCheckCircle />
          </Link>

          <Link 
            to="/basket" 
            className="hover:text-white transition-all duration-200 active:scale-95"
          >
            <IoCartOutline />
          </Link>
        </div>
      </div>

        <style>
          {`
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .animate-slideDown {
              animation: slideDown 0.3s ease-out forwards;
            }
          `}
        </style>
    </div>
  );
}