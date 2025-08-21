import { useContext, useEffect, useState } from "react";
import { GameContext } from "../context/DataContext"; 

function FreeGamesSection() {
  const { freegames } = useContext(GameContext); 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "free":
        return "bg-[#26BBFF] text-black";
      case "coming-soon":
        return "bg-black text-white";
      default:
        return "bg-gray-600 text-gray-300";
    }
  };

  const renderCards = (items, isMobileView = false) => {
    if (!Array.isArray(items) || items.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎮</span>
          </div>
          <div className="text-gray-400 mb-2">No free games available</div>
          <div className="text-gray-500 text-sm">Check back later for new free games!</div>
        </div>
      );
    }

    const containerClass = isMobileView
      ? "flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      : "grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6";

    return (
      <div className={containerClass}>
        {items.map((game) => {
          if (!game || !game.id) return null;

          return (
            <div key={game.id} className="text-left block">
              <div className="bg-[#202024] rounded-lg overflow-hidden transition duration-300 group cursor-pointer w-full min-w-0 flex-shrink-0" 
                   style={isMobileView ? { minWidth: '180px', maxWidth: '220px' } : {}}>

                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={game.image || '/placeholder-image.jpg'}
                      alt={game.title || 'Game'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-md"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzM3NDE1MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>
                </div>

                <div className={`text-center py-1 text-[12px] rounded-b-md font-bold tracking-wider ${getStatusStyles(game.status)}`}>
                  {game.buttonText || (game.status === "free" ? "FREE NOW" : "COMING SOON")}
                </div>

                <div className="p-3 md:p-4 ">
                  <h3 className="text-[#fff] font-bold text-[14px] md:text-[16px] leading-tight line-clamp-2 mb-2">
                    {game.title || 'Unknown Game'}
                  </h3>
                  <p className="text-[#ffffffa6] font-semibold text-[14px] md:text-[16px]">
                    {game.date || 'Available now'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!freegames || freegames.length === 0) {
    return null; 
  }

  return (
    <div className="">
      <div className="w-full lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%] mx-auto py-7 px-5 sm:px-10 bg-[#202024] rounded-none md:rounded-2xl">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-[#fff] text-[18px] md:text-[20px] font-bold group transition-all flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 mr-1 sm:mr-3"  viewBox="0 0 32 32" fill="currentColor" > <g fill="currentColor" fillRule="evenodd"> <path d="M30.443 16.605H19.72v-3.46h10.724v3.46zm-2.075 12.308c0 .397-.576.838-1.402.838h-7.247V17.99h8.648v10.924zm-14.876.838h4.843v-18.68h-4.843v18.68zm-10.033-.838V17.99h8.649v11.762H4.861c-.826 0-1.402-.441-1.402-.838zM1.384 13.146h10.724v3.46H1.384v-3.46zm1.773-4.324c0-1.622 1.319-2.94 2.94-2.94 2.752 0 5.093 3.78 5.575 5.88H6.097a2.944 2.944 0 0 1-2.94-2.94zm22.573-2.94c1.621 0 2.94 1.318 2.94 2.94 0 1.621-1.319 2.94-2.94 2.94h-5.574c.481-2.1 2.822-5.88 5.574-5.88zm5.405 5.88h-2.244a4.304 4.304 0 0 0 1.163-2.94 4.329 4.329 0 0 0-4.324-4.325c-2.89 0-5.227 2.813-6.341 5.294a.686.686 0 0 0-.362-.105H12.8a.686.686 0 0 0-.362.105c-1.114-2.481-3.45-5.294-6.34-5.294a4.329 4.329 0 0 0-4.325 4.325c0 1.136.444 2.168 1.163 2.94H.692a.692.692 0 0 0-.692.692v4.843c0 .382.31.692.692.692h1.384v10.924c0 1.246 1.223 2.222 2.785 2.222h22.105c1.562 0 2.785-.976 2.785-2.222V17.99h1.384c.382 0 .692-.31.692-.692v-4.843a.692.692 0 0 0-.692-.692zM15.914 4.151c.381 0 .691-.31.691-.692V.692a.692.692 0 0 0-1.383 0v2.767c0 .382.31.692.692.692"></path> <path d="M19.546 5.362a.69.69 0 0 0 .49-.203l1.037-1.037a.692.692 0 1 0-.978-.979l-1.038 1.038a.692.692 0 0 0 .489 1.181M11.792 5.16a.69.69 0 0 0 .978 0 .692.692 0 0 0 0-.979l-1.038-1.038a.692.692 0 1 0-.978.979l1.038 1.037z"></path> </g> </svg>
            Free Games
          </h2>
          <button className="text-[#fff] rounded-md hover:bg-[#414145] text-sm font-medium border border-gray-500 p-[7px_15px] whitespace-nowrap">
            View More
          </button>
        </div>
        <div>
          {renderCards(freegames, isMobile)}
        </div>
      </div>
    </div>
  );
}

export { FreeGamesSection };
