import React from 'react';
import { FaUserAstronaut } from 'react-icons/fa';

function AdminPanelHeader() {
  return (
    <header className="fixed top-0 left-64 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 h-[85px] px-8 py-4 z-[60]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white animate-pulse">
            🚀 Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm animate-typing overflow-hidden whitespace-nowrap border-r-2 border-gray-400 pr-1">
            Welcome back, Commander Orxan!
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-gradient-xy bg-[length:200%_200%] transition-transform duration-300 group-hover:scale-110">
              <FaUserAstronaut className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 animate-gradient-xy bg-[length:200%_200%]">
                Orxan
              </p>
              <p className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300">
                Galactic Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .animate-typing {
          animation: typing 2s steps(30, end) forwards;
        }
        @keyframes gradient-xy {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-xy {
          animation: gradient-xy 3s ease infinite;
        }
      `}</style>
    </header>
  );
}

export default AdminPanelHeader;
