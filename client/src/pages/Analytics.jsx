import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Analytics() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [links, setLinks] = useState([]);
  const [profileViews, setProfileViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const linksRes = await api.get("/links");
      setLinks(linksRes.data);

      if (user?.username) {
        const profileRes = await api.get(`/profile/${user.username}`);
        setProfileViews(profileRes.data.user.profileViews || 0);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const clickThroughRate =
    profileViews > 0 ? ((totalClicks / profileViews) * 100).toFixed(1) : "0.0";

  const sortedLinks = [...links].sort(
    (a, b) => (b.clicks || 0) - (a.clicks || 0)
  );
  const maxClicks = sortedLinks[0]?.clicks || 0;

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-10 py-6">
          <div>
            <h1 className="text-3xl font-black text-white">Analytics</h1>
            <p className="mt-2 text-gray-400">
              See how your profile and links are performing.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-white/10 bg-[#181818] px-6 py-3 text-white transition hover:border-amber-400"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="px-10 py-10">
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#181818] p-12 text-center">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
            <p className="mt-6 text-lg text-gray-400">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-[#181818] p-7">
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Profile Views
                </p>
                <h2 className="mt-4 text-4xl font-black text-white">
                  {profileViews}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#181818] p-7">
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Total Clicks
                </p>
                <h2 className="mt-4 text-4xl font-black text-white">
                  {totalClicks}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#181818] p-7">
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Click-Through Rate
                </p>
                <h2 className="mt-4 text-4xl font-black text-white">
                  {clickThroughRate}%
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#181818] p-7">
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Total Links
                </p>
                <h2 className="mt-4 text-4xl font-black text-white">
                  {links.length}
                </h2>
              </div>
            </div>

            {/* PER-LINK BREAKDOWN */}
            <div className="mt-10 rounded-3xl border border-white/10 bg-[#181818] p-8">
              <h2 className="text-2xl font-bold text-white">
                Link Performance
              </h2>
              <p className="mt-2 text-gray-400">
                Ranked by clicks, highest first.
              </p>

              {sortedLinks.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-white/10 py-12 text-center text-gray-500">
                  No links yet. Add some from the Dashboard to see stats
                  here.
                </div>
              ) : (
                <div className="mt-8 space-y-5">
                  {sortedLinks.map((link, index) => {
                    const clicks = link.clicks || 0;
                    const widthPct =
                      maxClicks > 0 ? (clicks / maxClicks) * 100 : 0;

                    return (
                      <div key={link._id}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-white">
                            #{index + 1} {link.title}
                          </span>
                          <span className="text-gray-400">
                            {clicks} {clicks === 1 ? "click" : "clicks"}
                          </span>
                        </div>

                        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#202020]">
                          <div
                            className="h-full rounded-full bg-amber-400 transition-all duration-500"
                            style={{
                              width: `${Math.max(widthPct, clicks > 0 ? 4 : 0)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              Note: profile views count each page load, including your own
              visits.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;