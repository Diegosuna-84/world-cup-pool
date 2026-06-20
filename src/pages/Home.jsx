import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import appLogo from "../assets/Wc_pool_logo.png";

const LIVE_STATUSES = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"];
const FINISHED_STATUSES = ["FT", "AET", "PEN"];

function mapScoreFixture(item) {
  return {
    id: item.fixture.id,
    home: item.teams.home.name,
    away: item.teams.away.name,
    homeLogo: item.teams.home.logo,
    awayLogo: item.teams.away.logo,
    group: item.league.round,
    date: item.fixture.date,
    status: item.fixture.status.short,
    homeScoreFull: item.score.fulltime.home,
    awayScoreFull: item.score.fulltime.away,
    venueName: item.fixture.venue.name,
    venueCity: item.fixture.venue.city,
  };
}

function TeamRankBadge({ teamName, standings }) {
  const standing = standings.find((s) => s.teamName === teamName);
  if (!standing) return null;
  return (
    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.4rem" }}>
      <span style={{ background: "#1a2e1a", color: "#4ade80", fontSize: "0.7rem", fontWeight: "600", padding: "2px 8px", borderRadius: "12px" }}>
        Grp {standing.group}
      </span>
      <span style={{ background: "#1a1a2e", color: "#4cc9f0", fontSize: "0.7rem", fontWeight: "600", padding: "2px 8px", borderRadius: "12px" }}>
        Rank #{standing.rank}
      </span>
    </div>
  );
}

