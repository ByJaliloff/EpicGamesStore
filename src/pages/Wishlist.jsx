import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchNav from "../components/SearchNav";
import { GameContext } from "../context/DataContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { isGameInLibrary } from "../service.js/OrderService"; 

const platformIcons = {
  Windows: "/icons/windows.png",
  PS5: "/icons/playstation.png",
  Xbox: "/icons/xbox.png",
  Switch: "/icons/switch.png"
};

const typeMapping = {
  basedgame: "Base Game",
  dlc: "DLC",
  expansion: "Expansion",
  edition: "Edition",
  addon: "Addon",
};

const ageRatingImages = {
  "3+": "/ratings/3plus.png",
  "7+": "/ratings/7plus.png",
  "12+": "/ratings/12plus.png",
  "16+": "/ratings/16plus.png",
  "18+": "/ratings/18plus.png",
};

function Wishlist() {
  const { loading, error, user } = useContext(GameContext);

  if (loading) return <Loader />;
  if (error) return <Error />

  const [wishlist, setWishlist] = useState([]);
  const [ownedGames, setOwnedGames] = useState(new Set()); 
  const [checkingLibrary, setCheckingLibrary] = useState(false); 
  const [cartItems, setCartItems] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setOwnedGames(new Set());
      setCartItems([]);
      return;
    }
    const saved = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
    setWishlist(saved);
    
    const cartKey = `cart_${user.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(cart);
    
    checkOwnedGames(saved);
  }, [user]);

  const checkOwnedGames = async (wishlistItems) => {
    if (!user?.id || wishlistItems.length === 0) return;
    
    setCheckingLibrary(true);
    const owned = new Set();
    
    try {

      for (const item of wishlistItems) {
        const isOwned = await isGameInLibrary(user.id, item.id);
        if (isOwned) {
          owned.add(item.id);
        }
      }
      setOwnedGames(owned);
    } catch (error) {
      console.error('Failed to check owned games:', error);
    } finally {
      setCheckingLibrary(false);
    }
  };

  const removeFromWishlist = (id) => {
    if (!user) return;

    const removedItem = wishlist.find((item) => item.id === id);
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));

    const newOwnedGames = new Set(ownedGames);
    newOwnedGames.delete(id);
    setOwnedGames(newOwnedGames);

    toast.info(
      <div className="flex items-center gap-3">
        <img
          src={removedItem.image}
          alt={removedItem.title}
          className="w-10 h-10 object-cover rounded"
        />
        <div>
          <p className="font-semibold text-white">{removedItem.title}</p>
          <p className="text-sm text-gray-300">Removed from wishlist</p>
        </div>
      </div>
    );
  };

  const addToCart = async (item) => {
    if (!user?.id) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    const isOwned = await isGameInLibrary(user.id, item.id);
    if (isOwned) {
      toast.error(
        <div className="flex items-center gap-3">
          <img
            src={item.image}
            alt={item.title}
            className="w-10 h-10 object-cover rounded"
          />
          <div>
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-sm text-red-300">Already in your library</p>
          </div>
        </div>
      );
      
      setOwnedGames(prev => new Set([...prev, item.id]));
      return;
    }

    const cartKey = `cart_${user.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const exists = cart.find((i) => i.id === item.id);

    if (!exists) {
      const updatedCart = [...cart, item];
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      
      setCartItems(updatedCart);

      toast.success(
        <div className="flex items-center gap-3">
          <img
            src={item.image}
            alt={item.title}
            className="w-10 h-10 object-cover rounded"
          />
          <div>
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-sm text-green-400">Added to cart</p>
          </div>
        </div>
      );
    }
  };

  const isInCart = (id) => {
    if (!user?.id) return false;
    return cartItems.some((item) => item.id === id);
  };

  const isGameOwned = (gameId) => {
    return ownedGames.has(gameId);
  };

  if (!user?.id) {
    return (
      <>
        <SearchNav />
        <div className="bg-[#0f0f10] min-h-[300px] sm:min-h-[500px] md:min-h-screen py-10 text-white">
          <div className="w-[90%] md:max-w-[75%] mx-auto mb-6">
            <h1 className="text-2xl sm:text-[40px] font-bold text-[#ffffff] mb-10 text-center md:text-left">
              My Wishlist
            </h1>
            <div className="text-center mt-20 flex flex-col items-center justify-center gap-4">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16"
                  viewBox="0 0 45 52"
                >
                  <g fill="none" fillRule="evenodd">
                    <path
                      d="M4.058 0C1.094 0 0 1.098 0 4.075v35.922c0 .338.013.65.043.94.068.65-.043 1.934 2.285 2.96 1.553.683 7.62 3.208 18.203 7.573 1.024.428 1.313.529 2.081.529.685.013 1.137-.099 2.072-.53 10.59-4.227 16.66-6.752 18.213-7.573 2.327-1.23 2.097-3.561 2.097-3.899V4.075C44.994 1.098 44.13 0 41.166 0H4.058z"
                      fill="#404044"
                    ></path>
                    <path
                      stroke="#FFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 18l4.91 2.545-2.455 4M25.544 28.705c-1.056-.131-1.806-.14-2.25-.025-.444.115-1.209.514-2.294 1.197M29.09 21.727L25 19.5l2.045-3.5"
                    ></path>
                  </g>
                </svg>
              </div>

              <p className="text-white text-[30px] mb-6 font-bold max-w-[90%]">
                Please log in to view your wishlist.
              </p>

              <button
                onClick={() => navigate("/signin")}
                className="bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] font-semibold px-6 py-2 rounded-md text-sm transition mr-4"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-[#26bbff] hover:bg-[#00aaff] text-black font-semibold px-6 py-2 rounded-md text-sm transition mr-4"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SearchNav />
      <div className="bg-[#0f0f10] min-h-[300px] sm:min-h-[500px] md:min-h-screen py-10 text-white">
        <div className="w-[90%] md:max-w-[65%] mx-auto mb-6">
          <h1 className="text-2xl sm:text-[40px] font-bold text-[#ffffff] mb-10 text-center md:text-left">
            My Wishlist
          </h1>
          {checkingLibrary && (
          <div className="text-center mb-4">
            <img
              src="/icons/icons8-loading.gif"
              alt="Checking library..."
              className="mx-auto w-8 h-8"
            />
          </div>
        )}
          {wishlist.length === 0 ? (
            <div className="text-center mt-20 flex flex-col items-center justify-center">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16"
                  viewBox="0 0 45 52"
                >
                  <g fill="none" fillRule="evenodd">
                    <path
                      d="M4.058 0C1.094 0 0 1.098 0 4.075v35.922c0 .338.013.65.043.94.068.65-.043 1.934 2.285 2.96 1.553.683 7.62 3.208 18.203 7.573 1.024.428 1.313.529 2.081.529.685.013 1.137-.099 2.072-.53 10.59-4.227 16.66-6.752 18.213-7.573 2.327-1.23 2.097-3.561 2.097-3.899V4.075C44.994 1.098 44.13 0 41.166 0H4.058z"
                      fill="#404044"
                    ></path>
                    <path
                      stroke="#FFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 18l4.91 2.545-2.455 4M25.544 28.705c-1.056-.131-1.806-.14-2.25-.025-.444.115-1.209.514-2.294 1.197M29.09 21.727L25 19.5l2.045-3.5"
                    ></path>
                  </g>
                </svg>
              </div>

              <p className="text-white text-xl sm:text-2xl md:text-[30px] mb-6 font-bold max-w-[90%]">
                You haven't added anything to your wishlist yet.
              </p>

              <button
                onClick={() => navigate("/")}
                className="bg-[#26bbff] hover:bg-[#00aaff] text-black font-semibold px-6 py-2 rounded-md text-sm transition"
              >
                Shop for Games & Apps
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#202024] rounded-xl overflow-hidden shadow-md transition duration-300 flex flex-col md:flex-row"
                >
                  <div className="w-full md:w-[200px] md:min-w-[200px] relative">
                    <Link to={`/details/${item.id}`} className="block">
                      <div className="aspect-[16/9] md:aspect-[3/4] overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-t-none">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="flex-1 p-4 md:p-6 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div className="flex-1">
                        <span className="bg-[#414145] text-xs text-white px-2 py-1 font-semibold rounded-md inline-block mb-2">
                          {typeMapping[item.type?.toLowerCase()] || "Base Game"}
                        </span>
                        
                        <h2 className="text-white text-lg md:text-xl font-bold mb-3 line-clamp-2">
                          {item.title}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2 text-white font-semibold text-sm md:text-base ml-0 sm:ml-4 mb-3 sm:mb-0">
                        {item.price === "Free" ? (
                          <span className="text-[#0f0] text-lg">Free</span>
                        ) : item.discount ? (
                          <div className="flex items-center gap-2">
                            <span className="bg-[#26bbff] text-black px-2 py-1 rounded text-xs font-bold">
                              -{item.discount}%
                            </span>
                            <div className="flex flex-col items-end">
                              <span className="line-through opacity-50 text-xs">
                                ${parseFloat(item.price).toFixed(2)}
                              </span>
                              <span className="text-lg font-bold">
                                ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-lg">${parseFloat(item.price).toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    {item.ageRating && (
                      <div className="flex items-center gap-3 bg-[#2a2a2e] p-3 rounded-md border border-gray-600 hover:border-gray-400 mb-4 transition-colors">
                        <img
                          src={ageRatingImages[item.ageRating.label]}
                          alt={item.ageRating.label}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                        />
                        <div>
                          <div className="font-semibold text-white text-sm md:text-base">
                            {item.ageRating.label}
                          </div>
                          <div className="text-xs md:text-sm text-gray-400">
                            {item.ageRating.descriptors?.slice(0, 2).join(", ")}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      {item.platforms && item.platforms.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {item.platforms.map((platform) =>
                            platformIcons[platform] ? (
                              <img
                                key={platform}
                                src={platformIcons[platform]}
                                alt={platform}
                                title={platform}
                                className="w-5 h-5 opacity-70"
                              />
                            ) : null
                          )}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between relative z-10">
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-red-400 md:text-[#ffffffa6] font-semibold hover:text-red-400 transition text-sm text-left cursor-pointer"
                        >
                          Remove from Wishlist
                        </button>

                        <div className="flex gap-2 relative z-20">
                          {isGameOwned(item.id) ? (
                                  <button
                                    disabled
                                    className="flex-1 sm:flex-none bg-[#236e92]  text-black font-semibold 
                                              px-6 py-2 rounded-md text-sm transition opacity-50 cursor-not-allowed"
                                  >
                                    <span className="flex items-center justify-center gap-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        viewBox="0 0 22 22"
                                      >
                                        <g fill="none" fillRule="evenodd">
                                          <circle
                                            cx="11"
                                            cy="11"
                                            r="9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          />
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8 8.5C8 8.22386 8.22386 8 8.5 8H9.9C10.1761 8 10.4 8.22386 10.4 8.5V9.9C10.4 10.1761 10.1761 10.4 9.9 10.4H8.5C8.22386 10.4 8 10.1761 8 9.9V8.5ZM8.5 11.6C8.22386 11.6 8 11.8239 8 12.1V13.5C8 13.7761 8.22386 14 8.5 14H9.9C10.1761 14 10.4 13.7761 10.4 13.5V12.1C10.4 11.8239 10.1761 11.6 9.9 11.6H8.5ZM12.1 11.6C11.8239 11.6 11.6 11.8239 11.6 12.1V13.5C11.6 13.7761 11.8239 14 12.1 14H13.5C13.7761 14 14 13.7761 14 13.5V12.1C14 11.8239 13.7761 11.6 13.5 11.6H12.1ZM12.1 8C11.8239 8 11.6 8.22386 11.6 8.5V9.9C11.6 10.1761 11.8239 10.4 12.1 10.4H13.5C13.7761 10.4 14 10.1761 14 9.9V8.5C14 8.22386 13.7761 8 13.5 8H12.1Z"
                                            fill="currentColor"
                                          />
                                        </g>
                                      </svg>
                                      In Library
                                    </span>
                                  </button>
                          ) : isInCart(item.id) ? (
                            <button
                              onClick={() => navigate("/basket")}
                              className="flex-1 sm:flex-none bg-transparent border border-[#26bbff] hover:bg-[#26bbff] hover:text-black text-[#26bbff] font-semibold px-6 py-2 rounded-md text-sm transition cursor-pointer"
                            >
                              View in Cart
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                addToCart(item);
                              }}
                              className="flex-1 sm:flex-none bg-[#26bbff] hover:bg-[#00aaff] font-semibold text-black px-6 py-2 rounded-md text-sm transition cursor-pointer"
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Wishlist;