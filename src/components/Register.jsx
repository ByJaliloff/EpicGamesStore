import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSignUp } from "../service.js/authService";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Bütün sahələri doldurun.");
      return false;
    }
    if (form.password.length < 8) {
      toast.error("Şifrə ən azı 8 simvol olmalıdır.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Şifrələr uyğun deyil.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newUser = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: "user",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    try {
      await userSignUp(newUser);
      toast.success("Qeydiyyat uğurludur!");
      navigate("/signin");
    } catch (err) {
      toast.error(err.message || "Qeydiyyat zamanı xəta baş verdi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101014] px-4">
      <div className="max-w-md w-full bg-[#18181c] rounded-lg shadow-lg p-4 md:p-6 border border-gray-500">
        <h1 className="text-[24px] font-semibold mb-6 text-white text-center">Create Your Epic Account</h1>

        <form onSubmit={handleSubmit} className="space-y-5 border border-gray-500 rounded-xl p-4 bg-[#18181c]">
          <h4 className="text-base text-center text-gray-300 font-semibold">Played on PC or mobile?</h4>
          <div className="flex gap-4">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-1/2 px-4 py-3 rounded-md bg-[#242428] border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-400"
              autoComplete="given-name"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-1/2 px-4 py-3 rounded-md bg-[#242428] border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-400"
              autoComplete="family-name"
            />
          </div>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md bg-[#242428] border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-400"
            autoComplete="email"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md bg-[#242428] border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-400"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-md bg-[#242428] border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-400"
              autoComplete="new-password"
            />
            <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-white"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#26BBFF] hover:bg-[#61CDFF] text-black font-semibold py-3 rounded-xl transition cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-white bg-[#242428] border border-gray-500 py-3 rounded-md text-[14px] font-semibold">
          Already have an account?{" "}
          <a href="/signin" className="text-[#26bbff] underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