function FeaturedMatchCard({ match, standings, loading }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: "1.5rem", boxSizing: "border-box" }}>
      <div style={{ background: "#141414", borderRadius: "20px", padding: "2rem 1.5rem", border: "1px solid #222" }}>
        <h2 style={{ color: "#fff", fontSize: "1rem", fontWeight: "700", textAlign: "center", marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>
          {loading
            ? "Loading match..."
            : !match
            ? "No Match Available"
            : LIVE_STATUSES.includes(match.status)
            ? "🔴 Live Now"
            : match.status === "NS"
            ? "⏱ Next Match"
            : "Last Result"}
        </h2>

        {!loading && match && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <span style={{ background: "#1a2e1a", color: "#4ade80", fontSize: "0.75rem", fontWeight: "600", padding: "4px 10px", borderRadius: "20px" }}>
                {match.group}
              </span>
              <span style={{ color: "#555", fontSize: "0.8rem" }}>
                {new Date(match.date).toLocaleDateString()}{" "}
                {new Date(match.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <img
                  src={match.homeLogo}
                  alt={match.home}
                  onError={(e) => { e.currentTarget.src = appLogo; e.currentTarget.onerror = null; }}
                  style={{ width: "72px", height: "72px", objectFit: "contain", display: "block", margin: "0 auto 0.5rem" }}
                />
                <p style={{ color: "#fff", fontWeight: "600", fontSize: "0.95rem", margin: 0 }}>{match.home}</p>
                <TeamRankBadge teamName={match.home} standings={standings} />
              </div>

              <div style={{ textAlign: "center", padding: "0 0.75rem" }}>
                {LIVE_STATUSES.includes(match.status) || FINISHED_STATUSES.includes(match.status) ? (
                  <p style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "700", margin: 0 }}>
                    {match.homeScoreFull ?? 0} — {match.awayScoreFull ?? 0}
                  </p>
                ) : (
                  <span style={{ color: "#333", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "2px" }}>VS</span>
                )}
                {LIVE_STATUSES.includes(match.status) && (
                  <p style={{ color: "#f59e0b", fontSize: "0.75rem", fontWeight: "600", marginTop: "0.4rem" }}>
                    ⏱ {match.elapsedMinutes}'
                  </p>
                )}
              </div>

              <div style={{ textAlign: "center", flex: 1 }}>
                <img
                  src={match.awayLogo}
                  alt={match.away}
                  onError={(e) => { e.currentTarget.src = appLogo; e.currentTarget.onerror = null; }}
                  style={{ width: "72px", height: "72px", objectFit: "contain", display: "block", margin: "0 auto 0.5rem" }}
                />
                <p style={{ color: "#fff", fontWeight: "600", fontSize: "0.95rem", margin: 0 }}>{match.away}</p>
                <TeamRankBadge teamName={match.away} standings={standings} />
              </div>
            </div>

            {match.venueName && (
              <p style={{ color: "#555", fontSize: "0.75rem", textAlign: "center", marginTop: "1.5rem" }}>
                📍 {match.venueName}{match.venueCity ? `, ${match.venueCity}` : ""}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StandingsCard({ standings, loading }) {
  const sorted = [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return (b.goalsFor || 0) - (a.goalsFor || 0);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: "1.5rem", boxSizing: "border-box" }}>
      <div style={{ background: "#141414", borderRadius: "20px", padding: "1.5rem", border: "1px solid #222", display: "flex", flexDirection: "column" }}>
        <h2 style={{ color: "#fff", fontSize: "1rem", fontWeight: "700", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>
          🏆 Top 5 — World Cup Standings
        </h2>
        <p style={{ color: "#555", fontSize: "0.75rem", marginBottom: "1.25rem" }}>
          All groups combined, by points
        </p>

        {loading ? (
          <p style={{ color: "#555", textAlign: "center" }}>Loading standings...</p>
        ) : sorted.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center" }}>No standings available</p>
        ) : (
          <div style={{ maxHeight: "min(60vh, 420px)", overflowY: "auto" }}>
            {sorted.map((team, i) => (
              <div
                key={`${team.teamName}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#0d0d0d",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  marginBottom: "0.5rem",
                  border: i < 5 ? "1px solid #1a3a1a" : "1px solid #1f1f1f",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: i < 5 ? "#4ade80" : "#555", fontWeight: "700", fontSize: "0.9rem", minWidth: "22px" }}>
                    #{i + 1}
                  </span>
                  <span style={{ color: "#fff", fontSize: "0.9rem", fontWeight: "600" }}>{team.teamName}</span>
                  <span style={{ background: "#1a1a2e", color: "#4cc9f0", fontSize: "0.65rem", fontWeight: "600", padding: "2px 6px", borderRadius: "10px" }}>
                    Grp {team.group}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: "#4cc9f0", fontWeight: "700", fontSize: "0.9rem" }}>{team.points} pts</span>
                  <p style={{ color: "#555", fontSize: "0.7rem", margin: 0 }}>{team.goalsFor} GF</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NewsCard({ news, loading }) {
  const topNews = news.slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: "1.5rem", boxSizing: "border-box" }}>
      <div style={{ background: "#141414", borderRadius: "20px", padding: "1.5rem", border: "1px solid #222" }}>
        <h2 style={{ color: "#fff", fontSize: "1rem", fontWeight: "700", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>
          ⚽ Breaking News
        </h2>

        {loading ? (
          <p style={{ color: "#555", textAlign: "center" }}>Loading news...</p>
        ) : topNews.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center" }}>No news available</p>
        ) : (
          topNews.map((article, i) => (
            
              key={i}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", gap: "1rem", marginBottom: "0.85rem", background: "#0d0d0d", borderRadius: "12px", padding: "0.75rem", border: "1px solid #1f1f1f", textDecoration: "none" }}
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt=""
                  style={{ width: "70px", height: "70px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                />
              )}
              <div>
                <p style={{ color: "#fff", fontSize: "0.88rem", fontWeight: "600", marginBottom: "0.25rem", lineHeight: "1.4" }}>
                  {article.title}
                </p>
                <p style={{ color: "#555", fontSize: "0.72rem" }}>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}

function Home() {
  const [matches, setMatches] = useState([]);
  const [scoreFallback, setScoreFallback] = useState(null);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [standings, setStandings] = useState([]);
  const [standingsLoading, setStandingsLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches")
      .then((res) => res.json())
      .then(async (data) => {
        setMatches(data || []);
        const hasLiveOrUpcoming = (data || []).some(
          (m) => LIVE_STATUSES.includes(m.status) || (m.status === "NS" && new Date(m.date) >= new Date())
        );
        if (!hasLiveOrUpcoming) {
          try {
            const scoreRes = await fetch("/api/scores");
            const scoreData = await scoreRes.json();
            const fixtures = (scoreData.response || []).map(mapScoreFixture);
            fixtures.sort((a, b) => new Date(b.date) - new Date(a.date));
            setScoreFallback(fixtures[0] || null);
          } catch {
            setScoreFallback(null);
          }
        }
        setMatchesLoading(false);
      })
      .catch(() => setMatchesLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/standings")
      .then((res) => res.json())
      .then((data) => {
        setStandings(data || []);
        setStandingsLoading(false);
      })
      .catch(() => setStandingsLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data.articles || []);
        setNewsLoading(false);
      })
      .catch(() => setNewsLoading(false));
  }, []);

  const liveMatch = matches.find((m) => LIVE_STATUSES.includes(m.status));
  const upcomingMatches = matches
    .filter((m) => m.status === "NS" && new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const featuredMatch = liveMatch || upcomingMatches[0] || scoreFallback;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <Navbar />
      <FeaturedMatchCard match={featuredMatch} standings={standings} loading={matchesLoading} />
      <StandingsCard standings={standings} loading={standingsLoading} />
      <NewsCard news={news} loading={newsLoading} />
    </div>
  );
}

export default Home;