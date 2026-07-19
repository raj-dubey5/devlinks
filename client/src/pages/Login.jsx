import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const previewLinks = [
    "Portfolio",
    "GitHub",
    "LinkedIn",
    "Resume",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex">

      {/* LEFT PANEL */}

      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#080808] via-[#101010] to-[#181818]">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/15 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[150px]" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-14">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 10-7.07-7.07L11 5m2 6a5 5 0 00-7.07 0L3.1 13.83a5 5 0 107.07 7.07L13 19"
                />
              </svg>

            </div>

            <h2 className="text-2xl font-bold text-white">
              DevLinks
            </h2>

          </div>

          {/* Hero */}

          <div className="max-w-xl">

            <h1 className="text-6xl font-black leading-tight tracking-tight text-white">

              Your links.

              <br />

              One beautiful page.

            </h1>

            <p className="mt-7 text-lg leading-8 text-gray-400">

              Create your personalized developer profile,
              organize every important link,
              and share one page everywhere.

            </p>

          </div>

          {/* Preview Card */}

          <div className="relative w-[370px] rounded-3xl border border-white/10 bg-[#181818]/90 p-6 backdrop-blur-xl shadow-2xl hover:-translate-y-1 transition">

            <div className="absolute left-10 top-10 h-48 w-48 rounded-full bg-amber-400/10 blur-[100px]" />

            <div className="relative">

              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Profile"
                className="mx-auto h-20 w-20 rounded-full border-4 border-amber-400 object-cover shadow-lg"
              />

              <h3 className="mt-5 text-center text-xl font-bold text-white">

                @rajcodes

              </h3>

              <p className="text-center text-gray-400">

                Full Stack Developer

              </p>

              <div className="mt-8 space-y-3">

                {previewLinks.map((link) => (

                  <div
                    key={link}
                    className="rounded-xl border border-white/5 bg-[#232323] px-4 py-3 text-white transition hover:border-amber-400/40 hover:bg-[#2b2b2b]"
                  >

                    {link}

                  </div>

                ))}

              </div>

              <button
                className="mt-8 w-full rounded-xl bg-white py-3 font-semibold text-black hover:bg-gray-200 transition"
              >
                Share Profile
              </button>

            </div>

          </div>

          <p className="text-sm text-gray-600">

            © 2026 DevLinks

          </p>

        </div>

      </div>
      {/* RIGHT PANEL */}

      <div className="flex flex-1 items-center justify-center px-8 py-12">

        <div className="w-full max-w-md">

          {/* Logo */}

          <div className="mb-10 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 10-7.07-7.07L11 5m2 6a5 5 0 00-7.07 0L3.1 13.83a5 5 0 107.07 7.07L13 19"
                />
              </svg>

            </div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                DevLinks
              </h2>

              <p className="text-sm text-gray-500">
                Build your personal developer page
              </p>

            </div>

          </div>

          <h1 className="text-5xl font-black tracking-tight text-white">
            Welcome Back
          </h1>

          <p className="mt-3 text-gray-400 leading-7">
            Sign in to continue building your personal developer profile.
          </p>

          {error && (
            <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-[#2b2b2b] bg-[#161616] px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-[#2b2b2b] bg-[#161616] px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
              />

            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-white py-3 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-200 active:scale-[0.98]"
            >
              Sign In
            </button>

          </form>

          <div className="my-8 flex items-center">

            <div className="h-px flex-1 bg-white/10"></div>

            <span className="mx-4 text-sm text-gray-500">
              OR
            </span>

            <div className="h-px flex-1 bg-white/10"></div>

          </div>

          <p className="text-center text-gray-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-amber-400 transition hover:text-amber-300"
            >
              Create one →
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;