import { useContext, useState, useMemo, useEffect } from "react";
import { GameContext } from "../context/DataContext";
import { processOrder } from "../service.js/OrderService";

export default function OrderModal({ subtotal, onClose, userId, game }) {
  const { games, dlcs } = useContext(GameContext);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    if (game) {
      setCartItems([game]); 
      return;
    }

    if (!userId || games.length === 0 || dlcs.length === 0) return;

    const savedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

    const items = savedCart
      .map((item) => {
        if (item && item.id) {
          const foundGame = games.find((g) => String(g.id) === String(item.id));
          if (foundGame) return foundGame;
          
          const foundDlc = dlcs.find((d) => String(d.id) === String(item.id));
          if (foundDlc) return foundDlc;
        }
        
        if (typeof item === "string") {
          const foundGame = games.find((g) => String(g.id) === String(item));
          if (foundGame) return foundGame;
          
          const foundDlc = dlcs.find((d) => String(d.id) === String(item));
          if (foundDlc) return foundDlc;
        }
        
        return null;
      })
      .filter(Boolean);

    setCartItems(items);
  }, [game, userId, games, dlcs]);

  const handlePromoApply = () => {
    if (promoCode.trim().toLowerCase() === "orxan50") {
      setDiscountPercent(50);
    } else {
      setDiscountPercent(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsLoading(true);
    setOrderStatus(null);

    try {
      const result = await processOrder(cartItems, userId, discountPercent);
      
      if (result.success) {
        setOrderStatus('success');
        console.log('Orders created:', result.orders);

        if (game) {
          const savedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
          console.log('Before filtering - savedCart:', savedCart);
          console.log('Game to remove ID:', game.id);
          
          const updatedCart = savedCart.filter(item => {
            const itemId = item.id;
            const shouldKeep = String(itemId) !== String(game.id);
            console.log(`Item ID: ${itemId}, Keep: ${shouldKeep}`);
            return shouldKeep;
          });
          
          localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
          console.log('After filtering - updatedCart:', updatedCart);
        } else {
          const savedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
          const purchasedItemIds = cartItems.map(item => String(item.id));
          console.log('Purchased item IDs:', purchasedItemIds);
          
          const updatedCart = savedCart.filter(item => {
            const itemId = String(item.id);
            return !purchasedItemIds.includes(itemId);
          });
          
          localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
          console.log('Basket purchase - Updated cart:', updatedCart);
        }
        
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      } else {
        setOrderStatus('error');
        console.error('Order failed:', result.error);
      }
    } catch (error) {
      setOrderStatus('error');
      console.error('Order processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAfterDiscount = useMemo(() => {
    return (subtotal - (subtotal * discountPercent) / 100).toFixed(2);
  }, [subtotal, discountPercent]);

  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent / 100).toFixed(2);
  }, [subtotal, discountPercent]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600/30 backdrop-blur-lg z-70">
      <div className="bg-[#F2F2F2] w-[480px] max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">ORDER SUMMARY</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col max-h-[calc(90vh-80px)]">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your basket is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.cover || item.image}
                        alt={item.name || item.title}
                        className="w-24 h-32 object-cover rounded"
                      />
                      {item.discount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold">
                          -{item.discount}%
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {item.name || item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.developer || item.publisher || 'Electronic Arts'}
                      </p>
                      <div className="flex items-center gap-2">
                        {item.discount > 0 ? (
                          <>
                            <span className="line-through text-gray-400">
                              ${item.price}
                            </span>
                            <span className="font-bold text-lg">
                              ${(item.price - (item.price * item.discount) / 100).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-lg">
                            ${item.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Price</span>
                  <span>${subtotal}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Sale Discount</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-300">
                <span>Total</span>
                <span>${totalAfterDiscount}</span>
              </div>

              <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded px-3 py-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">★</span>
                </div>
                <span className="text-sm text-gray-800">
                  <strong>Earn ${(parseFloat(totalAfterDiscount) * 0.05).toFixed(2)}</strong> in Epic Rewards with this purchase.
                </span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Details:</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Credit Card / Debit Card</span>
                <span className="font-bold">${totalAfterDiscount}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter creator code"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">i</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handlePromoApply}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 text-xs text-gray-600 border-t border-gray-200 font-semibold">
            <p className="mb-2">
              You are purchasing a digital license for this product. For full terms, see{" "}
              <a href="#" className="text-blue-600 hover:underline">
                purchase policy
              </a>
              .
            </p>
            <p>
              By selecting 'Place Order' below, you certify that you are over 18 and an authorized user of this payment method, and agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                End User License Agreement
              </a>
              .
            </p>
          </div>
          <div className="px-6 py-4 bg-gray-100">
            {orderStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                Order placed successfully! Redirecting...
              </div>
            )}
            {orderStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                Failed to place order. Please try again.
              </div>
            )}
            <button 
              onClick={handlePlaceOrder}
              disabled={isLoading || cartItems.length === 0}
              className={`w-full py-4 rounded font-bold text-lg transition-colors ${
                isLoading || cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}