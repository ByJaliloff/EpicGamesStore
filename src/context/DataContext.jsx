import { createContext, useEffect, useState } from "react";
import {
  getAllGame,
  getAllDlc,
  getAllAchievement,
  getAllSlide,
  getAllNews,
  getAllFreeGames
} from "../service.js/GameService";

import { getAllUsers } from "../service.js/authService"; 

// 1. Context yaradılır
export const GameContext = createContext();

export function GameProvider({ children }) {
  const [games, setGames] = useState([]);
  const [dlcs, setDlcs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [slides, setSlides] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freegames, setFreegames] = useState([]);
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {

        
        const [gamesData, dlcData, achievementData, slideData, newsData, usersData, freegamesData] =
          await Promise.all([
            getAllGame(),
            getAllDlc(),
            getAllAchievement(),
            getAllSlide(),
            getAllNews(),
            getAllUsers(),
            getAllFreeGames() 
          ]);

        setGames(gamesData || []);
        setDlcs(dlcData || []);
        setAchievements(achievementData || []);
        setSlides(slideData || []);
        setNews(newsData || []);
        setAllUsers(usersData || []);
        setFreegames(freegamesData || []) 
        setLoading(false);
        setError(null); 
        
      } catch (err) {
        console.error('=== ERROR FETCHING DATA ===', err);
        setError("Məlumatlar yüklənərkən xəta baş verdi.");
        
        setTimeout(() => {
          fetchData(); 
        }, 10000); 
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    if (user) {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const moveToWishlist = (item) => {
    if (!user) return;
    
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
    const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];

    const isInWishlist = wishlist.some((w) => w.id === item.id);
    if (!isInWishlist) {
      wishlist.push(item);
    }

    const updatedCart = cart.filter((c) => c.id !== item.id);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
    window.location.reload();
  };

  useEffect(() => {
  }, [user, allUsers, games, loading, error]);

  return (
    <GameContext.Provider
      value={{
        games,
        dlcs,
        achievements,
        slides,
        news,
        loading,
        error,
        freegames,
        moveToWishlist,
        user,         
        allUsers,     
        login,
        logout,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}