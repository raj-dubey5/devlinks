import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const { username } = useParams();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const { data } = await api.get(`/profile/${username}`);

        setProfileData(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Profile not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#080808] via-[#101010] to-[#181818] flex items-center justify-center">
        <div className="text-center">
          <div className="h-14 w-14 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-5 text-gray-400 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#080808] via-[#101010] to-[#181818] flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#181818]/90 backdrop-blur-xl p-10 shadow-2xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-black text-white">
            Profile Not Found
          </h2>

          <p className="mt-4 text-gray-400">
            {error || "This profile doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  const { user, links } = profileData;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#080808] via-[#101010] to-[#181818]">

      {/* Background Glow */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-[130px]" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[150px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">

        <div className="w-full max-w-lg">

          {/* Logo */}

          <div className="mb-10 flex justify-center">

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

              <h2 className="text-3xl font-bold text-white">
                DevLinks
              </h2>

            </div>

          </div>

          {/* Profile Card */}

          <div className="rounded-3xl border border-white/10 bg-[#181818]/90 backdrop-blur-xl p-8 shadow-2xl">

            {/* Avatar */}

            <div className="flex flex-col items-center">

              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-amber-400 bg-amber-400 text-5xl font-black text-black shadow-lg">

                {user?.name?.charAt(0).toUpperCase()}

              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-white">
                {user?.name}
              </h1>

              <p className="mt-2 text-lg text-gray-400">
                @{user?.username}
              </p>

            </div>

            {/* Links */}

            <div className="mt-10 space-y-4">

              {links?.length > 0 ? (
                links.map((link) => (
                  <a
                    key={link._id}
                    href={`http://localhost:5000/api/links/${link._id}/click`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#232323] px-5 py-4 text-white transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-[#2b2b2b]"
                  >
                  
                    <span className="font-medium">
                      {link.title}
                    </span>

                    <span className="text-gray-500 transition group-hover:text-amber-400 group-hover:translate-x-1">
                      ↗
                    </span>
                  </a>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-gray-500">
                  No links added yet.
                </div>
              )}

            </div>

          </div>

          {/* Footer */}

          <div className="mt-10 text-center">

            <p className="text-gray-500">

              Built with{" "}

              <span className="font-semibold text-amber-400">
                DevLinks
              </span>

            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;