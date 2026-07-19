import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const ACCOUNT_TYPES = ["Developer", "Designer", "Student", "Freelancer", "Other"];

function Settings() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [accountType, setAccountType] = useState(
    user?.accountType || "Developer"
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const res = await api.put("/auth/me", {
        name,
        email,
        accountType,
      });

      updateUser(res.data.user);

      setSuccess("Profile updated successfully.");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2) || "D";

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-80 border-r border-white/10 bg-[#101010]">
        <div className="flex h-full w-full flex-col justify-between p-8">
          <div>
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
              <div>
                <h2 className="text-2xl font-bold text-white">DevLinks</h2>
                <p className="text-sm text-gray-500">Settings</p>
              </div>
            </div>

            <div className="mt-14 space-y-2">
              <Link
                to="/dashboard"
                className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-gray-400 transition hover:bg-[#1c1c1c] hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l9-9 9 9M4 10v10h16V10"
                  />
                </svg>
                Dashboard
              </Link>

              <Link
                to="/dashboard#your-links"
                className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-gray-400 transition hover:bg-[#1c1c1c] hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0L4 14.343V20h5.657l4.171-4.172a4 4 0 000-5.656z"
                  />
                </svg>
                My Links
              </Link>

              <Link
                to="/analytics"
                className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-gray-400 transition hover:bg-[#1c1c1c] hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 3a6.75 6.75 0 016.75 6.75v.75h.75A3.75 3.75 0 0121 14.25v.75A6.75 6.75 0 0114.25 21h-4.5A6.75 6.75 0 013 14.25v-.75A3.75 3.75 0 016.75 9.75h.75V9.75A6.75 6.75 0 019.75 3z"
                  />
                </svg>
                Analytics
              </Link>

              <button className="flex w-full items-center gap-4 rounded-xl bg-amber-400 px-5 py-4 font-semibold text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6V3m0 18v-3m9-6h-3M6 12H3"
                  />
                </svg>
                Settings
              </button>
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-white/10 bg-[#181818] p-6">
              <div className="flex flex-col items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-400 bg-amber-400 text-3xl font-black text-black">
                  {initials}
                </div>

                <h3 className="mt-5 text-xl font-bold text-white">
                  {user?.name || "Developer"}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  @{user?.username || "username"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* TOP NAVBAR */}
        <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl">
          <div className="flex items-center justify-between px-10 py-6">
            <div>
              <h1 className="text-3xl font-black text-white">Settings</h1>
              <p className="mt-2 text-gray-400">
                Update your account details.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to={`/${user?.username || ""}`}
                target="_blank"
                className="rounded-xl border border-white/10 bg-[#181818] px-6 py-3 text-white transition hover:border-amber-400"
              >
                View Profile
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="px-10 py-10">
          {(error || success) && (
            <div
              className={`mb-8 rounded-2xl border p-4 ${
                error
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-green-500/30 bg-green-500/10 text-green-400"
              }`}
            >
              {error || success}
            </div>
          )}

          <div className="grid gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="rounded-3xl border border-white/10 bg-[#181818] p-8">
                <h2 className="text-3xl font-black text-white">
                  Profile Details
                </h2>
                <p className="mt-2 text-gray-400">
                  This information is shown on your public profile.
                </p>

                <form onSubmit={handleSave} className="mt-10 space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#2b2b2b] bg-[#151515] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#2b2b2b] bg-[#151515] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Account Type
                    </label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full rounded-xl border border-[#2b2b2b] bg-[#151515] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                    >
                      {ACCOUNT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user?.username || ""}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-[#2b2b2b] bg-[#111111] px-5 py-4 text-gray-500"
                    />
                    <p className="mt-2 text-xs text-gray-600">
                      Username changes aren't supported yet.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center rounded-xl bg-amber-400 py-4 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>

            <div>
              <div className="rounded-3xl border border-white/10 bg-[#181818] p-8">
                <h2 className="text-2xl font-bold text-white">
                  Account Overview
                </h2>

                <div className="mt-8 space-y-5">
                  <div className="rounded-2xl bg-[#202020] p-5">
                    <p className="text-sm text-gray-500">Current Name</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {user?.name || "Developer"}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-[#202020] p-5">
                    <p className="text-sm text-gray-500">Current Email</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {user?.email || "example@email.com"}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-amber-400 p-5">
                    <p className="text-sm text-black/70">Account Type</p>
                    <h3 className="mt-2 text-xl font-black text-black">
                      {user?.accountType || "Developer"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;