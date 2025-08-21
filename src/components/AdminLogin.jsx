import { useContext, useState } from "react";
import { GameContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const { user } = useContext(GameContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("İstifadəçi tapılmadı!");
      return;
    }

    if (user.email === email && user.password === password) {
      if (user.role === "super_admin") {
        localStorage.setItem("admin", JSON.stringify(user));
        toast.success("Admin olaraq giriş edildi!");
        navigate("/admin");
      } else {
        toast.error("Sizin admin giriş icazəniz yoxdur!");
      }
    } else {
      toast.error("Email və ya şifrə yanlışdır!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101014] px-4">
      <div className="max-w-md w-full bg-[#18181c] rounded-2xl shadow-lg p-4 md:p-8 border border-gray-500">
        <h1 className="text-[24px] font-bold text-white text-center mb-8">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6 border border-gray-500 rounded-xl p-4 bg-[#18181c]">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md bg-[#242428] border border-gray-500 py-3 px-4 text-white"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md bg-[#242428] border border-gray-500 py-3 px-4 text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[65%] translate-y-[-50%] text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#26BBFF] hover:bg-[#61CDFF] text-black font-semibold py-3 rounded-xl"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
