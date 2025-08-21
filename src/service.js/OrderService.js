import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function calculateFinalPrice(item, promoDiscountPercent = 0) {
  let finalPrice = item.price;

  if (item.discount > 0) {
    finalPrice = finalPrice - (finalPrice * item.discount / 100);
  }

  if (promoDiscountPercent > 0) {
    finalPrice = finalPrice - (finalPrice * promoDiscountPercent / 100);
  }
  
  return parseFloat(finalPrice.toFixed(2));
}

export const getUserLibrary = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/purchases`);
    const allPurchases = res.data;
    
    const userGameIds = new Set();

    allPurchases.forEach(purchase => {
      if (purchase.userId === userId && purchase.gameId) {
        userGameIds.add(purchase.gameId);
      }
      else if (purchase.orders && Array.isArray(purchase.orders)) {
        purchase.orders.forEach(order => {
          if (order.userId === userId && order.gameId) {
            userGameIds.add(order.gameId);
          }
        });
      }
    });
    
    return { success: true, gameIds: Array.from(userGameIds) };
  } catch (err) {
    console.error("Failed to fetch user library:", err.message);
    return { success: false, error: err.message, gameIds: [] };
  }
};

export const isGameInLibrary = async (userId, gameId) => {
  try {
    const library = await getUserLibrary(userId);
    return library.success ? library.gameIds.includes(gameId) : false;
  } catch (error) {
    console.error('Failed to check if game is in library:', error);
    return false;
  }
};

export const areGamesInLibrary = async (userId, gameIds) => {
  try {
    const library = await getUserLibrary(userId);
    if (!library.success) return {};
    
    const result = {};
    gameIds.forEach(gameId => {
      result[gameId] = library.gameIds.includes(gameId);
    });
    
    return result;
  } catch (error) {
    console.error('Failed to check games in library:', error);
    return {};
  }
};

export function createOrderData(cartItems, userId, promoDiscountPercent = 0) {
  const orders = cartItems.map(item => ({
    id: generateUUID(),
    userId: userId,
    gameId: item.id,
    price: calculateFinalPrice(item, promoDiscountPercent),
    purchaseDate: new Date().toISOString()
  }));
  
  return orders;
}

export const submitOrders = async (orders) => {
  try {
    const res = await axios.post(`${BASE_URL}/purchases`, { orders });
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Sifariş göndərilirkən xəta:", err.message);
    return { success: false, error: err.message };
  }
};

export function clearCart(userId) {
  try {
    localStorage.removeItem(`cart_${userId}`);
    return true;
  } catch (error) {
    console.error('Failed to clear cart:', error);
    return false;
  }
}

export async function processOrder(cartItems, userId, promoDiscountPercent = 0) {
  try {
    const gameIds = cartItems.map(item => item.id);
    const libraryCheck = await areGamesInLibrary(userId, gameIds);

    const itemsToPurchase = cartItems.filter(item => !libraryCheck[item.id]);
    
    if (itemsToPurchase.length === 0) {
      return { 
        success: false, 
        error: "All games are already in your library",
        alreadyOwned: cartItems.map(item => item.id)
      };
    }
    
    const alreadyOwnedItems = cartItems.filter(item => libraryCheck[item.id]);
    if (alreadyOwnedItems.length > 0) {
      console.warn('Some games already owned:', alreadyOwnedItems.map(item => item.title));
    }

    const orders = createOrderData(itemsToPurchase, userId, promoDiscountPercent);

    const result = await submitOrders(orders);
    
    if (result.success) {
      clearCart(userId);
      return { 
        success: true, 
        orders, 
        data: result.data,
        purchasedItems: itemsToPurchase,
        alreadyOwnedItems
      };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Order processing failed:', error);
    return { success: false, error: error.message };
  }
}