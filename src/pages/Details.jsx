import { useContext, useState, useEffect, useRef } from "react";
import { GameContext } from "../context/DataContext";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import SearchNav from "../components/SearchNav";
import GameCard from "../components/GameCard";
import { toast } from "react-toastify";
import Error from "./Error";
import Loader from "../components/Loader";
import OrderModal from "../components/OrderModal";
import { isGameInLibrary } from "../service.js/OrderService";

function Details() {
  const { id } = useParams();
  const { games, dlcs, error, user, loading } = useContext(GameContext);
  const navigate = useNavigate();

  const [showVideo, setShowVideo] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [libraryCheckLoading, setLibraryCheckLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasBaseGame, setHasBaseGame] = useState(true); 
  const [baseGameCheckLoading, setBaseGameCheckLoading] = useState(false);
  const [baseGameTitle, setBaseGameTitle] = useState("");
  
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const getValidMedia = (game) => {
    const validImages = game.carouselImages?.filter(img => img && img.trim() !== '') || [];
    const hasValidVideo = game.video && game.video.trim() !== '' && ReactPlayer.canPlay(game.video);
    
    return {
      images: validImages,
      hasVideo: hasValidVideo,
      totalCount: validImages.length + (hasValidVideo ? 1 : 0)
    };
  };

  const checkBaseGameOwnership = async (dlcGame) => {
    if (!user?.id || !dlcGame.gameId) {
      return false;
    }

    try {
      const ownsBaseGame = await isGameInLibrary(user.id, dlcGame.gameId);
      return ownsBaseGame;
    } catch (error) {
      console.error('Failed to check base game ownership:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkOwnership = async () => {
      if (!user?.id || !id) {
        setHasBaseGame(true); 
        return;
      }

      const game = games.find((g) => g.id === id) || dlcs.find((d) => d.id === id);
      if (!game) return;

      if (game.type?.toLowerCase() === "basedgame") {
        setHasBaseGame(true);
        return;
      }

      if (game.type?.toLowerCase() === "edition") {
        setHasBaseGame(true);
        return;
      }

      const restrictedTypes = ["addon", "demo", "editor"];
      if (restrictedTypes.includes(game.type?.toLowerCase()) && game.gameId) {
        setBaseGameCheckLoading(true);

        const baseGame = games.find(g => g.id === game.gameId);
        if (baseGame) {
          setBaseGameTitle(baseGame.title);
        }

        try {
          const ownsBaseGame = await checkBaseGameOwnership(game);
          setHasBaseGame(ownsBaseGame);
        } catch (error) {
          console.error('Failed to check base game ownership:', error);
          setHasBaseGame(false);
        } finally {
          setBaseGameCheckLoading(false);
        }
      } else {
        setHasBaseGame(true);
      }
    };

    checkOwnership();
  }, [user?.id, id, games, dlcs]);

  useEffect(() => {
    const checkLibrary = async () => {
      if (!user?.id || !id) {
        setIsInLibrary(false);
        return;
      }
      
      setLibraryCheckLoading(true);
      try {
        const inLibrary = await isGameInLibrary(user.id, id);
        setIsInLibrary(inLibrary);
      } catch (error) {
        console.error('Failed to check library:', error);
        setIsInLibrary(false);
      } finally {
        setLibraryCheckLoading(false);
      }
    };

    checkLibrary();
  }, [user?.id, id]);

  useEffect(() => {
    if ((!games?.length && !dlcs?.length) || !id) return;
    
    const item = games.find((g) => g.id === id) || dlcs.find((d) => d.id === id);
    if (!item) return;
    
    if (!user?.id) {
      setIsInCart(false);
      setIsInWishlist(false);
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
    setIsInCart(cart.some((cartItem) => cartItem.id === item.id));
    setIsInWishlist(wishlist.some((wishlistItem) => wishlistItem.id === item.id));
  }, [games, dlcs, id, user?.id]);

  useEffect(() => {
    if ((!games?.length && !dlcs?.length) || !id) return;
    
    const item = games.find((g) => g.id === id) || dlcs.find((d) => d.id === id);
    if (!item) return;

    const validMedia = getValidMedia(item);
    if (validMedia.images.length === 0) return; 

    const interval = setInterval(() => {
      setMobileIndex((prev) =>
        prev >= validMedia.images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [games, dlcs, id]);

  useEffect(() => {
    if ((!games?.length && !dlcs?.length) || !id) return;
    
    const game = games.find((g) => g.id === id) || dlcs.find((d) => d.id === id);
    if (!game) return;
    
    const isBaseGame = game.type?.toLowerCase() === "basedgame";
    if (!isBaseGame && activeTab === "Add-ons") {
      setActiveTab("overview");
    }
  }, [id, games, dlcs, activeTab]);

  useEffect(() => {
    if ((!games?.length && !dlcs?.length) || !id) return;
    
    const game = games.find((g) => g.id === id) || dlcs.find((d) => d.id === id);
    if (!game) return;

    const validMedia = getValidMedia(game);
    
    if (validMedia.hasVideo) {
      setShowVideo(true);
      setCurrentIndex(-1);
    } else if (validMedia.images.length > 0) {
      setShowVideo(false);
      setCurrentIndex(0);
    }

    setMobileIndex(0);
    setThumbnailStartIndex(0);
  }, [id, games, dlcs]);
  
  if (loading) return <Loader />;
  if (error) return <Error />;
  
  const game = games.find((g) => g.id === id) || dlcs.find((d) => d.id === id);
  if (!game) return <Error />;

  const validMedia = getValidMedia(game);

  const isBaseGame = game.type?.toLowerCase() === "basedgame";

  const restrictedTypes = ["addon", "demo", "editor"];
  const requiresBaseGame = restrictedTypes.includes(game.type?.toLowerCase());

  const relatedDlcs = dlcs.filter((dlc) => {
    if (game.type === "basedgame") {
      return dlc.gameId === id && 
             ["addon", "edition", "editor", "demo"].includes(dlc.type?.toLowerCase());
    }
    
    if (game.gameId) {
      return dlc.gameId === game.gameId && 
             dlc.id !== id &&
             ["addon", "edition", "editor", "demo"].includes(dlc.type?.toLowerCase());
    }
    
    return [];
  });

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    if (validMedia.images.length === 0) return;

    const delta = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (delta > threshold) {
      setMobileIndex((prev) =>
        prev >= validMedia.images.length - 1 ? 0 : prev + 1
      );
    } else if (delta < -threshold) {
      setMobileIndex((prev) =>
        prev === 0 ? validMedia.images.length - 1 : prev - 1
      );
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const isFree = game.price === 0 || game.price === "Free" || game.isFree === true;
  const originalPrice = isFree ? 0 : parseFloat(game.price);
  const discountedPrice = game.discount
    ? (originalPrice - (originalPrice * game.discount) / 100).toFixed(2)
    : originalPrice.toFixed(2);

  const getOriginalImageUrl = (url) => url.split("?")[0];

  const typeMapping = {
    basedgame: "Base Game",
    demo: "Demo",
    addon: "Add-On",
    editor: "Editor",
    edition: "Edition",
  };

  const platformIcons = {
    Windows: "/icons/windows.png",
    PS5: "/icons/playstation.png",
    Xbox: "/icons/xbox.png",
    Switch: "/icons/switch.png"
  };

  const nextIndex = () => {
    if (validMedia.totalCount === 0) return;
    
    setCurrentIndex((prev) => {
      const maxIndex = validMedia.images.length - 1;
      if (validMedia.hasVideo) {
        return prev === maxIndex ? -1 : prev + 1;
      } else {
        return prev >= maxIndex ? 0 : prev + 1;
      }
    });
    
    if (validMedia.hasVideo && currentIndex === validMedia.images.length - 1) {
      setShowVideo(true);
    } else {
      setShowVideo(false);
    }
  };

  const prevIndex = () => {
    if (validMedia.totalCount === 0) return;
    
    setCurrentIndex((prev) => {
      const maxIndex = validMedia.images.length - 1;
      if (validMedia.hasVideo) {
        return prev === -1 ? maxIndex : prev - 1;
      } else {
        return prev <= 0 ? maxIndex : prev - 1;
      }
    });
    
    if (validMedia.hasVideo && currentIndex === -1) {
      setShowVideo(false);
      setCurrentIndex(validMedia.images.length - 1);
    } else {
      setShowVideo(false);
    }
  };

  const handleThumbnailClick = (idx) => {
    if (idx === -1 && validMedia.hasVideo) {
      setShowVideo(true);
      setCurrentIndex(-1);
    } else if (idx >= 0 && idx < validMedia.images.length) {
      setShowVideo(false);
      setCurrentIndex(idx);
    }
  };

  const thumbnailsPerView = 3;
  const totalThumbnails = validMedia.totalCount;
  const maxStartIndex = Math.max(0, totalThumbnails - thumbnailsPerView);

  const nextThumbnails = () => {
    if (isSliding) return;
    setIsSliding(true);
    setThumbnailStartIndex(prev => 
      prev >= maxStartIndex ? 0 : prev + 1
    );
    setTimeout(() => setIsSliding(false), 300);
  };

  const prevThumbnails = () => {
    if (isSliding) return;
    setIsSliding(true);
    setThumbnailStartIndex(prev => 
      prev <= 0 ? maxStartIndex : prev - 1
    );
    setTimeout(() => setIsSliding(false), 300);
  };

  const getAllThumbnails = () => {
    const thumbnails = [];
    
    if (validMedia.hasVideo) {
      const videoId = game.video.includes('youtube.com') || game.video.includes('youtu.be') 
        ? game.video.split("v=")[1]?.split("&")[0] || game.video.split("/").pop()
        : null;
      
      thumbnails.push({ 
        type: 'video', 
        index: -1, 
        src: videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '/placeholder-video.jpg'
      });
    }
    
    validMedia.images.forEach((img, idx) => {
      thumbnails.push({ type: 'image', index: idx, src: img });
    });
    
    return thumbnails;
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    
    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTabChanging(false);
    }, 150);
  };

  const addToCart = () => {
    if (!user?.id) {
      toast.error("Please log in to add items to cart");
      return;
    }

    if (isInLibrary) {
      toast.info("This game is already in your library!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];

    if (!cart.find((item) => item.id === game.id)) {
      const updatedCart = [...cart, game];
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
      setIsInCart(true);

      toast.success(
        <div className="flex items-center gap-3">
          <img src={game.image} alt="game" className="w-10 h-10 rounded object-cover" />
          <div>
            <p className="font-semibold text-white">{game.title}</p>
            <p className="text-sm text-gray-300">Added to cart</p>
          </div>
        </div>
      );
    }

    if (wishlist.find((item) => item.id === game.id)) {
      const updatedWishlist = wishlist.filter((item) => item.id !== game.id);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    }
  };

  const addToWishlist = () => {
    if (!user?.id) {
      toast.error("Please log in to add items to wishlist");
      return;
    }

    if (isInLibrary) {
      toast.info("This game is already in your library!");
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];

    if (!wishlist.find((item) => item.id === game.id)) {
      const updatedWishlist = [...wishlist, game];
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
      setIsInWishlist(true);

      toast.success(
        <div className="flex items-center gap-3">
          <img src={game.image} alt="game" className="w-10 h-10 rounded object-cover" />
          <div>
            <p className="font-semibold text-white">{game.title}</p>
            <p className="text-sm text-gray-300">Added to wishlist</p>
          </div>
        </div>
      );
    }
  };

  const handleBuyNow = () => {
    if (!user?.id) {
      toast.error("Please log in to purchase games");
      return;
    }

    if (isInLibrary) {
      toast.info("This game is already in your library!");
      return;
    }

    if (requiresBaseGame && !hasBaseGame) {
      toast.error(`You need to own ${baseGameTitle || 'the base game'} to purchase this content.`);
      return;
    }

    setShowModal(true);
  };

  const navigateToBaseGame = () => {
    if (game.gameId) {
      navigate(`/details/${game.gameId}`);
    }
  };

  function RatingStars({ rating }) {
    let starsImage = "/stars/3.png";
    if (rating >= 4.5) starsImage = "/stars/5.png";
    else if (rating >= 3.5) starsImage = "/stars/4.png";
    else if (rating >= 2.5) starsImage = "/stars/3.png";
    else if (rating >= 1.5) starsImage = "/stars/2.png";
    return (
      <div className="flex items-center gap-2 mt-1">
        <img src={starsImage} alt={`${rating} stars`} className="w-[80px] sm:w-[100px] h-auto" />
        <span className="text-white text-sm font-medium">{rating}</span>
      </div>
    );
  }

  const VideoArrow = ({ direction, onClick }) => (
    <button 
      onClick={onClick} 
      className="absolute top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full p-3 md:p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20 shadow-lg border border-white/20"
      style={{
        [direction === 'left' ? 'left' : 'right']: '16px'
      }}
    >
      <div className="flex items-center justify-center">
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          className={`transform ${direction === 'right' ? 'rotate-180' : ''} transition-transform duration-200`}
        >
          <path 
            d="M15 18L9 12L15 6" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );

  return (
    <div className="bg-[#0f0f10] min-h-screen">
      <SearchNav />
      <div className="max-w-[90%] sm:max-w-[90%] md:max-w-[88%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto  py-6 sm:py-8 text-white">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold mb-2 leading-tight">{game.title}</h1>
          {activeTab === "overview" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-2">
              <div className="flex gap-3 sm:gap-4 text-gray-300 text-xs sm:text-sm order-1 sm:order-2 flex-wrap">
                <div className="flex items-center gap-1 font-semibold">🌐 Diverse Characters</div>
                <div className="flex items-center gap-1 font-semibold">📜 Amazing Storytelling</div>
              </div>
              <div className="order-2 sm:order-1">
                <RatingStars rating={game.rating} />
              </div>
            </div>
          )}
        </div>

        <nav className="flex gap-4 sm:gap-6 text-white text-sm sm:text-base mt-6 overflow-x-auto scrollbar-hide">
          {["overview", ...(isBaseGame ? ["Add-ons"] : [])].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-2 text-sm sm:text-[16px] font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab 
                  ? "border-b-2 border-blue-500 text-white font-medium" 
                  : "text-gray-200 hover:border-b-2 hover:border-gray-500 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        <div className={`transition-all duration-300 ${isTabChanging ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
          {activeTab === "overview" && (
            <div className="flex flex-col xl:grid xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-10">
              <div className="order-2 xl:order-1 xl:col-span-2 w-full flex flex-col gap-6 sm:gap-8">
                {validMedia.totalCount > 0 ? (
                  <>
                    <div className="hidden md:flex aspect-video rounded-xl overflow-hidden relative group shadow-2xl">
                      {(showVideo && validMedia.hasVideo) ? (
                        <ReactPlayer src={game.video} muted playing controls loop width="100%" height="100%" />
                      ) : (
                        validMedia.images.length > 0 && (
                          <img
                            src={getOriginalImageUrl(validMedia.images[Math.max(0, currentIndex)])}
                            alt={`Selected ${currentIndex + 1}`}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        )
                      )}
                      {validMedia.totalCount > 1 && (
                        <>
                          <VideoArrow direction="left" onClick={prevIndex} />
                          <VideoArrow direction="right" onClick={nextIndex} />
                        </>
                      )}
                    </div>
                    {validMedia.totalCount > 1 && (
                      <div className="hidden md:flex items-center gap-4 mt-4 justify-center max-w-[500px] mx-auto">
                        {totalThumbnails > thumbnailsPerView && (
                          <button 
                            onClick={prevThumbnails}
                            disabled={isSliding}
                            className="bg-gray-800/80 hover:bg-gray-700 disabled:bg-gray-800/40 disabled:cursor-not-allowed backdrop-blur-sm rounded-full p-3 hover:scale-110 transition-all duration-200 shrink-0 border border-gray-600/50 shadow-lg group"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform">
                              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )}

                        <div className="relative w-[300px] h-16 overflow-hidden">
                          <div 
                            className="flex gap-1 absolute transition-transform duration-300 ease-in-out"
                            style={{ 
                              transform: `translateX(-${thumbnailStartIndex * 108}px)`,
                              width: `${totalThumbnails * 108}px`
                            }}
                          >
                            {getAllThumbnails().map((thumbnail, idx) => (
                              <img
                                key={`${thumbnail.type}-${thumbnail.index}`}
                                src={thumbnail.src}
                                alt={thumbnail.type === 'video' ? 'Video Thumbnail' : `Slide ${thumbnail.index + 1}`}
                                className={`w-24 h-16 object-cover rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 shrink-0 ${
                                  (thumbnail.type === 'video' && showVideo && validMedia.hasVideo) || 
                                  (thumbnail.type === 'image' && !showVideo && currentIndex === thumbnail.index)
                                    ? "brightness-100 shadow-lg" 
                                    : "brightness-75 hover:brightness-90"
                                }`}
                                onClick={() => handleThumbnailClick(thumbnail.index)}
                              />
                            ))}
                          </div>
                        </div>

                        {totalThumbnails > thumbnailsPerView && (
                          <button 
                            onClick={nextThumbnails}
                            disabled={isSliding}
                            className="bg-gray-800/80 hover:bg-gray-700 disabled:bg-gray-800/40 disabled:cursor-not-allowed backdrop-blur-sm rounded-full p-3 hover:scale-110 transition-all duration-200 shrink-0 border border-gray-600/50 shadow-lg group"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform">
                              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                    
                    {validMedia.images.length > 0 && (
                      <div className="md:hidden mt-4 relative overflow-hidden rounded-lg shadow-xl">
                        <div
                          className="flex transition-transform duration-500 ease-in-out"
                          style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
                          onTouchStart={handleTouchStart}
                          onTouchEnd={handleTouchEnd}
                        >
                          {validMedia.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Slide ${idx + 1}`}
                              className="w-full h-48 sm:h-56 object-cover flex-shrink-0 cursor-pointer"
                              onClick={() => handleThumbnailClick(idx)}
                            />
                          ))}
                        </div>

                        {validMedia.images.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                            {validMedia.images.map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-1 rounded-full cursor-pointer transition-all duration-300 ${
                                  i === mobileIndex ? "bg-white scale-125" : "bg-gray-400 hover:bg-gray-300"
                                }`}
                                onClick={() => setMobileIndex(i)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-video rounded-xl bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2 opacity-50">🎮</div>
                      <p className="text-gray-400">No media available</p>
                    </div>
                  </div>
                )}

                <p className="text-sm sm:text-base text-white leading-relaxed">{game.shortDescription}</p>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  <div className="flex-1">
                    <h3 className="text-gray-400 text-sm font-semibold mb-3">Genres</h3>
                    <div className="flex gap-2 flex-wrap">
                      {game.genre?.map((g, idx) => (
                        <span key={idx} className="bg-[#343437] hover:bg-[#404043] transition-colors text-xs sm:text-sm px-3 py-1.5 rounded-md font-semibold">{g}</span>
                      ))}
                    </div>
                  </div>
                  <div className="lg:border-l-2 border-gray-500/30 lg:pl-6 flex-1">
                    <h3 className="text-gray-400 text-sm font-semibold mb-3">Features</h3>
                    <div className="flex gap-2 flex-wrap">
                      {game.features?.map((f, idx) => (
                        <span key={idx} className="bg-[#343437] hover:bg-[#404043] transition-colors text-xs sm:text-sm px-3 py-1.5 rounded-md font-semibold">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {game.fullDescription?.map((section, idx) => (
                  <div key={idx} className="mt-6">
                    <h2 className="text-base sm:text-xl font-bold mb-3">{section.heading}</h2>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{section.content}</p>
                  </div>
                ))}
                {isBaseGame && (
                  <div className="mt-8">
                    <h2 className="text-base sm:text-xl font-bold mb-6">{game.title} System Requirements</h2>
                    
                    {game.platforms?.includes('Windows') && (
                      <div className="bg-[#202024] rounded-xl p-6 mb-6 font-semibold">
                        <div className="flex items-center gap-3 mb-6">
                          <h3 className="text-base font-semibold text-white pb-2 border-b border-blue-500">Windows</h3>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-base font-semibold text-white mb-4 pb-2">Minimum</h4>
                            <div className="space-y-4 text-sm">
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows OS</span>
                                <span className="text-white text-sm sm:text-base">64-bit Windows 10</span>
                              </div>
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows Processor</span>
                                <div className="text-white text-sm sm:text-base">
                                  <div>Processor (AMD): AMD FX 6350</div>
                                  <div>Processor (Intel): Intel Core i5 6600K</div>
                                </div>
                              </div>
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows Memory</span>
                                <span className="text-white text-sm sm:text-base">8GB</span>
                              </div>
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows Storage</span>
                                <span className="text-white text-sm sm:text-base">60GB</span>
                              </div>
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows DirectX</span>
                                <span className="text-white text-sm sm:text-base">11</span>
                              </div>
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows Graphics</span>
                                <div className="text-white text-sm sm:text-base">
                                  <div>Graphics card (AMD): AMD Radeon™ HD 7850 2GB</div>
                                  <div>Graphics card (NVIDIA): NVIDIA GeForce® GTX 660 2GB</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-base font-semibold text-white mb-4 pb-2">Recommended</h4>
                            <div className="space-y-4 text-sm">
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows OS</span>
                                <span className="text-white text-sm sm:text-base">64-bit Windows 10 or later</span>
                              </div>
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows Processor</span>
                                <div className="text-white text-sm sm:text-base">
                                  <div>Processor (AMD): AMD FX 8350 Wraith</div>
                                  <div>Processor (Intel): Intel Core i7 6700 or equivalent</div>
                                </div>
                              </div>
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows Memory</span>
                                <span className="text-white text-sm sm:text-base">16GB</span>
                              </div>
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows Storage</span>
                                <span className="text-white text-sm sm:text-base">60GB</span>
                              </div>
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows DirectX</span>
                                <span className="text-white text-sm sm:text-base">11</span>
                              </div>
                              <div>
                                <span className="text-[#ffffffa6] block mb-1">Windows Graphics</span>
                                <div className="text-white text-sm sm:text-base">
                                  <div>Graphics card (AMD): AMD Radeon™ RX 480 4GB</div>
                                  <div>Graphics card (NVIDIA): NVIDIA GeForce® GTX 1060 3GB</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-[#202024] rounded-xl p-6 mb-6 font-semibold">
                      <h4 className="text-sm font-semibold text-[#ffffffa6] mb-4">Login Accounts Required</h4>
                      <div className="text-white text-sm sm:text-base">
                        {game.publisher?.toLowerCase().includes('electronic arts') || game.publisher?.toLowerCase().includes('ea') ? (
                          <span>The EA app</span>
                        ) : game.publisher?.toLowerCase().includes('ubisoft') ? (
                          <span>Uplay app</span>
                        ) : game.publisher?.toLowerCase().includes('epic games') ? (
                          <span>Epic Games app</span>
                        ) : (
                          <span>...</span>
                        )}
                      </div>
                    </div>

                    {(game.language || game.supportedLanguages) && (
                      <div className="bg-[#202024] rounded-xl p-6 font-semibold">
                        <h4 className="text-sm font-semibold text-[#ffffffa6] mb-4">Languages Supported</h4>
                        <div className="text-white text-sm sm:text-base">
                          <div className="mb-2">
                            <span className="text-[#ffffffa6]">Audio: </span>
                            <span>{game.languages?.audio?.join(', ') || 'English, Italian, Spanish - Spain, French, German, Polish, Portuguese - Brazil, Spanish - Latin America'}</span>
                          </div>
                          <div>
                            <span className="text-[#ffffffa6]">Text: </span>
                            <span>{game.languages?.text?.join(', ') || 'English, Italian, Spanish - Spain, Japanese, Chinese - Traditional, French, German, Polish, Portuguese - Brazil, Russian, Spanish - Latin America'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              <div className="order-1 xl:order-2 w-full flex flex-col gap-4 sm:gap-5">
                <div className="flex justify-center">
                  <img src={game.logo} alt={`${game.title} Logo`} className="h-32 sm:h-40 object-contain max-w-full" />
                </div>

                {requiresBaseGame && !hasBaseGame && !baseGameCheckLoading && !isInLibrary && user?.id && (
                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                    <div className="text-center">
                      <h3 className="text-yellow-400 font-bold mb-2">Base Game Required</h3>
                      <p className="text-gray-300 text-sm mb-3">
                        You need to own <span className="font-semibold text-white">{baseGameTitle || 'the base game'}</span> to purchase this content.
                      </p>
                      {baseGameTitle && (
                        <button
                          onClick={navigateToBaseGame}
                          className="text-blue-400 hover:text-blue-300 text-sm font-bold underline transition-colors"
                        >
                          View Base Game →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <p className="inline-block font-semibold max-w-max text-xs sm:text-sm text-white px-2 py-1 bg-gray-600 rounded mx-auto xl:mx-0">
                  {typeMapping[game.type?.toLowerCase()] || "Unknown"}
                </p>

                <div className="text-center xl:text-left">
                  {isFree ? (
                    <span className="text-white font-semibold text-lg sm:text-xl">Free</span>
                  ) : game.discount ? (
                    <div className="flex items-center justify-center xl:justify-start gap-3 sm:gap-4 flex-wrap">
                      <span className="bg-[#26BBFF] font-semibold text-xs sm:text-sm px-2 py-1 rounded-xl text-black">-{game.discount}%</span>
                      <span className="line-through text-gray-400 text-sm sm:text-base">${originalPrice.toFixed(2)}</span>
                      <span className="text-white font-semibold text-base">${discountedPrice}</span>
                    </div>
                  ) : (
                    <span className="text-white font-semibold text-base">${originalPrice.toFixed(2)}</span>
                  )}
                </div>

                <div className="space-y-3">
                  {isInLibrary ? (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 bg-[#88888a] text-black py-3 sm:py-4 rounded-md font-semibold cursor-not-allowed opacity-80"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.5 3.25A2.25 2.25 0 0 0 3.25 5.5v3a2.25 2.25 0 0 0 2.25 2.25h3a2.25 2.25 0 0 0 2.25-2.25v-3A2.25 2.25 0 0 0 8.5 3.25zM4.75 5.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75zm.75 7.75a2.25 2.25 0 0 0-2.25 2.25v3a2.25 2.25 0 0 0 2.25 2.25h3a2.25 2.25 0 0 0 2.25-2.25v-3a2.25 2.25 0 0 0-2.25-2.25zm-.75 2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75zm8.5 0a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v3a2.25 2.25 0 0 1-2.25 2.25h-3a2.25 2.25 0 0 1-2.25-2.25zm2.25-.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 0-.75-.75zm0-11.5a2.25 2.25 0 0 0-2.25 2.25v3a2.25 2.25 0 0 0 2.25 2.25h3a2.25 2.25 0 0 0 2.25-2.25v-3a2.25 2.25 0 0 0-2.25-2.25zm-.75 2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75z"
                        />
                      </svg>
                      In Library
                    </button>
                  ) : (
                    <>
                      <button
                        className={`w-full py-3 sm:py-4 rounded-md font-semibold transition-all duration-200 shadow-lg ${
                          libraryCheckLoading || baseGameCheckLoading || (requiresBaseGame && !hasBaseGame)
                            ? "bg-[#0F0F10] border border-gray-700 text-[#ffffffa6] cursor-not-allowed"
                            : "bg-[#1e90ff] hover:bg-blue-500 text-white hover:scale-[1.02]"
                        }`}
                        onClick={handleBuyNow}
                        disabled={libraryCheckLoading || baseGameCheckLoading || (requiresBaseGame && !hasBaseGame)}
                      >
                        {libraryCheckLoading || baseGameCheckLoading
                          ? "Checking..."
                          : requiresBaseGame && !hasBaseGame
                            ? "Requires Base Game"
                            : isFree
                              ? "Get"
                              : game.releaseDate?.toLowerCase() === "upcoming"
                                ? "Pre-Purchase"
                                : "Buy Now"}
                      </button>

                      {isInCart ? (
                        <button
                          type="button"
                          onClick={() => navigate("/basket")}
                          className="w-full bg-gray-700 hover:bg-[#636366] text-white py-3 sm:py-4 rounded-md font-semibold transition-all duration-200 hover:scale-[1.02]"
                        >
                          View in Cart
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={addToCart}
                          className={`w-full py-3 sm:py-4 rounded-md font-semibold transition-all duration-200 ${
                            libraryCheckLoading
                              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                              : "bg-gray-700 hover:bg-[#636366] text-white hover:scale-[1.02]"
                          }`}
                          disabled={libraryCheckLoading}
                        >
                          {libraryCheckLoading ? "Checking..." : "Add To Cart"}
                        </button>
                      )}

                      {isInWishlist ? (
                        <button
                          type="button"
                          onClick={() => navigate("/wishlist")}
                          className="w-full bg-gray-700 hover:bg-[#636366] text-white py-3 sm:py-4 rounded-md font-semibold transition-all duration-200 hover:scale-[1.02]"
                        >
                          View in Wishlist
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={addToWishlist}
                          className={`w-full py-3 sm:py-4 rounded-md font-semibold transition-all duration-200 ${
                            libraryCheckLoading
                              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                              : "bg-gray-700 hover:bg-[#636366] text-white hover:scale-[1.02]"
                          }`}
                          disabled={libraryCheckLoading}
                        >
                          {libraryCheckLoading ? "Checking..." : "Add to Wishlist"}
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6 text-xs sm:text-sm text-white pt-4 space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-600 pb-3 sm:pb-4 font-semibold">
                    <span className="text-gray-400">Developer</span>
                    <span className="text-right max-w-[60%] truncate">{game.developer || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-600 pb-3 sm:pb-4 font-semibold">
                    <span className="text-gray-400">Publisher</span>
                    <span className="text-right max-w-[60%] truncate">{game.publisher || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-600 pb-3 sm:pb-4 font-semibold">
                    <span className="text-gray-400">Release Date</span>
                    <span className="text-right">{game.releaseDate || "TBA"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-600 pb-3 sm:pb-4 font-semibold">
                    <span className="text-gray-400">Platform</span>
                    <div className="flex items-center gap-2">
                      {game.platforms?.map((platform, index) => (
                        <div key={index} className="group relative">
                          {platformIcons[platform] && (
                            <img
                              src={platformIcons[platform]}
                              alt={platform}
                              className="w-4 h-4 sm:w-5 sm:h-5 hover:scale-110 transition-transform duration-200"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Add-ons" && isBaseGame && (
            <div className="mt-8 sm:mt-10">
              {relatedDlcs.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="text-6xl sm:text-8xl mb-4 opacity-20">🎮</div>
                  <p className="text-gray-400 text-lg sm:text-xl">No add-ons or editions found for this game.</p>
                  <p className="text-gray-500 text-sm sm:text-base mt-2">Check back later for new content!</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Available Add-ons</h2>
                    <p className="text-gray-400 text-sm sm:text-base">Expand your gaming experience with these additional content</p>
                  </div>
                  <div className="grid grid-cols-1 min-[375px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
                    {relatedDlcs.map((dlcItem, index) => (
                      <div
                        key={dlcItem.id}
                        className="w-full animate-fade-in-up"
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animationFillMode: 'both'
                        }}
                      >
                        <GameCard game={dlcItem} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
      
      {showModal && (
        <OrderModal 
          game={game}
          userId={user.id}  
          subtotal={
            isFree
              ? 0
              : game.discount
                ? parseFloat(discountedPrice)
                : parseFloat(originalPrice)
          }  
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

export default Details;