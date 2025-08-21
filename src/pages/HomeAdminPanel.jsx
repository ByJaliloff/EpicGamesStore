import React, { useContext, useState, useEffect, useMemo } from 'react';
import { GameContext } from '../context/DataContext';
import { getUserLibrary } from '../service.js/OrderService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

const PlayCircle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>
);

const Image = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
);

const Newspaper = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
  </svg>
);

const Package = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2l3.09 1.26L22 5l-6.16 2.58L12 9l-3.84-1.42L2 5l6.91-1.74L12 2zm0 15l4-1.5v-3L12 14l-4-1.5v3L12 17z"/>
    <path d="M2 12l10 4 10-4v5c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-5z"/>
  </svg>
);

const TrendingUp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
  </svg>
);

const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const Percent = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M7.5 4C5.57 4 4 5.57 4 7.5S5.57 11 7.5 11 11 9.43 11 7.5 9.43 4 7.5 4zM16.5 13c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM19.07 4.93l-14.14 14.14 1.41 1.41L20.48 6.34 19.07 4.93z"/>
  </svg>
);

const LogOut = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  </svg>
);

const MoreHorizontal = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

const Users = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zm-4 6c-4.42 0-8 1.79-8 4v3h16v-3c0-2.21-3.58-4-8-4z"/>
  </svg>
);

const ShoppingBag = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v12z"/>
  </svg>
);

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

import SliderAdminPanel from './SliderAdminPanel';
import NewsAdminPanel from './NewsAdminPanel'; 
import GamesAdminPanel from './GamesAdminPanel';
import DlcAdminPanel from './DlcAdminPanel';

