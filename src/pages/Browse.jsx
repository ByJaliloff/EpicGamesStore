import { useContext, useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GameContext } from "../context/DataContext";
import GameCard from "../components/GameCard";
import FilterPanel from "../components/FilterPanel";
import MobileFilterPanel from "../components/MobileFilterPanel"; 
import SearchNav from "../components/SearchNav";
import Loader from "../components/Loader";

export default function Browse() {
  const { games, dlcs } = useContext(GameContext);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [shouldHideHighlight, setShouldHideHighlight] = useState(false);

  const queryParam = (new URLSearchParams(location.search).get("q") || "").toLowerCase();
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [filters, setFilters] = useState({
    genre: [],
    features: [],
    type: [],
    platforms: [],
    price: null,
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const combined = useMemo(() => [...games, ...dlcs], [games, dlcs]);

  const popularTags = useMemo(() => {
    const tagsMap = {};
    
    const baseGames = games.filter((game) => {
      const type = game.type?.toLowerCase() || '';
      return !['dlc', 'edition', 'addon'].includes(type);
    });

    baseGames.forEach((game) => {
      const genres = Array.isArray(game.genre) ? game.genre : [];
      genres.forEach((tag) => {
        if (!tagsMap[tag]) tagsMap[tag] = 0;
        tagsMap[tag]++;
      });
    });
    
    return Object.keys(tagsMap).filter((tag) => tagsMap[tag] >= 3);
  }, [games]); 

  const [highlightStart, setHighlightStart] = useState(0);
  const cardsPerPage = 4;

  const handleSlide = (direction) => {
    const max = popularTags.length - cardsPerPage;
    const next = highlightStart + direction * cardsPerPage;
    setHighlightStart(Math.max(0, Math.min(next, max)));
  };

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileFilterOpen]);

  useEffect(() => {
    const newQuery = (new URLSearchParams(location.search).get("q") || "").toLowerCase();
    setSearchQuery(newQuery);
  }, [location.search]);

  useEffect(() => {
    if (location.state?.highlight) {
      const { type, label } = location.state.highlight;
      setFilters({
        genre: type === "genre" ? [label] : [],
        features: type === "features" ? [label] : [],
        type: [],
        platforms: [],
        price: null,
      });
      setSearchQuery("");
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);


const filtered = useMemo(() => {
  return combined.filter((item) => {
    const title = item.title?.toLowerCase() || "";
    const matchesQuery = searchQuery === "" || title.includes(searchQuery.toLowerCase());

    const matchesGenre =
      filters.genre.length === 0 ||
      (Array.isArray(item.genre) && filters.genre.some((g) => item.genre.includes(g)));

    const matchesFeatures =
      filters.features.length === 0 ||
      (Array.isArray(item.features) && filters.features.some((f) => item.features.includes(f)));

    const matchesType =
      filters.type.length === 0 ||
      (typeof item.type === "string" && filters.type.includes(item.type));

    const matchesPlatforms =
      filters.platforms.length === 0 ||
      (Array.isArray(item.platforms) &&
        filters.platforms.some((p) => item.platforms.includes(p)));

    let originalPrice = 0;
    if (typeof item.price === "number") {
      originalPrice = item.price;
    } else if (typeof item.price === "string") {
      const cleaned = item.price.replace(/[^0-9.]/g, "");
      originalPrice = parseFloat(cleaned);
      if (isNaN(originalPrice)) originalPrice = 0;
    }

    let effectivePrice = originalPrice;
    if (item.discount && item.discount > 0) {
      effectivePrice = originalPrice * (1 - item.discount / 100);
    }

    let matchesPrice = true;
    if (filters.price === "Free") matchesPrice = effectivePrice === 0;
    else if (filters.price === "Under $5") matchesPrice = effectivePrice > 0 && effectivePrice < 5;
    else if (filters.price === "Under $10") matchesPrice = effectivePrice > 0 && effectivePrice < 10;
    else if (filters.price === "Under $20") matchesPrice = effectivePrice > 0 && effectivePrice < 20;
    else if (filters.price === "Under $50") matchesPrice = effectivePrice > 0 && effectivePrice < 50;

    return (
      matchesQuery &&
      matchesGenre &&
      matchesFeatures &&
      matchesType &&
      matchesPlatforms &&
      matchesPrice
    );
  });
}, [combined, searchQuery, filters]);

  const gamesPerPage = 20;
  const totalPages = Math.ceil(filtered.length / gamesPerPage);
  const currentGames = filtered.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

    useEffect(() => {

    if (games.length > 0 || dlcs.length > 0) {
      setLoading(false);
    }
  }, [games, dlcs]);
  
  const recommended = games.slice(0, 5);

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) count += value.length;
      else if (value !== null) count += 1;
    });
    if (searchQuery?.trim()) count += 1;
    return count;
  };

  if (loading) return  <Loader />

  return (
    <>
      <SearchNav />
      <div className="bg-[#0f0f10] min-h-screen text-white py-6">
        {!shouldHideHighlight && (
          <div className="w-[95%] md:w-[95%] lg:w-[93%] xl:w-[90%] 2xl:w-[82%] mx-auto px-[3.5%] py-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[32px] font-extrabold">Popular Genres</h2>
              <div className="flex gap-2">
                <button onClick={() => handleSlide(-1)} disabled={highlightStart === 0} className="disabled:opacity-40">
                  <img src="/icons/arrow-left.png" alt="Left" className="w-6 h-6" />
                </button>
                <button onClick={() => handleSlide(1)} disabled={highlightStart + cardsPerPage >= popularTags.length} className="disabled:opacity-40">
                  <img src="/icons/arrow-right.png" alt="Right" className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide mb-10 px-1">
              {popularTags.slice(highlightStart, highlightStart + cardsPerPage).map((label) => {
                const relatedGames = Array.from(
                  new Map(
                    games 
                      .filter((g) => {
                        const type = g.type?.toLowerCase() || '';
                        const isBaseGame = !['dlc', 'edition', 'addon'].includes(type);
                        const hasGenre = Array.isArray(g.genre) && g.genre.includes(label);
                        return isBaseGame && hasGenre;
                      })
                      .map((g) => [g.id, g])
                  ).values()
                ).slice(0, 3);

                return (
                  <div
                    key={label}
                    onClick={() => {
                      setFilters({
                        genre: [label], 
                        features: [],
                        type: [],
                        platforms: [],
                        price: null,
                      });
                      setShouldHideHighlight(true);
                    }}
                    className="min-w-[260px] max-w-[300px] flex-shrink-0 cursor-pointer bg-[#1e1e1e] h-[230px] hover:bg-[#2a2a2a] transition p-4 rounded-xl shadow-md flex flex-col justify-between"
                  >
                    <div className="relative h-[144px] mb-4 flex items-center justify-center">
                      <img src={relatedGames[0]?.image} alt={relatedGames[0]?.title} className="h-[120px] w-[40%] object-cover rounded absolute left-[10%] top-1/2 -translate-y-1/2 brightness-50 shadow-lg z-0" />
                      <img src={relatedGames[1]?.image} alt={relatedGames[1]?.title} className="h-[120px] w-[40%] object-cover rounded absolute right-[10%] top-1/2 -translate-y-1/2 brightness-50 shadow-lg z-0" />
                      <img src={relatedGames[2]?.image} alt={relatedGames[2]?.title} className="h-[144px] w-[50%] object-cover rounded shadow-2xl z-10 relative" />
                    </div>
                    <div className="flex items-center justify-center mb-2 pt-2">
                      <h3 className="text-base font-semibold">{label} Games</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="max-w-[90%] sm:max-w-[90%] md:max-w-[88%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto">
          <div className="sm:hidden flex justify-end mb-4">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="relative bg-[#1e1e1e] text-white px-4 py-2 rounded-lg shadow border border-white/10 flex items-center gap-2"
                >
                  <span className="font-bold">Filters</span>

                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M2.25 5A.75.75 0 0 1 3 4.25h18a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 5m4 7a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75m4 7a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    />
                  </svg>

                  {getActiveFilterCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#26BBFF] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </button>
          </div>
          <div className="flex gap-8 pb-20">
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  <h3 className="text-[50px] font-semibold text-center">No results found</h3>
                  <p className="text-gray-400 mt-2 text-center max-w-md">Unfortunately I could not find any results matching your search.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 w-full">
                    {recommended.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              ) : (
                  <div className="
                    grid 
                    grid-cols-2 
                    sm:grid-cols-3 
                    md:grid-cols-2 
                    lg:grid-cols-3 
                    xl:grid-cols-4
                    gap-x-3 sm:gap-x-3 md:gap-x-4 lg:gap-x-5 xl:gap-x-6
                    gap-y-5 sm:gap-y-6 md:gap-y-7 lg:gap-y-8 xl:gap-y-9
                    justify-items-center
                  ">
                  {currentGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              )}
            </div>

            <div className="w-[250px] sticky top-24 hidden md:block">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFilterStatusChange={setShouldHideHighlight}
              />
            </div>
          </div>

          {isMobileFilterOpen && (
            <MobileFilterPanel
              filters={filters}
              onFilterChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClose={() => setIsMobileFilterOpen(false)}
              onApply={() => setIsMobileFilterOpen(false)}
              onClear={() => setIsMobileFilterOpen(false)}
            />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-[#1e1e1e] text-white disabled:opacity-50 cursor-pointer">
                &lt;
              </button>
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-3 py-1 text-gray-400">...</span>
                ) : (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded cursor-pointer ${currentPage === page ? "bg-[#26BBFF] text-black" : "bg-[#1e1e1e] text-white"}`}
                  >
                    {page}
                  </button>
                )
              )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-[#1e1e1e] text-white disabled:opacity-50 cursor-pointer">
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}