import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/DataContext";
import SearchNav from "../components/SearchNav";
import { toast } from "react-toastify";
import OrderModal from "../components/OrderModal";
import { isGameInLibrary } from "../service.js/OrderService";

export default function Basket() {
  const { user, moveToWishlist, games } = useContext(GameContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [baseGameValidation, setBaseGameValidation] = useState({
    isChecking: false,
    hasInvalidItems: false,
    invalidItems: []
  });

  useEffect(() => {
    if (!user?.id) {
      setCart([]);
      return;
    }
    
    const userCart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
    setCart(userCart);
  }, [user?.id]);

  useEffect(() => {
    const checkBaseGameOwnership = async () => {
      if (!user?.id || cart.length === 0) {
        setBaseGameValidation({
          isChecking: false,
          hasInvalidItems: false,
          invalidItems: []
        });
        return;
      }

      setBaseGameValidation(prev => ({ ...prev, isChecking: true }));

      const restrictedTypes = ["addon", "demo", "editor"];
      const invalidItems = [];

      for (const item of cart) {
        if (restrictedTypes.includes(item.type?.toLowerCase()) && item.gameId) {
          try {
            const ownsBaseGame = await isGameInLibrary(user.id, item.gameId);
            if (!ownsBaseGame) {
              const baseGame = games.find(g => g.id === item.gameId);
              invalidItems.push({
                ...item,
                baseGameTitle: baseGame?.title || 'Base Game',
                baseGameId: item.gameId
              });
            }
          } catch (error) {
            console.error(`Failed to check base game ownership for ${item.title}:`, error);
            const baseGame = games.find(g => g.id === item.gameId);
            invalidItems.push({
              ...item,
              baseGameTitle: baseGame?.title || 'Base Game',
              baseGameId: item.gameId
            });
          }
        }
      }

      setBaseGameValidation({
        isChecking: false,
        hasInvalidItems: invalidItems.length > 0,
        invalidItems
      });
    };

    checkBaseGameOwnership();
  }, [user?.id, cart, games]);

  const removeFromCart = (item) => {
    if (!user?.id) {
      toast.error("Please log in to manage your cart");
      return;
    }

    setCart(prevCart => {
      const updatedCart = prevCart.filter(p => String(p.id) !== String(item.id));
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));

      toast.info(
        <div className="flex items-center gap-3">
          <img
            src={item.image}
            alt={item.title}
            className="w-10 h-10 object-cover rounded"
          />
          <div>
            <p className="text-white font-semibold">{item.title}</p>
            <p className="text-gray-300 text-sm">Removed from cart</p>
          </div>
        </div>
      );

      return updatedCart;
    });
  };
  const navigateToBaseGame = (baseGameId) => {
    navigate(`/details/${baseGameId}`);
  };

  if (!user?.id) {
    return (
      <>
        <SearchNav />
        <div className="bg-[#0f0f10] min-h-[300px] sm:min-h-[500px] md:min-h-screen py-10 text-white">
          <div className="w-[90%] md:max-w-[75%] mx-auto mb-6 ">
            <h1 className="text-2xl sm:text-[40px] font-bold text-[#ffffff] mb-10 text-center md:text-left">
              My Cart
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
                Please log in to view your cart.
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

  const totalPrice = Array.isArray(cart)
    ? cart.reduce((total, item) => {
        const price = item.discount
          ? (item.price - (item.price * item.discount) / 100)
          : item.price;
        return total + parseFloat(price);
      }, 0)
    : 0;

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

  return (
    <>
      <SearchNav />
      <div className="bg-[#0f0f10] min-h-[300px] sm:min-h-[500px] md:min-h-screen py-10 text-white">
        <div className="w-[90%] md:max-w-[85%] lg:max-w-[75%] mx-auto mb-6">
          <h1 className="text-2xl sm:text-[40px] font-bold text-[#ffffff] mb-10 text-center md:text-left">
            My Cart
          </h1>
          {baseGameValidation.hasInvalidItems && !baseGameValidation.isChecking && (
            <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-400 font-bold mb-2">
                    Purchasing this item requires based game
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Add the required products to your cart or remove this item to proceed with checkout.
                  </p>

                  <div className="space-y-2">
                    {baseGameValidation.invalidItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-red-900/30 rounded p-2">
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt={item.title} className="w-8 h-12 rounded object-cover" />
                          <div>
                            <p className="text-white text-sm font-semibold">{item.title}</p>
                            <p className="text-gray-400 text-xs font-bold">Requires: {item.baseGameTitle}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigateToBaseGame(item.baseGameId)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-bold underline transition-colors whitespace-nowrap"
                        >
                          View Product
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {cart.length === 0 ? (
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
                Your cart is empty.
              </p>

              <button
                onClick={() => navigate("/")}
                className="bg-[#26bbff] hover:bg-[#00aaff] text-black font-semibold px-6 py-2 rounded-md text-sm transition"
              >
                Shop for Games & Apps
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
              <div className="flex-1 space-y-6">
                {cart.map((item) => (
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
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                          <button
                            onClick={() => removeFromCart(item)}
                            className="text-red-400 md:text-[#ffffffa6] font-semibold hover:text-red-400 transition text-sm text-left"
                          >
                            Remove from Cart
                          </button>

                          <div className="flex gap-2">
                            <button
                              onClick={() => moveToWishlist(item)}
                              className="flex-1 sm:flex-none bg-[#26bbff] hover:bg-[#00aaff] font-semibold text-black px-6 py-2 rounded-md text-sm transition"
                            >
                              Move to Wishlist
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full lg:w-[320px] lg:min-w-[320px]">
                <div className="bg-[#1a1a1e] p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700 sticky top-4">
                  <h2 className="text-xl sm:text-[24px] text-[#fff] font-bold mb-6">
                    Games and Apps Summary
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-300">Price</span>
                      <span className="text-white">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-300">Taxes</span>
                      <span className="text-gray-400 text-xs">Calculated at Checkout</span>
                    </div>
                  </div>
                  
                  <hr className="border-gray-600 my-4" />
                  
                  <div className="flex justify-between font-bold text-base mb-6">
                    <span className="text-white">Subtotal</span>
                    <span className="text-white text-lg">${totalPrice.toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={() => setShowModal(true)} 
                    disabled={baseGameValidation.hasInvalidItems || baseGameValidation.isChecking}
                    className={`w-full font-bold py-3 rounded-md text-sm transition-colors duration-200 shadow-lg ${
                      baseGameValidation.hasInvalidItems || baseGameValidation.isChecking
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-[#26bbff] hover:bg-[#00aaff] text-black hover:shadow-xl'
                    }`}
                  >
                    {baseGameValidation.isChecking 
                      ? 'Checking Requirements...' 
                      : baseGameValidation.hasInvalidItems 
                        ? 'Missing Required Products' 
                        : 'Check Out'
                    }
                  </button>

                  <div className="mt-4 p-3 bg-[#0f0f10] rounded-md">
                    <p className="text-xs text-gray-400 text-center">
                      Epic Games protects your payment information with industry-leading security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <OrderModal subtotal={totalPrice} userId={user.id} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}