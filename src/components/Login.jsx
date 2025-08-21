import { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { userLogin } from "../service.js/authService";
import { GameContext } from "../context/DataContext"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(GameContext); 

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Xanaları doldurun");
      return;
    }

    try {
      const user = await userLogin({ email: email.trim().toLowerCase(), password });
      toast.success("Giriş uğurludur!");

      localStorage.setItem("user", JSON.stringify(user));
      login(user);

      navigate("/");
    } catch {
      toast.error("Email və ya şifrə yalnışdır");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101014] px-4">
      <div className="max-w-md w-full bg-[#18181c] rounded-2xl shadow-lg p-4 md:p-8 border border-gray-500">
        <h1 className="text-[24px] font-bold text-white text-center mb-8">Sign in to Epic Games</h1>
        <form onSubmit={handleLogin} className="space-y-6 border border-gray-500 rounded-xl p-4 bg-[#18181c]">
          <h4 className="text-base text-center text-gray-300 font-semibold">Played on PC or mobile?</h4>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full rounded-md bg-[#242428] border border-gray-500  py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-400"
              placeholder="example@email.com"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-md bg-[#242428] border border-gray-500  py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-400"
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[65%] translate-y-[-50%] text-gray-400 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link
              to="#"
              className="text-[14px] text-[#26bbff] underline font-semibold"
              onClick={(e) => e.preventDefault()}
            >
              Trouble signing in?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#26BBFF] hover:bg-[#61CDFF] text-black font-semibold py-3 rounded-xl transition cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-white bg-[#242428] border border-gray-500 py-3 rounded-md text-[14px] font-semibold">
          New here?{" "}
          <Link to="/signup" className="text-[#26bbff] underline ">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
