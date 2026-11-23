
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

import sky from "../../../../assets/header/sky.svg";
import stars from "../../../../assets/header/stars.svg";
import mountainsBack from "../../../../assets/header/mountains-back.svg";
import mountainsFront from "../../../../assets/header/mountains-front.svg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (loginError) throw loginError;

      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("role")
        .eq("auth_user_id", data.user.id)
        .single();

      if (accountError) throw accountError;

      if (account.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin accounts only.");
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] bg-[#f8f9fc] font-sans">

      {/* LEFT HERO PANEL */}
      <section className="relative min-h-[390px] lg:min-h-screen overflow-hidden bg-[#292d45] px-7 py-8 lg:px-[7%] lg:py-[42px] text-white">

        <img src={sky} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        <img src={stars} alt="" className="absolute top-0 left-0 w-full h-[65%] object-contain object-top pointer-events-none" />
        <img src={mountainsBack} alt="" className="absolute bottom-0 left-0 w-full h-auto pointer-events-none" />
        <img src={mountainsFront} alt="" className="absolute bottom-0 left-0 w-full h-auto pointer-events-none" />

        <header className="relative z-10 flex items-center gap-3">
          <div className="w-[43px] h-[43px] grid place-items-center rounded-xl bg-[#d9b77d] text-[#292d45] text-[15px] font-extrabold">
            OF
          </div>
          <div>
            <strong className="block text-[19px] tracking-wide">OrgFinder</strong>
            <small className="block mt-0.5 text-[11px] text-[#c5cde2]">
              Student organization hub
            </small>
          </div>
        </header>

        <div className="relative z-10 max-w-[570px] mt-[60px] lg:mt-[145px]">
          <p className="text-[#d9b77d] text-[11px] font-bold tracking-[2px]">
            YOUR CAMPUS. YOUR COMMUNITY.
          </p>

          <h1 className="max-w-[530px] mt-[18px] mb-[18px] text-[36px] sm:text-[42px] lg:text-[55px] leading-[1.13] font-bold">
            Manage your campus community in one place.
          </h1>

          <p className="max-w-[470px] text-[13px] sm:text-[15px] leading-[1.8] text-[#c5cde2]">
            Welcome to the OrgFinder administration portal. Sign in to manage
            organizations, accounts, vacancies, and announcements.
          </p>
        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <section className="flex items-center justify-center min-h-[520px] px-6 py-12 sm:px-12 bg-[#f8f9fc]">
        <div className="w-full max-w-[420px]">

          <div className="flex items-center gap-2 mb-[25px] text-[#777f96] text-[10px] font-bold tracking-[1.5px]">
            <span className="w-2 h-2 rounded-full bg-[#46a47b]" />
            ADMINISTRATOR ACCESS
          </div>

          <h2 className="text-[32px] font-bold text-[#292d45]">
            Welcome back
          </h2>

          <p className="mt-3 mb-[35px] text-sm leading-relaxed text-[#858ba0]">
            Sign in to your OrgFinder admin account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col">

            <label htmlFor="email" className="mb-[9px] text-[13px] font-semibold text-[#34384f]">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[49px] px-[15px] mb-6 rounded-lg border border-[#dfe2eb] bg-white text-[13px] text-[#292d45] outline-none placeholder:text-[#a5aabb] focus:border-[#d9b77d] focus:ring-2 focus:ring-[#d9b77d]/20"
            />

            <label htmlFor="password" className="mb-[9px] text-[13px] font-semibold text-[#34384f]">
              Password
            </label>

            <div className="relative mb-6">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-[49px] px-[15px] pr-[65px] rounded-lg border border-[#dfe2eb] bg-white text-[13px] text-[#292d45] outline-none placeholder:text-[#a5aabb] focus:border-[#d9b77d] focus:ring-2 focus:ring-[#d9b77d]/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-[14px] -translate-y-1/2 text-xs font-semibold text-[#777f96]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <p role="alert" className="mb-[18px] text-xs leading-relaxed text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[49px] rounded-lg bg-[#292d45] text-white text-[13px] font-bold transition-colors hover:bg-[#3b405d] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-[38px] text-center text-[11px] text-[#a0a5b5]">
            OrgFinder Administration Portal
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
