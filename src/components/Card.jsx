import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";
import Error from "../pages/Error";
import { GameContext } from "../context/DataContext";
import { FreeGamesSection } from "./FreeGamesSection";
import "../card.css";

function Card({ games = [], dlcs = [], loading, error }) {
  const { user } = useContext(GameContext);
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [processingError, setProcessingError] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    try {
      if (user) {
        const saved = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
        setWishlistItems(saved);
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.error("Error loading wishlist:", err);
      setWishlistItems([]);
    }
  }, [user]);

  const handleWishlist = (item, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    try {
      const exists = wishlistItems.find((i) => i.id === item.id);
      let updatedWishlist;

      if (exists) {
        updatedWishlist = wishlistItems.filter((i) => i.id !== item.id);
        toast.info(
          <div className="flex items-center gap-3">
            <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded" />
            <div>
              <p className="text-white font-semibold">{item.title}</p>
              <p className="text-gray-300 text-sm">Removed from wishlist</p>
            </div>
          </div>
        );
      } else {
        updatedWishlist = [...wishlistItems, item];
        toast.success(
          <div className="flex items-center gap-3">
            <img src={item.image} alt={item.title} className="w-10 h-10 rounded object-cover" />
            <div>
              <p className="font-semibold text-white">{item.title}</p>
              <p className="text-sm text-gray-300">Added to wishlist</p>
            </div>
          </div>
        );
      }

      setWishlistItems(updatedWishlist);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
    } catch (err) {
      console.error("Error handling wishlist:", err);
      toast.error("Failed to update wishlist");
    }
  };

  const [startIndexes, setStartIndexes] = useState({
    discover: 0,
    sale: 0,
    free: 0,
    edition: 0,
  });

  const typeMapping = {
    basedgame: "Base Game",
    dlc: "DLC",
    expansion: "Expansion",
    edition: "Edition",
    addon: "Addon",
  };
  const getCurrentCardsPerPage = () => {
    if (window.innerWidth >= 1536) return 5; 
    if (window.innerWidth >= 1280) return 5; 
    if (window.innerWidth >= 1024) return 4; 
    if (window.innerWidth >= 768) return 3;  
    return 3; 
  };

  const processGamesData = () => {
    try {
      if (!Array.isArray(games) || !Array.isArray(dlcs)) {
        throw new Error("Invalid data format: games and dlcs must be arrays");
      }

      const today = dayjs();

      const newReleases = games
        .filter((g) => {
          try {
            return g && 
                   g.type === "basedgame" && 
                   g.releaseDate && 
                   g.releaseDate !== "upcoming" &&
                   dayjs(g.releaseDate).isValid() && 
                   dayjs(g.releaseDate).isBefore(today);
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          try {
            return dayjs(b.releaseDate).diff(dayjs(a.releaseDate));
          } catch {
            return 0;
          }
        });

      const topRated = games
        .filter((g) => {
          try {
            return g && 
                   g.type === "basedgame" && 
                   g.rating && 
                   !isNaN(parseFloat(g.rating));
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          try {
            const ratingA = parseFloat(a.rating) || 0;
            const ratingB = parseFloat(b.rating) || 0;
            return Math.abs(5 - ratingA) - Math.abs(5 - ratingB);
          } catch {
            return 0;
          }
        });

      const comingSoon = games.filter((g) => g && g.releaseDate === "upcoming");

      const filtered = {
        discover: games.filter(
          (g) =>
            g &&
            g.type === "basedgame" &&
            !(g.price === "Free" || g.price === 0 || g.isFree === true) &&
            !g.discount
        ),
        sale: games.filter(
          (g) =>
            g &&
            g.type === "basedgame" &&
            !(g.price === "Free" || g.price === 0 || g.isFree === true) &&
            g.discount
        ),
        free: games.filter(
          (g) =>
            g &&
            g.type === "basedgame" &&
            (g.price === "Free" || g.price === 0 || g.isFree === true)
        ),
        edition: dlcs.filter((d) => d && (d.type === "edition" || d.type === "addon")),
        new: newReleases,
        top: topRated,
        upcoming: comingSoon,
      };

      return filtered;
    } catch (err) {
      console.error("Error processing games data:", err);
      setProcessingError(err.message);
      return {
        discover: [],
        sale: [],
        free: [],
        edition: [],
        new: [],
        top: [],
        upcoming: [],
      };
    }
  };

  const calculatePrice = (item) => {
    try {
      const isFree = item.price === "Free" || item.price === 0 || item.isFree === true;
      const price = isFree ? 0 : (parseFloat(item.price) || 0);
      const isDiscounted = item.discount && parseFloat(item.discount) > 0;
      const discountedPrice = isDiscounted
        ? (price - (price * parseFloat(item.discount)) / 100).toFixed(2)
        : null;

      return { isFree, price, isDiscounted, discountedPrice };
    } catch (err) {
      console.error("Error calculating price:", err);
      return { isFree: true, price: 0, isDiscounted: false, discountedPrice: null };
    }
  };

  if (loading || !Array.isArray(games) || !Array.isArray(dlcs)) {
    return <Loader />;
  }

  if (error || processingError) {
    return <Error />;
  }

  const filtered = useMemo(() => processGamesData(), [games, dlcs]);

  const handleSlide = (type, direction) => {
    const currentCardsPerPage = getCurrentCardsPerPage();
    
    setStartIndexes((prev) => {
      const max = Math.max(0, filtered[type].length - currentCardsPerPage);
      const nextIndex = prev[type] + direction * currentCardsPerPage;
      return {
        ...prev,
        [type]: Math.max(0, Math.min(nextIndex, max)),
      };
    });
  };

  const renderCards = (items, type, isMobileView = false) => {
    if (!Array.isArray(items)) return null;

    const containerClass = isMobileView
      ? "flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 md:gap-6";

    return (
      <div className={containerClass}>
        {items.map((item) => {
          if (!item || !item.id) return null;

          const { isFree, price, isDiscounted, discountedPrice } = calculatePrice(item);
          const isInWishlist = wishlistItems.some((w) => w.id === item.id);

          const CardContent = (
            <div className="bg-[#101014] rounded-lg overflow-hidden transition duration-300 group cursor-pointer w-full min-w-0 flex-shrink-0" 
                 style={isMobileView ? { minWidth: '200px', maxWidth: '220px' } : {}}>
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image || '/placeholder-image.jpg'}
                    alt={item.title || 'Game'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>

                <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="relative group/icon">
                    <div
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all duration-300 ${
                        isInWishlist ? "animate-pulse bg-white/20" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlist(item, e);
                      }}
                    >
                      <img
                        src={isInWishlist ? "/icons/check.png" : "/icons/wishlist5.png"}
                        alt="wishlist"
                        className="w-5 h-5 md:w-6 md:h-6"
                      />
                    </div>
                    <div className="absolute top-10 right-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 z-10 hidden md:block">
                      {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 md:p-4 flex flex-col h-[120px] md:h-[140px] justify-between">
                <div>
                  <p className="text-[#ffffffa6] text-[12px] font-semibold mb-1">
                    {typeMapping[item.type] || item.type || 'Game'}
                  </p>
                  <h2 className="text-[#fff] font-bold text-[16px] leading-tight line-clamp-2">
                    {item.title || 'Unknown Game'}
                  </h2>
                </div>

                <div className="mt-2">
                  {isFree ? (
                    <p className="text-[#ffffff] font-semibold text-[14px]">Free</p>
                  ) : isDiscounted ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#26BBFF] text-black font-semibold text-[12px] px-2 py-0.5 rounded">
                        -{Math.round(parseFloat(item.discount) || 0)}%
                      </span>
                      <span className="line-through text-[#888] text-[14px]">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-[#fff] text-[14px] font-semibold">
                        ${discountedPrice}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[#fff] text-[14px] font-semibold">
                      ${price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );

          return (
            <Link
              to={`/details/${item.id}`}
              key={item.id}
              className="text-left block"
            >
              {CardContent}
            </Link>
          );
        })}
      </div>
    );
  };

  const Section = ({ title, type }) => {
    const items = filtered[type] || [];
    
    if (items.length === 0) {
      return null; 
    }

    const currentCardsPerPage = getCurrentCardsPerPage();

    return (
      <div className="py-6 md:py-8">
        <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[88%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-[#fff] text-[18px] md:text-[20px] lg:text-[24px] font-bold group transition-all flex items-center">
            {title}
            <span className="ml-1 flex items-center">
              {type === "discover" && <span className="hidden sm:inline">New</span>}
              <span className="transition-all duration-300 group-hover:ml-3 ml-1 text-gray-400">
                {">"}
              </span>
            </span>
          </h2>

          {!isMobile && items.length > currentCardsPerPage && (
            <div className="hidden md:flex">
              <button
                onClick={() => handleSlide(type, -1)}
                disabled={startIndexes[type] === 0}
                className={`p-2 rounded-full transition-all ${
                  startIndexes[type] === 0 
                    ? 'opacity-30 cursor-not-allowed' 
                    : 'opacity-80 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <img
                  src="/icons/arrow-left.png"
                  alt="prev"
                  className="w-5 h-5 lg:w-6 lg:h-6"
                />
              </button>
              <button
                onClick={() => handleSlide(type, 1)}
                disabled={startIndexes[type] + currentCardsPerPage >= items.length}
                className={`p-2 rounded-full transition-all ${
                  startIndexes[type] + currentCardsPerPage >= items.length
                    ? 'opacity-30 cursor-not-allowed'
                    : 'opacity-80 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <img
                  src="/icons/arrow-right.png"
                  alt="next"
                  className="w-5 h-5 lg:w-6 lg:h-6"
                />
              </button>
            </div>
          )}
        </div>

        <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[88%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto">
          {isMobile
            ? renderCards(items, type, true)
            : renderCards(
                items.slice(
                  startIndexes[type],
                  startIndexes[type] + currentCardsPerPage
                ),
                type,
                false
              )}
        </div>
      </div>
    );
  };

  const SectionStatic = ({ title, type, index }) => {
    const items = (filtered[type] || []).slice(0, 5);

    if (items.length === 0) {
      return (
        <div
          className={`p-4 md:p-6 ${
            index !== 2 && "lg:border-r lg:border-gray-600"
          } ${
            index % 2 === 0 && "sm:border-r sm:border-gray-600 lg:border-0"
          }`}
        >
          <h2 className="text-white text-[18px] md:text-[20px] lg:text-[24px] font-bold mb-4 flex items-center gap-2">
            {title} 
            <span className="text-gray-400 text-sm transition-all duration-300 hover:ml-1">
              {'>'}
            </span>
          </h2>
          <p className="text-gray-400 text-sm">No items available</p>
        </div>
      );
    }

    return (
      <div
        className={`p-4 md:p-6 ${
          index !== 2 && "lg:border-r lg:border-gray-600"
        } ${
          index % 2 === 0 && "sm:border-r sm:border-gray-600 lg:border-0"
        }`}
      >
        <h2 className="text-white text-[18px] md:text-[20px] lg:text-[24px] font-bold mb-4 flex items-center gap-2">
          {title} 
          <span className="text-gray-400 text-sm transition-all duration-300 hover:ml-1">
            {'>'}
          </span>
        </h2>

        <div className="flex flex-col gap-2 md:gap-3">
          {items.map((item) => {
            if (!item || !item.id) return null;

            const { isFree, price, isDiscounted, discountedPrice } = calculatePrice(item);
            const isInWishlist = wishlistItems.some((w) => w.id === item.id);

            return (
              <div
                key={item.id}
                className="group flex items-center gap-3 md:gap-4 p-2 md:p-3 relative rounded-lg hover:bg-[#2a2a2d] transition cursor-pointer"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-16 md:w-15 md:h-20 overflow-hidden rounded-md">
                    <img
                      src={item.image || '/placeholder-image.jpg'}
                      alt={item.title || 'Game'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div
                    onClick={(e) => handleWishlist(item, e)}
                    className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full hover:bg-white/30 flex items-center justify-center transition-all z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                  >
                    <img
                      src={isInWishlist ? "/icons/check.png" : "/icons/wishlist5.png"}
                      alt="wishlist"
                      className="w-3 h-3 md:w-4 md:h-4"
                    />
                  </div>
                </div>

                <div
                  onClick={() => navigate(`/details/${item.id}`)}
                  className="flex flex-col text-white min-w-0 flex-1 cursor-pointer"
                >
                  <span className="font-semibold text-sm md:text-base line-clamp-1 mb-1">
                    {item.title || 'Unknown Game'}
                  </span>

                  {isFree ? (
                    <span className="text-[#ffffff] text-xs md:text-sm font-semibold">
                      Free
                    </span>
                  ) : isDiscounted ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#26BBFF] text-black text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded">
                        -{Math.round(parseFloat(item.discount) || 0)}%
                      </span>
                      <span className="text-xs md:text-sm line-through text-gray-400">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-xs md:text-sm font-semibold text-white">
                        ${discountedPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs md:text-sm font-semibold text-white">
                      ${price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0f0f10] min-h-screen">
      <Section title="Discover Something" type="discover" />
      <FreeGamesSection />
      <Section title="Epic Savings Spotlight" type="sale" />
       
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[88%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto">
        <div className="bg-[#1a1a1e] rounded-none md:rounded-xl overflow-hidden mt-6 md:mt-8">
          <div className="sm:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-0 min-w-max">
              <div className="w-[85vw] flex-shrink-0">
                <SectionStatic title="New Releases" type="new" index={0} />
              </div>
              <div className="w-[85vw] flex-shrink-0">
                <SectionStatic title="Top Player Rated" type="top" index={1} />
              </div>
              <div className="w-[85vw] flex-shrink-0">
                <SectionStatic title="Coming Soon" type="upcoming" index={2} />
              </div>
            </div>
          </div>
          
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-0">
            <SectionStatic title="New Releases" type="new" index={0} />
            <SectionStatic title="Top Player Rated" type="top" index={1} />
            <SectionStatic title="Coming Soon" type="upcoming" index={2} />
          </div>
        </div>
      </div>

      <Section title="Top Free Games" type="free" />
      <Section title="Editions & Add-ons" type="edition" />
    </div>
  );
}

export default Card;