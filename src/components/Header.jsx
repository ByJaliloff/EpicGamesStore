import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiGlobe } from "react-icons/fi";
import { GameContext } from "../context/DataContext";
import "../header.css";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [epicMobileMenuOpen, setEpicMobileMenuOpen] = useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);

  const { user, logout } = useContext(GameContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    if (isMobileMenuOpen || epicMobileMenuOpen || isMobileAccountOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen, epicMobileMenuOpen, isMobileAccountOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setEpicMobileMenuOpen(false);
        setIsMobileAccountOpen(false);
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isUserMenuOpen]);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 150); 
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const closeMobileAccount = () => {
    setIsMobileAccountOpen(false);
  };

  return (
    <header className="bg-[#131317] text-white h-[72px] shadow-md relative z-60">
      <div className="max-w-[95%] md:max-w-[97%] mx-auto h-full flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div 
            className="relative" 
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setEpicMobileMenuOpen(true);
                }
              }}
              className="flex items-center space-x-1 p-[6px] rounded cursor-pointer"
            >
              <img
                src="/icons/epic-logo.png"
                alt="Epic Games Logo"
                className="w-7 h-8"
              />
              <span className="text-base ml-1">{isDropdownOpen ? "▴" : "▾"}</span>
            </button>
            {isDropdownOpen && window.innerWidth >= 768 && (
              <div className="absolute top-full left-1 mt-[2px]  text-sm text-white rounded-xl shadow-lg w-[700px] grid grid-cols-2 p-6 gap-4 z-50"
              style={{
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(32, 32, 36, 0.7)',
                backdropFilter: 'blur(75px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}>
                <div className="grid grid-cols-1 gap-6">
                  <div className="border-b">
                    <h4 className="text-white font-bold mb-2 text-[20px]">Play</h4>
                    <ul className="space-y-4 font-semibold">
                      <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/fortnite.svg" className="w-4 h-4" /> Fortnite</Link></li>
                      <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/Logo Rocket League Icon.svg" className="w-4 h-4" /> Rocket League</Link></li>
                      <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/Fallguys.svg" className="w-4 h-4" /> Fall Guys</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2 text-[20px]">Discover</h4>
                    <ul className="space-y-4 font-semibold">
                      <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/epic-logo.png" className="w-4 h-4" /> Epic Games Store</Link></li>
                      <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/Logo Fab Icon.svg" className="w-4 h-4" /> Fab</Link></li>
                      <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/LSketchfab.svg" className="w-4 h-4" /> Sketchfab</Link></li>
                      <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/ArtStation.svg" className="w-4 h-4" /> ArtStation</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="border-l pl-4">
                  <h4 className="text-white font-bold mb-2 text-[20px]">Create</h4>
                  <ul className="space-y-4 font-semibold">
                    <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/unreal.svg" className="w-4 h-4" /> Unreal Engine</Link></li>
                    <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/fortnite.svg" className="w-4 h-4" /> Create in Fortnite</Link></li>
                    <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/Metahuman.svg" className="w-4 h-4" /> MetaHuman</Link></li>
                    <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/Twinmotion.svg" className="w-4 h-4" /> Twinmotion</Link></li>
                    <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/Reality.can.svg" className="w-4 h-4" /> RealityScan</Link></li>
                    <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/epic-logo.png" className="w-4 h-4" /> Epic Online Services</Link></li>
                    <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/epic-logo.png" className="w-4 h-4" /> Publish on Epic Games Store</Link></li>
                    <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/Webservice.svg" className="w-4 h-4" /> Kids Web Services</Link></li>
                    <li><Link to="#" className="hover:underline flex items-center gap-2"><img src="/icons/epic-logo.png" className="w-4 h-4" /> Developer Community</Link></li>
                  </ul>
                </div>
              </div>
            )}
            {epicMobileMenuOpen && (
              <div className="fixed inset-0 bg-[#101014] text-white z-50 flex flex-col px-4 h-screen overflow-y-auto animate-slideInDown">
                {/* Top Bar */}
                <div className="flex justify-between items-center animate-fadeInDown">
                  <div className="flex items-center space-x-2 h-[72px]">
                    <img src="/icons/epic-logo.png" alt="Epic Games Logo" className="w-7 h-8" />
                    <span className="text-base ml-1" onClick={() => setEpicMobileMenuOpen(false)}>
                      {epicMobileMenuOpen ? "▴" : "▾"}
                    </span>
                  </div>
                  <button 
                    onClick={() => setEpicMobileMenuOpen(false)} 
                    className="text-2xl hover:text-red-400 transition-colors duration-200 transform hover:rotate-90"
                  >
                    ✕
                  </button>
                </div>
                <div className="py-4 flex flex-col gap-8">
                  <h2 className="text-[32px] font-extrabold animate-fadeInLeft">Epic Games</h2>
                  
                  <div className="animate-fadeInLeft delay-100">
                    <h3 className="text-xl font-bold mb-4">Play</h3>
                    <ul className="text-base font-medium">
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-200">
                        <img src="/icons/fortnite.svg" className="w-5 h-5" />
                        <span>Fortnite</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-300">
                        <img src="/icons/Logo Rocket League Icon.svg" className="w-5 h-5" />
                        <span>Rocket League</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-400">
                        <img src="/icons/Fallguys.svg" className="w-5 h-5" />
                        <span>Fall Guys</span>
                      </li>
                    </ul>
                  </div>

                  <div className="animate-fadeInLeft delay-200">
                    <h3 className="text-xl font-bold mb-4">Discover</h3>
                    <ul className="text-base font-medium">
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-500">
                        <img src="/icons/epic-logo.png" className="w-5 h-5" />
                        <span>Epic Games Store</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-600">
                        <img src="/icons/Logo Fab Icon.svg" className="w-5 h-5" />
                        <span>Fab</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-700">
                        <img src="/icons/LSketchfab.svg" className="w-5 h-5" />
                        <span>Sketchfab</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-800">
                        <img src="/icons/ArtStation.svg" className="w-5 h-5" />
                        <span>ArtStation</span>
                      </li>
                    </ul>
                  </div>

                  <div className="animate-fadeInLeft delay-300">
                    <h3 className="text-xl font-bold mb-4">Create</h3>
                    <ul className="text-base font-medium">
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-900">
                        <img src="/icons/unreal.svg" className="w-5 h-5" />
                        <span>Unreal Engine</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-1000">
                        <img src="/icons/fortnite.svg" className="w-5 h-5" />
                        <span>Create in Fortnite</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-1100">
                        <img src="/icons/Metahuman.svg" className="w-5 h-5" />
                        <span>MetaHuman</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-1200">
                        <img src="/icons/Twinmotion.svg" className="w-5 h-5" />
                        <span>Twinmotion</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-1300">
                        <img src="/icons/Reality.can.svg" className="w-5 h-5" />
                        <span>RealityScan</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-1400">
                        <img src="/icons/epic-logo.png" className="w-5 h-5" />
                        <span>Epic Online Services</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-1500">
                        <img src="/icons/epic-logo.png" className="w-5 h-5" />
                        <span>Publish on Epic Games Store</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-1600">
                        <img src="/icons/Webservice.svg" className="w-5 h-5" />
                        <span>Kids Web Services</span>
                      </li>
                      <li className="flex items-center gap-3 py-3 px-2 hover:bg-gray-800/50 rounded-md transition-colors duration-200 animate-slideInLeft delay-1700">
                        <img src="/icons/epic-logo.png" className="w-5 h-5" />
                        <span>Developer Community</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <Link to="/" className="hover:text-gray-300">
              <img src="/icons/store.svg" alt="Store" className="w-14 h-14" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center text-sm font-semibold">
            <Link to="/support" className="hover:text-gray-300 p-[10px_12px]">Support</Link>
            <div className="relative group">
              <button className="hover:text-gray-300 p-[10px_12px]">Distribute ▾</button>
            </div>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-xl hover:text-gray-300 hidden md:flex">
            <FiGlobe className="w-5 h-5" />
          </button>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded hover:text-gray-300 transition"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-[#26bbff] text-black font-bold rounded-full">
                  {user.firstName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold">
                  {user.firstName}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-54  rounded-xl  shadow-lg overflow-hidden z-50 p-2"
                style={{
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(32, 32, 36, 0.7)',
                backdropFilter: 'blur(75px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}>
                  <Link className="block px-3 py-2.5 text-base hover:bg-[#48484B] rounded-md">
                    My Achievement
                  </Link>
                  <Link className="block px-3 py-2.5 text-base hover:bg-[#48484B] rounded-md">
                    Epic Rewards
                  </Link>
                  <Link className="block px-3 py-2.5 text-base hover:bg-[#48484B] rounded-md">
                    Account Balance
                  </Link>
                  <Link className="block px-3 py-2.5 text-base hover:bg-[#48484B] rounded-md">
                    Coupons
                  </Link>
                  <Link className="block px-3 py-2.5 text-base hover:bg-[#48484B] rounded-md">
                    Redeem Code
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-3 py-2.5 text-base hover:bg-[#48484B] rounded-md"
                  >
                    Wishlist
                  </Link>
                  {user && (
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-base text-red-500 font-semibold hover:bg-[#48484B] rounded-md"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="hidden md:inline bg-[#2a2a2a] text-white text-sm px-3 py-2 rounded hover:bg-[#3a3a3a] transition"
            >
              Sign in
            </Link>
          )}

          <a
          href="https://store.epicgames.com/en-US/download"
          className="bg-[#26bbff] text-black font-semibold text-sm px-3 py-1.5 rounded hover:bg-[#00aaff] transition"
        >
          <span className="block md:hidden">Install</span> 
          <span className="hidden md:block">Download</span>
        </a>
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      {isMobileAccountOpen && (
        <div className="fixed inset-0 bg-[#131317] text-white z-50 animate-slideInDown flex flex-col">
          <div className="flex justify-between items-center px-4 h-[72px] bg-[#131317] flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={closeMobileAccount} className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-lg font-medium">Back</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-[#26bbff] text-black font-semibold text-sm px-3 py-1.5 rounded hover:bg-[#00aaff] transition">
                Install
              </button>
              <button onClick={closeMobileAccount} className="text-2xl hover:text-red-400 transition-colors duration-200">
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-8">
              <h1 className="text-[32px] font-bold mb-6">Account</h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 flex items-center justify-center bg-[#26bbff] text-black font-bold rounded-full text-xl">
                  {user.firstName.charAt(0).toUpperCase()}
                </div>
                <span className="text-lg font-medium">{user.firstName}</span>
              </div>
            </div>
            <div className="space-y-0">
              <Link 
                className="block py-4 text-base font-semibold hover:bg-gray-800/30 rounded-md px-2 transition-colors duration-200"
              >
                My Achievements
              </Link>
              
              <Link 
                className="block py-4 text-base font-semibold hover:bg-gray-800/30 rounded-md px-2 transition-colors duration-200"
              >
                Epic Rewards
              </Link>
              
              <Link 
                className="block py-4 text-base font-semibold hover:bg-gray-800/30 rounded-md px-2 transition-colors duration-200"
              >
                Account Balance
              </Link>
              
              <Link 
                className="block py-4 text-base font-semibold hover:bg-gray-800/30 rounded-md px-2 transition-colors duration-200"
              >
                Coupons
              </Link>

              <Link 
                className="block py-4 text-base font-semibold hover:bg-gray-800/30 rounded-md px-2 transition-colors duration-200"
              >
                Account
              </Link>
              
              <Link 
                className="block py-4 text-base font-semibold hover:bg-gray-800/30 rounded-md px-2 transition-colors duration-200"
              >
                Redeem Code
              </Link>
              
              <Link 
                className="block py-4 text-base font-semibold hover:bg-gray-800/30 rounded-md px-2 transition-colors duration-200"
              >
                Redeem Fortnite Gift Card
              </Link>

              <Link 
                to="/wishlist" 
                onClick={closeMobileAccount}
                className="block py-4 text-base font-semibold hover:bg-gray-800/30 rounded-md px-2 transition-colors duration-200"
              >
                Wishlist
              </Link>

              <button
                onClick={() => {
                  logout();
                  closeMobileAccount();
                }}
                className="w-full text-left py-4 text-base font-semibold text-red-500 font-semibold hover:bg-gray-800/30 rounded-md px-2 transition-colors duration-200 mb-8"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#101014] text-white z-50 p-4 pt-0 animate-slideInDown">
          <div className="flex justify-between items-center h-[72px] animate-fadeInDown">
            <img 
              src="/icons/store.svg" 
              alt="Store" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="w-14 h-14 cursor-pointer" 
            />
            <div className="flex items-center gap-4">
              <a
                href="https://store.epicgames.com/en-US/download"
                className="bg-[#26bbff] text-black font-semibold text-sm px-3 py-1.5 rounded hover:bg-[#00aaff] w-fit transition"
              >
                Install
              </a>
              <button
                className="text-2xl hover:text-red-400 transition-colors duration-200 transform hover:rotate-90"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-auto h-[44px] animate-fadeInUp">
            <div className="flex items-center gap-3">
              <button className="text-white">
                <FiGlobe className="w-5 h-5" />
              </button>
              {user ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsMobileAccountOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:text-gray-300 transition"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-[#26bbff] text-black font-bold rounded-full">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="bg-[#2a2a2a] text-white text-sm px-3 py-2 rounded hover:bg-[#3a3a3a] transition"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col mb-6 pt-4 animate-fadeInLeft">
            <h3 className="text-[32px] font-bold mb-6">Menu</h3>
            <Link className="hover:text-gray-300 text-base font-semibold p-[12px_8px] hover:bg-gray-700/50 rounded-md transition-all duration-200 animate-slideInLeft delay-100">
              Support
            </Link>
            <Link className="hover:text-gray-300 flex justify-between text-base font-semibold p-[12px_8px] hover:bg-gray-700/50 rounded-md transition-all duration-200 animate-slideInLeft delay-200">
              Distribute <span>›</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;