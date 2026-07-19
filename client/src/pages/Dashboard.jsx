import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileViews, setProfileViews] = useState(0);
  const [copied, setCopied] = useState(false);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const publicProfileUrl = `${window.location.origin}/${user?.username || ""}`;

  const totalClicks = links.reduce(
    (sum, link) => sum + (link.clicks || 0),
    0
  );

  const stats = [
    {
      title: "Total Links",
      value: links.length,
    },
    {
      title: "Public Profile",
      value: "Active",
    },
    {
      title: "Username",
      value: user?.username || "-",
    },
    {
      title: "Account",
      value: user?.accountType || "Developer",
    },
  ];

  useEffect(() => {
    fetchLinks();
    if (user?.username) {
      fetchProfileViews();
    }
  }, [user]);

  const fetchLinks = async () => {
    try {
      setLoading(true);

      const res = await api.get("/links");

      setLinks(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load links."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileViews = async () => {
    try {
      const res = await api.get(`/profile/${user.username}`);
      setProfileViews(res.data.user.profileViews);
    } catch (err) {
      console.log(err);
    }
  };

  const addLink = async (e) => {
    e.preventDefault();

    if (!title || !url) return;

    try {
      setSaving(true);

      const res = await api.post("/links", {
        title,
        url,
      });

      setLinks([res.data, ...links]);

      setTitle("");
      setUrl("");

      setSuccess("Link added successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to add link."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteLink = async (id) => {
    try {
      await api.delete(`/links/${id}`);

      setLinks(links.filter((link) => link._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const updateLink = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(`/links/${editingId}`, {
        title: editTitle,
        url: editUrl,
      });

      setLinks(
        links.map((link) =>
          link._id === editingId ? res.data : link
        )
      );

      setEditingId(null);
      setEditTitle("");
      setEditUrl("");

      setSuccess("Link updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update link."
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.name || "My"} DevLinks Profile`,
          url: publicProfileUrl,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      handleCopyLink();
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
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>

            <div className="mt-14 space-y-2">
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
                    d="M3 12l9-9 9 9M4 10v10h16V10"
                  />
                </svg>
                Dashboard
              </button>

              <a
                href="#your-links"
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
              </a>

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

              <Link
                to="/settings"
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
                    d="M12 6V3m0 18v-3m9-6h-3M6 12H3"
                  />
                </svg>
                Settings
              </Link>
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

                <p className="mt-3 text-center text-sm leading-6 text-gray-500">
                  Building amazing projects and sharing everything from one
                  beautiful profile.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-[#202020] px-4 py-3">
                  <span className="text-gray-400">Links</span>
                  <span className="font-semibold text-white">
                    {links.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#202020] px-4 py-3">
                  <span className="text-gray-400">Views</span>
                  <span className="font-semibold text-white">
                    {profileViews}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#202020] px-4 py-3">
                  <span className="text-gray-400">Clicks</span>
                  <span className="font-semibold text-white">
                    {totalClicks}
                  </span>
                </div>
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
              <h1 className="text-3xl font-black text-white">
                Welcome back,
                <span className="text-amber-400">
                  {" "}
                  {user?.name?.split(" ")[0] || "Developer"}
                </span>
              </h1>
              <p className="mt-2 text-gray-400">
                Manage your links, monitor analytics and grow your personal
                brand.
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
                onClick={handleShare}
                className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
              >
                Share Profile
              </button>
            </div>
          </div>
        </div>

        <div className="px-10 py-10">
          {(error || success) && (
            <div
              className={`mb-8 rounded-2xl border p-4 ${error
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-green-500/30 bg-green-500/10 text-green-400"
                }`}
            >
              {error || success}
            </div>
          )}

          {/* ANALYTICS */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-white/10 bg-[#181818] p-7 transition duration-300 hover:border-amber-400/40 hover:-translate-y-1"
              >
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  {card.title}
                </p>
                <h2 className="mt-4 text-4xl font-black text-white">
                  {card.value}
                </h2>
              </div>
            ))}
          </div>

          {/* ADD LINK SECTION */}
          <div className="mt-10 grid gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="rounded-3xl border border-white/10 bg-[#181818] p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white">
                      Add New Link
                    </h2>
                    <p className="mt-2 text-gray-400">
                      Add your portfolio, GitHub, LinkedIn, resume or any
                      custom website.
                    </p>
                  </div>

                  <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 lg:flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>

                <form onSubmit={addLink} className="mt-10 space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Link Title
                    </label>
                    <input
                      type="text"
                      placeholder="GitHub"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#2b2b2b] bg-[#151515] px-5 py-4 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#2b2b2b] bg-[#151515] px-5 py-4 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center rounded-xl bg-amber-400 py-4 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Adding..." : "Add Link"}
                  </button>
                </form>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div>
              <div className="rounded-3xl border border-white/10 bg-[#181818] p-8">
                <h3 className="text-2xl font-bold text-white">
                  Quick Actions
                </h3>

                <div className="mt-8 space-y-4">
                  <Link
                    to="/settings"
                    className="flex w-full items-center justify-between rounded-2xl bg-[#202020] px-5 py-4 text-white transition hover:border hover:border-amber-400"
                  >
                    <span>Edit Profile</span>
                    <span>→</span>
                  </Link>


                  <a
                    href="#your-links"
                    className="flex w-full items-center justify-between rounded-2xl bg-[#202020] px-5 py-4 text-white transition hover:border hover:border-amber-400"
                  >
                    <span>View Your Links</span>
                    <span>→</span>
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="flex w-full items-center justify-between rounded-2xl bg-[#202020] px-5 py-4 text-white transition hover:border hover:border-amber-400"
                  >
                    <span>{copied ? "Copied!" : "Copy Public Link"}</span>
                    <span>{copied ? "✓" : "→"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LINKS LIST */}
          <div id="your-links" className="mt-10 scroll-mt-24">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-black text-white">Your Links</h2>
              <span className="rounded-full bg-[#1c1c1c] px-4 py-2 text-sm text-gray-400">
                {links.length} Links
              </span>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-[#181818] p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="h-14 w-14 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
                  <p className="mt-6 text-lg text-gray-400">
                    Loading your links...
                  </p>
                </div>
              </div>
            ) : links.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#181818] p-14">
                <div className="flex flex-col items-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#202020]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-3xl font-bold text-white">
                    No Links Yet
                  </h3>
                  <p className="mt-3 max-w-md text-center leading-7 text-gray-400">
                    Start building your profile by adding your first link.
                    Showcase your GitHub, Portfolio, Resume, LinkedIn or any
                    website you want.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {links.map((link, index) => (
                  <div
                    key={link._id}
                    className="group rounded-3xl border border-white/10 bg-[#181818] p-7 transition-all duration-300 hover:border-amber-400/40 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-xl font-black text-black">
                          {index + 1}
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {link.title}
                          </h3>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block text-gray-400 transition hover:text-amber-400"
                          >
                            {link.url}
                          </a>
                          <p className="mt-1 text-xs text-gray-600">
                            {link.clicks || 0} clicks
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setEditingId(link._id);
                            setEditTitle(link.title);
                            setEditUrl(link.url);
                          }}
                          className="rounded-xl border border-white/10 bg-[#202020] px-5 py-3 text-white transition hover:border-amber-400 hover:text-amber-400"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteLink(link._id)}
                          className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LIVE PROFILE PREVIEW */}
          <div className="mt-10 grid gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="rounded-3xl border border-white/10 bg-[#181818] p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white">
                      Live Profile Preview
                    </h2>
                    <p className="mt-2 text-gray-400">
                      This is how visitors will see your profile.
                    </p>
                  </div>

                  <Link
                    to={`/${user?.username || ""}`}
                    target="_blank"
                    className="rounded-xl border border-white/10 bg-[#202020] px-5 py-3 text-white transition hover:border-amber-400"
                  >
                    Open Public Profile
                  </Link>
                </div>

                <div className="mt-10 flex justify-center">
                  <div className="w-[360px] rounded-[40px] border-8 border-[#2a2a2a] bg-[#0d0d0d] p-6 shadow-2xl">
                    <div className="flex flex-col items-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-400 bg-amber-400 text-2xl font-black text-black">
                        {initials}
                      </div>

                      <h3 className="mt-5 text-2xl font-bold text-white">
                        {user?.name || "Developer"}
                      </h3>

                      <p className="mt-1 text-gray-400">
                        @{user?.username || "username"}
                      </p>
                    </div>

                    <div className="mt-8 space-y-4">
                      {links.length === 0 ? (
                        <div className="rounded-xl bg-[#181818] py-4 text-center text-gray-500">
                          No links available
                        </div>
                      ) : (
                        links.map((link) => (
                          <a
                            key={link._id}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-xl bg-amber-400 px-5 py-4 text-center font-semibold text-black transition hover:scale-[1.02]"
                          >
                            {link.title}
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACCOUNT OVERVIEW */}
            <div>
              <div className="rounded-3xl border border-white/10 bg-[#181818] p-8">
                <h2 className="text-2xl font-bold text-white">
                  Account Overview
                </h2>

                <div className="mt-8 space-y-5">
                  <div className="rounded-2xl bg-[#202020] p-5">
                    <p className="text-sm text-gray-500">Name</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {user?.name || "Developer"}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-[#202020] p-5">
                    <p className="text-sm text-gray-500">Username</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      @{user?.username || "username"}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-[#202020] p-5">
                    <p className="text-sm text-gray-500">Email</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {user?.email || "example@email.com"}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-amber-400 p-5">
                    <p className="text-sm text-black/70">Profile Status</p>
                    <h3 className="mt-2 text-xl font-black text-black">
                      Active
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {editingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#181818] p-8">
                <h2 className="text-3xl font-black text-white">Edit Link</h2>
                <p className="mt-2 text-gray-400">Update your link details.</p>

                <form onSubmit={updateLink} className="mt-8 space-y-6">
                  <div>
                    <label className="mb-2 block text-gray-300">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-xl border border-[#2b2b2b] bg-[#151515] px-5 py-4 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-gray-300">URL</label>
                    <input
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full rounded-xl border border-[#2b2b2b] bg-[#151515] px-5 py-4 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditTitle("");
                        setEditUrl("");
                      }}
                      className="rounded-xl border border-white/10 px-6 py-3 text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <footer className="mt-14 rounded-3xl border border-white/10 bg-[#181818] p-8">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
              <div>
                <h2 className="text-2xl font-bold text-white">DevLinks</h2>
                <p className="mt-2 text-gray-400">
                  Build your personal developer identity and share
                  everything with one beautiful link.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  disabled
                  title="Coming soon"
                  className="cursor-not-allowed rounded-xl border border-white/10 bg-[#202020] px-6 py-3 text-gray-600 opacity-60"
                >
                  Documentation
                </button>

                <button
                  disabled
                  title="Coming soon"
                  className="cursor-not-allowed rounded-xl border border-white/10 bg-[#202020] px-6 py-3 text-gray-600 opacity-60"
                >
                  Support
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex flex-col items-center justify-between gap-3 text-sm text-gray-500 lg:flex-row">
                <p>© 2026 DevLinks. All rights reserved.</p>

                <div className="flex items-center gap-6">
                  <Link to="/privacy" className="transition hover:text-amber-400">
                    Privacy
                  </Link>
                  <Link to="/terms" className="transition hover:text-amber-400">
                    Terms
                  </Link>
                  <Link to="/contact" className="transition hover:text-amber-400">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;