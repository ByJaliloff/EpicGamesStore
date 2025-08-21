import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GameContext } from "../context/DataContext";


const typeMapping = {
  basedgame: "Base Game",
  dlc: "DLC",
  expansion: "Expansion",
  edition: "Edition",
  addon: "Addon",
};

export default function GameCard({ game }) {
  const { user } = useContext(GameContext);

  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsInWishlist(false);
      return;
    }
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
    setIsInWishlist(wishlist.some((w) => w.id === game.id));
  }, [game.id, user]);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

  if (!user?.id) {
    toast.error("Please log in to add items to your wishlist");
    return;
  }
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
    const exists = wishlist.find((i) => i.id === game.id);

    let updated;
    if (exists) {
      updated = wishlist.filter((i) => i.id !== game.id);
      setIsInWishlist(false);

      toast.info(
        <div className="flex items-center gap-3">
          <img
            src={game.image}
            alt={game.title}
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <p className="font-semibold text-white">{game.title}</p>
            <p className="text-sm text-gray-300">Removed from wishlist</p>
          </div>
        </div>
      );
    } else {
      updated = [...wishlist, game];
      setIsInWishlist(true);

      toast.success(
        <div className="flex items-center gap-3">
          <img
            src={game.image}
            alt={game.title}
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <p className="font-semibold text-white">{game.title}</p>
            <p className="text-sm text-green-400">Added to wishlist</p>
          </div>
        </div>
      );
    }

    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
  };


  const isDiscounted = game.discount && game.discount > 0;
  const isFree = game.price === "Free" || game.price === 0 || game.isFree === true;
  const price = isFree ? 0 : parseFloat(game.price);
  const discountedPrice = isDiscounted
    ? (price - (price * game.discount) / 100).toFixed(2)
    : null;



  const CardContent = (
<div
  className="bg-[#101014] rounded-2xl overflow-hidden transition duration-300 group cursor-pointer shadow hover:shadow-lg w-full h-auto"
>
  <div className="relative">
    <img
      src={game.image}
      alt={game.title}
      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div
      className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
    >
      <div className="relative group/icon">
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all duration-300 ${
            isInWishlist ? "animate-pulse bg-white/20" : ""
          }`}
          onClick={(e) => handleWishlist(e)}
        >
          <img
            src={isInWishlist ? "/icons/check.png" : "/icons/wishlist5.png"}
            alt="wishlist"
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
          />
        </div>

        <div className="hidden sm:block absolute top-10 right-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 z-10">
          {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        </div>
      </div>
    </div>
  </div>

  <div className="p-2 sm:p-3 md:p-4 flex flex-col justify-between h-[110px] sm:h-[125px] md:h-[140px]">
    <div>
      <p className="text-[#ffffffa6] text-[11px] sm:text-[12px] font-semibold mb-1">
        {typeMapping[game.type] || game.type}
      </p>
      <h2 className="text-[#fff] font-bold text-[13px] sm:text-[14px] md:text-[15px] mb-2 line-clamp-2 leading-tight">
        {game.title}
      </h2>
    </div>

    <div>
      {isFree ? (
        <p className="text-[#ffffff] font-semibold text-[13px] sm:text-[14px]">Free</p>
      ) : isDiscounted ? (
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="bg-[#26BBFF] text-black font-semibold text-[11px] sm:text-[12px] px-1.5 sm:px-2 py-0.5 rounded">
            -{game.discount}%
          </span>
          <span className="line-through text-[#888] text-[12px] sm:text-[13px]">
            ${price.toFixed(2)}
          </span>
          <span className="text-[#fff] text-[13px] sm:text-[14px] font-semibold">
            ${discountedPrice}
          </span>
        </div>
      ) : (
        <p className="text-[#fff] text-[13px] sm:text-[14px] font-semibold">
          ${price.toFixed(2)}
        </p>
      )}
    </div>
  </div>
</div>

);


  return (
    <Link to={`/details/${game.id}`}>
      {CardContent}
    </Link>
  );

}