function Dashboard() {
  const { games, slides, dlcs, news, user, allUsers } = useContext(GameContext) || {};
  const [usersWithPurchases, setUsersWithPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const contextGames = games || [];
  const contextSlides = slides || [];
  const contextDlcs = dlcs || [];
  const contextNews = news || [];

  const contextUsers = useMemo(() => {
    if (allUsers) {
      if (Array.isArray(allUsers)) {
        return allUsers;
      } else if (allUsers.users && Array.isArray(allUsers.users)) {
        return allUsers.users;
      } else if (allUsers.data && Array.isArray(allUsers.data)) {
        return allUsers.data;
      } else if (typeof allUsers === 'object') {
        const arrayKeys = Object.keys(allUsers).filter(key => Array.isArray(allUsers[key]));
        if (arrayKeys.length > 0) {
          return allUsers[arrayKeys[0]];
        }
      }
    }

    if (user) {
      if (Array.isArray(user)) {
        return user;
      } else if (user.users && Array.isArray(user.users)) {
        return user.users;
      } else if (user.data && Array.isArray(user.data)) {
        return user.data;
      } else if (typeof user === 'object' && user.id) {
        return [user];
      } else if (typeof user === 'object') {
        const arrayKeys = Object.keys(user).filter(key => Array.isArray(user[key]));
        if (arrayKeys.length > 0) {
          return user[arrayKeys[0]];
        }
      }
    }
    return [];
  }, [allUsers, user]);

  useEffect(() => {
    const fetchUserPurchases = async () => {
      if (!Array.isArray(contextUsers) || contextUsers.length === 0) {
        setUsersWithPurchases([]);
        setLoading(false);
        return;
      }

      try {
        const usersWithLibrary = await Promise.all(
          contextUsers.map(async (user, index) => {
            if (!user || typeof user !== 'object') {
              return {
                id: `invalid_${index}`,
                firstName: 'Invalid',
                lastName: 'User',
                email: 'invalid@user.com',
                role: 'user',
                isActive: false,
                createdAt: new Date(),
                purchasedGames: [],
                purchasedDlcs: [],
                totalItems: 0,
                totalSpent: 0,
                lastPurchase: null
              };
            }

            const safeUser = {
              id: user.id || `user_${index}`,
              firstName: user.firstName || user.first_name || 'Unknown',
              lastName: user.lastName || user.last_name || '',
              email: user.email || 'no-email@provided.com',
              role: user.role || 'user',
              isActive: user.isActive !== undefined ? user.isActive : true,
              createdAt: user.createdAt || user.created_at || new Date(),
              lastLogin: user.lastLogin || user.last_login || null,
              ...user
            };

            if (!safeUser.id) {
              return {
                ...safeUser,
                purchasedGames: [],
                purchasedDlcs: [],
                totalItems: 0,
                totalSpent: 0,
                lastPurchase: null
              };
            }

            try {
              const userLibraryResponse = await getUserLibrary(safeUser.id);
              let gameIds = [];
              if (userLibraryResponse) {
                if (userLibraryResponse.success && userLibraryResponse.gameIds) {
                  gameIds = userLibraryResponse.gameIds;
                } else if (Array.isArray(userLibraryResponse.gameIds)) {
                  gameIds = userLibraryResponse.gameIds;
                } else if (Array.isArray(userLibraryResponse)) {
                  gameIds = userLibraryResponse;
                }
              }

              const purchasedGames = gameIds
                .map(id => contextGames.find(game => game && game.id === id))
                .filter(Boolean);

              const purchasedDlcs = gameIds
                .map(id => contextDlcs.find(dlc => dlc && dlc.id === id))
                .filter(Boolean);
              let totalSpent = 0;
              
              purchasedGames.forEach(game => {
                if (game && typeof game.price === 'number' && !isNaN(game.price)) {
                  const originalPrice = parseFloat(game.price);
                  const discount = parseFloat(game.discount) || 0;
                  const discountedPrice = originalPrice * (1 - discount / 100);
                  totalSpent += discountedPrice;
                } else if (game && game.price) {
                  const price = parseFloat(game.price);
                  if (!isNaN(price)) {
                    const discount = parseFloat(game.discount) || 0;
                    const discountedPrice = price * (1 - discount / 100);
                    totalSpent += discountedPrice;
                  }
                }
              });
              
              purchasedDlcs.forEach(dlc => {
                if (dlc && typeof dlc.price === 'number' && !isNaN(dlc.price)) {
                  const originalPrice = parseFloat(dlc.price);
                  const discount = parseFloat(dlc.discount) || 0;
                  const discountedPrice = originalPrice * (1 - discount / 100);
                  totalSpent += discountedPrice;
                } else if (dlc && dlc.price) {
                  const price = parseFloat(dlc.price);
                  if (!isNaN(price)) {
                    const discount = parseFloat(dlc.discount) || 0;
                    const discountedPrice = price * (1 - discount / 100);
                    totalSpent += discountedPrice;
                  }
                }
              });

              let lastPurchase = null;
              if (purchasedGames.length > 0 || purchasedDlcs.length > 0) {
                lastPurchase = new Date();
              }

              const result = {
                ...safeUser,
                purchasedGames,
                purchasedDlcs,
                totalItems: purchasedGames.length + purchasedDlcs.length,
                totalSpent: Math.round(totalSpent * 100) / 100, 
                lastPurchase
              };
              return result;

            } catch (error) {
              console.error(`❌ Error fetching library for user ${safeUser.id}:`, error);
              return {
                ...safeUser,
                purchasedGames: [],
                purchasedDlcs: [],
                totalItems: 0,
                totalSpent: 0,
                lastPurchase: null
              };
            }
          })
        );
        setUsersWithPurchases(usersWithLibrary);
      } catch (error) {
        console.error('💥 Error fetching user purchases:', error);
        setUsersWithPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPurchases();
  }, [contextUsers, contextGames, contextDlcs]); 

  const filteredGamesForDiscount = contextGames.filter((g) => g && g.discount > 0);
  const filteredDlcsForDiscount = contextDlcs.filter((d) => d && d.discount > 0);

  const totalRevenue = usersWithPurchases.reduce((sum, user) => sum + (user.totalSpent || 0), 0);
  const totalPurchases = usersWithPurchases.reduce((sum, user) => sum + (user.totalItems || 0), 0);

  const stats = [
    {
      title: 'Total Games',
      value: contextGames.length,
      change: '+2.0%',
      changeType: 'positive',
      icon: PlayCircle,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Users',
      value: contextUsers.length,
      change: '+5.2%',
      changeType: 'positive',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Purchases',
      value: totalPurchases,
      change: '+8.1%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'DLC Content',
      value: contextDlcs.length,
      change: '+12%',
      changeType: 'positive',
      icon: Package,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const gameDiscountData = {
    labels: filteredGamesForDiscount.map((g) => g.title || 'Unknown'),
    datasets: [
      {
        label: 'Discount (%)',
        data: filteredGamesForDiscount.map((g) => g.discount || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const gameRatingData = {
    labels: contextGames.map((g) => g.title || 'Unknown'),
    datasets: [
      {
        label: 'Rating (out of 5)',
        data: contextGames.map((g) => g.rating || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const dlcDiscountData = {
    labels: filteredDlcsForDiscount.map((d) => d.title || 'Unknown'),
    datasets: [
      {
        label: 'DLC Discount (%)',
        data: filteredDlcsForDiscount.map((d) => d.discount || 0),
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11,
          },
          maxRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${stat.color} p-6 rounded-xl shadow-lg backdrop-blur-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  <p className="text-white/70 text-sm mt-1">
                    <span className="text-green-200">{stat.change}</span> Last month
                  </p>
                </div>
                <Icon className="w-8 h-8 text-white/60" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredGamesForDiscount.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Percent className="w-5 h-5 mr-2 text-blue-400" />
                Game Discounts
              </h3>
              <button className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="h-64">
              <Bar data={gameDiscountData} options={chartOptions} />
            </div>
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Game Ratings
            </h3>
            <button className="text-gray-400 hover:text-white">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64">
            <Bar data={gameRatingData} options={{...chartOptions, scales: {...chartOptions.scales, y: {...chartOptions.scales.y, max: 5}}}} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {filteredDlcsForDiscount.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-purple-400" />
              DLC Discounts
            </h3>
            <div className="h-48">
              <Doughnut data={dlcDiscountData} options={doughnutOptions} />
            </div>
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-sm">New Game Assets</span>
              </div>
              <span className="text-xs text-gray-400">Validated</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-sm">Slider Images</span>
              </div>
              <span className="text-xs text-yellow-400">Pending</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-sm">DLC Content</span>
              </div>
              <span className="text-xs text-gray-400">Validated</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Free Games</span>
              <span className="font-semibold">{contextGames.filter(g => g && g.price === 0).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Games on Sale</span>
              <span className="font-semibold">{filteredGamesForDiscount.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Avg. Rating</span>
              <span className="font-semibold">
                {contextGames.length > 0 ? 
                  (contextGames.reduce((sum, game) => sum + (game?.rating || 0), 0) / contextGames.length).toFixed(1) 
                  : '0.0'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Total Revenue</span>
              <span className="font-semibold text-green-400">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold flex items-center">
            <Users className="w-6 h-6 mr-3 text-blue-400" />
            Users & Their Game Libraries
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Total Users: {usersWithPurchases.length}</span>
            <span>•</span>
            <span>Active Buyers: {usersWithPurchases.filter(u => u.totalItems > 0).length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <span className="ml-4 text-gray-300 text-lg">Loading user libraries...</span>
          </div>
        ) : usersWithPurchases.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {usersWithPurchases.map((user) => (
                <div
                  key={user.id}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className={`w-14 h-14 ${user.role === 'super_admin' ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 
                         user.email ? user.email.charAt(0).toUpperCase() : '?'}
                      </div>
                      {user.role === 'super_admin' && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                      )}
                      {user.totalItems > 0 && user.role !== 'super_admin' && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-white text-lg">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.role === 'super_admin' 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {user.role === 'super_admin' ? 'Admin' : 'User'}
                        </span>
                        <span className={`ml-2 w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{user.purchasedGames?.length || 0}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Games</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{user.purchasedDlcs?.length || 0}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">DLCs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">${(user.totalSpent || 0).toFixed(0)}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Spent</div>
                    </div>
                  </div>

                  {user.purchasedGames && user.purchasedGames.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300 flex items-center">
                          <PlayCircle className="w-4 h-4 mr-1 text-blue-400" />
                          Owned Games
                        </span>
                        <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
                          {user.purchasedGames.length}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {user.purchasedGames.slice(0, 3).map((game, index) => (
                          <div key={game.id || index} className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 truncate flex-1 mr-2">{game.title || 'Unknown Game'}</span>
                            <span className="text-green-400 font-medium">
                              ${game.discount > 0 
                                ? ((game.price || 0) * (1 - (game.discount || 0) / 100)).toFixed(0)
                                : (game.price || 0).toFixed(0)
                              }
                            </span>
                          </div>
                        ))}
                        {user.purchasedGames.length > 3 && (
                          <div className="text-xs text-gray-500 text-center pt-1">
                            +{user.purchasedGames.length - 3} more games
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {user.purchasedDlcs && user.purchasedDlcs.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300 flex items-center">
                          <Package className="w-4 h-4 mr-1 text-purple-400" />
                          DLC Content
                        </span>
                        <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                          {user.purchasedDlcs.length}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {user.purchasedDlcs.slice(0, 2).map((dlc, index) => (
                          <div key={dlc.id || index} className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 truncate flex-1 mr-2">{dlc.title || 'Unknown DLC'}</span>
                            <span className="text-green-400 font-medium">
                              ${dlc.discount > 0 
                                ? ((dlc.price || 0) * (1 - (dlc.discount || 0) / 100)).toFixed(0)
                                : (dlc.price || 0).toFixed(0)
                              }
                            </span>
                          </div>
                        ))}
                        {user.purchasedDlcs.length > 2 && (
                          <div className="text-xs text-gray-500 text-center pt-1">
                            +{user.purchasedDlcs.length - 2} more DLCs
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(!user.totalItems || user.totalItems === 0) && (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ShoppingBag className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-gray-500 text-sm">No purchases yet</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-700/30">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        {user.lastLogin ? 
                          `Last login: ${new Date(user.lastLogin).toLocaleDateString()}` : 
                          'Never logged in'
                        }
                      </span>
                      <span className="text-xs text-gray-500">
                        Joined: {new Date(user.createdAt || new Date()).toLocaleDateString()}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white">{usersWithPurchases.length}</div>
                    <div className="text-blue-200 text-sm mt-1">Total Users</div>
                    <div className="text-xs text-blue-300 mt-1">
                      {usersWithPurchases.filter(u => u.role === 'super_admin').length} Admin(s)
                    </div>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600/20 to-emerald-800/20 backdrop-blur-xl rounded-xl border border-green-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {usersWithPurchases.reduce((sum, user) => sum + (user.purchasedGames?.length || 0), 0)}
                    </div>
                    <div className="text-green-200 text-sm mt-1">Games Sold</div>
                    <div className="text-xs text-green-300 mt-1">
                      {usersWithPurchases.filter(u => (u.purchasedGames?.length || 0) > 0).length} buyers
                    </div>
                  </div>
                  <PlayCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {usersWithPurchases.reduce((sum, user) => sum + (user.purchasedDlcs?.length || 0), 0)}
                    </div>
                    <div className="text-purple-200 text-sm mt-1">DLCs Sold</div>
                    <div className="text-xs text-purple-300 mt-1">
                      {usersWithPurchases.filter(u => (u.purchasedDlcs?.length || 0) > 0).length} buyers
                    </div>
                  </div>
                  <Package className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-600/20 to-orange-800/20 backdrop-blur-xl rounded-xl border border-amber-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      ${totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-amber-200 text-sm mt-1">Total Revenue</div>
                    <div className="text-xs text-amber-300 mt-1">
                      Avg: ${usersWithPurchases.length > 0 ? 
                        (totalRevenue / (usersWithPurchases.filter(u => (u.totalSpent || 0) > 0).length || 1)).toFixed(0) : 
                        '0'
                      } per buyer
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-amber-400" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-400 mb-2">No Users Found</h3>
            <p className="text-gray-500 text-sm">
              Debug Info - allUsers type: {typeof allUsers} | user type: {typeof user} | contextUsers length: {contextUsers.length}
            </p>
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg text-left">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Debug Data Structure:</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <div>allUsers: {allUsers ? JSON.stringify(Object.keys(allUsers), null, 2) : 'null'}</div>
                <div>user: {user ? JSON.stringify(Object.keys(user), null, 2) : 'null'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeAdminPanel() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'sliders', label: 'Sliders', icon: Image },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'games', label: 'Games', icon: PlayCircle },
    { id: 'dlc', label: 'DLC', icon: Package },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'sliders':
        return <SliderAdminPanel />;
      case 'games':
        return <GamesAdminPanel />;
      case 'news':
        return <NewsAdminPanel />;
      case 'dlc':
        return <DlcAdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="fixed left-0 top-0 w-64 h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 z-50">
        <div className="flex items-center justify-center py-6 border-b border-gray-700/50 h-[85px]">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Epic_Games_logo.svg/1200px-Epic_Games_logo.svg.png"
            alt="Epic Games"
            className="w-12 h-14"
          />
          <span className="ml-3 text-xl font-bold">Epic Games</span>
        </div>

        <nav className="mt-8 px-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="ml-64 pt-[85px]">
        <main>
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default HomeAdminPanel;