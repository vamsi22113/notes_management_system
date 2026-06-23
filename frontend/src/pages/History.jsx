import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   SAMPLE HISTORY DATA
   (In a real app this would come from API/localStorage)
───────────────────────────────────────────── */
const SAMPLE_HISTORY = [
  { id: 1,  title: "Explain bubble sort algorithm",         mode: "beginner", time: "Today, 9:14 AM",   lang: "JavaScript", chars: 312  },
  { id: 2,  title: "Debug async/await promise chain",       mode: "debug",    time: "Today, 8:52 AM",   lang: "JavaScript", chars: 580  },
  { id: 3,  title: "Optimize React re-renders and memo",    mode: "optimize", time: "Yesterday, 4:30 PM", lang: "JSX",      chars: 1240 },
  { id: 4,  title: "Explain closures in JavaScript",        mode: "advanced", time: "Yesterday, 1:12 PM", lang: "JavaScript", chars: 204 },
  { id: 5,  title: "Convert class component to functional", mode: "beginner", time: "Apr 17, 11:08 AM", lang: "JSX",        chars: 760  },
  { id: 6,  title: "Find memory leak in useEffect",         mode: "debug",    time: "Apr 17, 9:45 AM",  lang: "React",      chars: 430  },
  { id: 7,  title: "Analyze binary search implementation",  mode: "advanced", time: "Apr 16, 3:20 PM",  lang: "Python",     chars: 285  },
  { id: 8,  title: "Optimize SQL query joins",              mode: "optimize", time: "Apr 16, 10:00 AM", lang: "SQL",        chars: 650  },
];

const MODES = {
  beginner: { emoji: "🟢", label: "Beginner", color: "#34d399", bg: "rgba(52,211,153,0.09)"  },
  advanced: { emoji: "🔵", label: "Advanced", color: "#60a5fa", bg: "rgba(96,165,250,0.09)"  },
  debug:    { emoji: "🟡", label: "Debug",    color: "#fbbf24", bg: "rgba(251,191,36,0.09)"  },
  optimize: { emoji: "🟣", label: "Optimize", color: "#c084fc", bg: "rgba(192,132,252,0.09)" },
};

const FILTERS = ["All", "Beginner", "Advanced", "Debug", "Optimize"];

const Icons = {
  back:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  history: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>,
  trash:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6 18.1 20a2 2 0 0 1-2 1.9H7.9a2 2 0 0 1-2-1.9L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
  search:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  code:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  sparkle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>,
  logout:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  empty:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9"/><path d="M3 12a9 9 0 0 0 9 9 9 9 0 0 0 9-9"/><path d="M12 8v4l3 3"/></svg>,
};

export default function History() {
  const navigate = useNavigate();
  const [items,       setItems]       = useState(SAMPLE_HISTORY);
  const [search,      setSearch]      = useState("");
  const [activeFilter,setActiveFilter]= useState("All");
  const [selected,    setSelected]    = useState(null);
  const [confirmDel,  setConfirmDel]  = useState(null);

  /* ── filtered list ── */
  const filtered = items.filter(h => {
    const matchSearch = h.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || h.mode === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const handleDelete = id => {
    setItems(prev => prev.filter(h => h.id !== id));
    if (selected?.id === id) setSelected(null);
    setConfirmDel(null);
  };

  const handleClearAll = () => {
    setItems([]);
    setSelected(null);
    setConfirmDel(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        #hist-root, #hist-root * {
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }

        @keyframes h-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes h-slidein {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0);    }
        }

        #hist-root {
          width: 100vw; height: 100vh; overflow: hidden;
          background: #0d0d0d; color: #ececec;
          display: flex; flex-direction: column;
        }

        /* ── Topbar ── */
        #h-topbar {
          height: 54px; flex-shrink: 0;
          border-bottom: 1px solid #1a1a1a;
          display: flex; align-items: center;
          padding: 0 20px; gap: 12px;
          background: #0d0d0d;
        }

        .h-top-btn {
          width: 34px; height: 34px; border-radius: 8px;
          border: none; background: transparent; color: #666;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; transition: all 0.15s; flex-shrink: 0;
        }
        .h-top-btn:hover { background: rgba(255,255,255,0.07); color: #ccc; }
        .h-top-btn svg   { width: 18px; height: 18px; }

        /* ── Body (sidebar + list) ── */
        #h-body {
          flex: 1; display: flex; overflow: hidden;
        }

        /* ── Left panel (filters + list) ── */
        #h-panel-left {
          width: 340px; flex-shrink: 0; height: 100%;
          border-right: 1px solid #1a1a1a;
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        @media (max-width: 700px) {
          #h-panel-left  { width: 100%; }
          #h-panel-right { display: none; }
          #h-panel-right.show { display: flex; position: fixed; inset: 0; z-index: 50; background: #0d0d0d; flex-direction: column; }
        }

        /* ── Search ── */
        #h-search-wrap {
          padding: 14px 14px 10px; border-bottom: 1px solid #1a1a1a;
          display: flex; flex-direction: column; gap: 10px;
        }
        .h-search-box {
          display: flex; align-items: center; gap: 8px;
          background: #151515; border: 1px solid #222;
          border-radius: 10px; padding: 8px 12px;
          transition: border-color 0.2s;
        }
        .h-search-box:focus-within { border-color: #333; }
        .h-search-box svg { width: 15px; height: 15px; color: #555; flex-shrink: 0; }
        .h-search-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #ddd; font-size: 13px;
        }
        .h-search-input::placeholder { color: #3a3a3a; }

        /* filter chips */
        .h-filter-row {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .h-filter-chip {
          padding: 4px 12px; border-radius: 99px; font-size: 12px;
          font-weight: 500; border: 1px solid #222; background: transparent;
          color: #777; cursor: pointer; transition: all 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .h-filter-chip:hover  { background: #1a1a1a; color: #bbb; }
        .h-filter-chip.active { background: #1c2a3a; border-color: #60a5fa40; color: #93c5fd; }

        /* list */
        #h-list {
          flex: 1; overflow-y: auto; padding: 8px;
        }
        #h-list::-webkit-scrollbar { width: 3px; }
        #h-list::-webkit-scrollbar-thumb { background: #222; border-radius: 99px; }

        .h-list-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 12px; border-radius: 10px;
          cursor: pointer; transition: background 0.12s;
          border: 1px solid transparent; margin-bottom: 4px;
          animation: h-slidein 0.2s ease;
        }
        .h-list-item:hover   { background: #141414; border-color: #1e1e1e; }
        .h-list-item.sel     { background: #161b25; border-color: #2a3a50; }

        .h-list-item-icon {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: #1a1a1a; border: 1px solid #252525;
          display: flex; align-items: center; justify-content: center;
          margin-top: 2px;
        }
        .h-list-item-icon svg { width: 15px; height: 15px; }

        .h-del-btn {
          background: none; border: none; cursor: pointer;
          color: #3a3a3a; padding: 3px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.12s; flex-shrink: 0; margin-top: 2px;
          opacity: 0;
        }
        .h-list-item:hover .h-del-btn { opacity: 1; }
        .h-del-btn:hover { color: #ef4444 !important; background: rgba(239,68,68,0.1); }
        .h-del-btn svg { width: 14px; height: 14px; }

        /* ── Right panel (detail) ── */
        #h-panel-right {
          flex: 1; display: flex; flex-direction: column;
          overflow: hidden;
        }

        #h-detail {
          flex: 1; overflow-y: auto; padding: 28px 28px;
        }
        #h-detail::-webkit-scrollbar { width: 4px; }
        #h-detail::-webkit-scrollbar-thumb { background: #222; border-radius: 99px; }

        /* stats bar */
        .h-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px; margin-bottom: 24px;
        }
        .h-stat-card {
          background: #131313; border: 1px solid #1e1e1e;
          border-radius: 12px; padding: 14px 16px;
        }

        /* confirm modal */
        .h-modal-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 999; animation: h-fadein 0.15s ease;
        }
        .h-modal {
          background: #161616; border: 1px solid #2a2a2a;
          border-radius: 14px; padding: 24px; max-width: 340px; width: 90%;
          box-shadow: 0 24px 60px rgba(0,0,0,0.8);
        }

        @media (max-width: 480px) {
          #h-topbar { padding: 0 12px; }
          #h-detail  { padding: 18px 16px; }
          #h-search-wrap { padding: 10px 10px 8px; }
        }
      `}</style>

      <div id="hist-root">

        {/* ═══════════ TOPBAR ═══════════ */}
        <header id="h-topbar">
          <button
            className="h-top-btn"
            onClick={() => navigate("/dashboard")}
            title="Back to Dashboard"
          >
            <span style={{ transform: "none" }}>{Icons.back}</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <span style={{ width: 18, height: 18, display: "flex", color: "#60a5fa", flexShrink: 0 }}>{Icons.history}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#d5d5d5" }}>Analysis History</span>
            <span style={{
              fontSize: 11, background: "#191919", border: "1px solid #222",
              borderRadius: 99, padding: "1px 8px", color: "#555",
            }}>{items.length}</span>
          </div>

          <button
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "6px 14px", borderRadius: 9,
              background: "linear-gradient(135deg,#1d4ed8,#7c3aed)",
              border: "none", color: "#e0e0e0",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "opacity 0.15s", flexShrink: 0,
            }}
            onClick={() => navigate("/dashboard")}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <span style={{ width: 14, height: 14, display: "flex" }}>{Icons.sparkle}</span>
            <span style={{ display: window.innerWidth < 400 ? "none" : "inline" }}>New Analysis</span>
          </button>

          <button
            className="h-top-btn"
            onClick={() => navigate("/")}
            title="Sign out"
          >
            {Icons.logout}
          </button>
        </header>

        {/* ═══════════ BODY ═══════════ */}
        <div id="h-body">

          {/* ── LEFT: filter + list ── */}
          <div id="h-panel-left">
            {/* Search + filters */}
            <div id="h-search-wrap">
              <div className="h-search-box">
                {Icons.search}
                <input
                  className="h-search-input"
                  placeholder="Search history…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="h-filter-row">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`h-filter-chip${activeFilter === f ? " active" : ""}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear all */}
            {items.length > 0 && (
              <div style={{ padding: "6px 14px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#444" }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setConfirmDel("all")}
                  style={{
                    background: "none", border: "none", color: "#3a3a3a",
                    fontSize: 11, cursor: "pointer", padding: "2px 6px",
                    borderRadius: 5, transition: "color 0.15s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                  onMouseLeave={e => e.currentTarget.style.color = "#3a3a3a"}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* List */}
            <div id="h-list">
              {filtered.length === 0 ? (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 10, padding: "48px 20px", textAlign: "center",
                }}>
                  <span style={{ width: 40, height: 40, display: "flex", color: "#2e2e2e" }}>{Icons.empty}</span>
                  <p style={{ fontSize: 13, color: "#444" }}>
                    {search || activeFilter !== "All" ? "No results match your filters" : "No history yet"}
                  </p>
                  {(search || activeFilter !== "All") && (
                    <button
                      onClick={() => { setSearch(""); setActiveFilter("All"); }}
                      style={{
                        background: "#181818", border: "1px solid #252525",
                        borderRadius: 8, padding: "6px 14px", color: "#888",
                        fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                filtered.map((h, idx) => {
                  const m = MODES[h.mode] || MODES.beginner;
                  return (
                    <div
                      key={h.id}
                      className={`h-list-item${selected?.id === h.id ? " sel" : ""}`}
                      onClick={() => setSelected(h)}
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <div className="h-list-item-icon" style={{ color: m.color }}>
                        {Icons.code}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 13, fontWeight: 500, color: "#ddd",
                          overflow: "hidden", textOverflow: "ellipsis",
                          whiteSpace: "nowrap", marginBottom: 4,
                        }}>{h.title}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: 10, padding: "1px 7px", borderRadius: 99,
                            background: m.bg, color: m.color,
                            border: `1px solid ${m.color}22`, fontWeight: 600,
                          }}>{m.emoji} {m.label}</span>
                          <span style={{ fontSize: 11, color: "#3e3e3e" }}>{h.time}</span>
                        </div>
                      </div>
                      <button
                        className="h-del-btn"
                        onClick={e => { e.stopPropagation(); setConfirmDel(h.id); }}
                        title="Delete"
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── RIGHT: detail panel ── */}
          <div id="h-panel-right">
            {selected ? (
              <>
                {/* Detail header */}
                <div style={{
                  padding: "18px 28px", borderBottom: "1px solid #1a1a1a",
                  display: "flex", alignItems: "flex-start", gap: 14,
                  flexWrap: "wrap",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontSize: 17, fontWeight: 700, color: "#e5e5e5", marginBottom: 6, wordBreak: "break-word" }}>
                      {selected.title}
                    </h2>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      {(() => {
                        const m = MODES[selected.mode] || MODES.beginner;
                        return (
                          <span style={{
                            fontSize: 11, padding: "3px 10px", borderRadius: 99,
                            background: m.bg, color: m.color,
                            border: `1px solid ${m.color}28`, fontWeight: 600,
                          }}>{m.emoji} {m.label}</span>
                        );
                      })()}
                      <span style={{ fontSize: 12, color: "#444" }}>{selected.time}</span>
                      <span style={{ fontSize: 12, color: "#444" }}>·</span>
                      <span style={{ fontSize: 12, color: "#444" }}>{selected.lang}</span>
                      <span style={{ fontSize: 12, color: "#444" }}>·</span>
                      <span style={{ fontSize: 12, color: "#444" }}>{selected.chars} chars</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => navigate("/dashboard")}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "7px 14px", borderRadius: 9,
                        background: "linear-gradient(135deg,#1d4ed8,#7c3aed)",
                        border: "none", color: "#e5e5e5",
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                      <span style={{ width: 13, height: 13, display: "flex" }}>{Icons.sparkle}</span>
                      Re-analyze
                    </button>
                    <button
                      onClick={() => setConfirmDel(selected.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "7px 12px", borderRadius: 9,
                        border: "1px solid #2a2a2a", background: "transparent",
                        color: "#555", fontSize: 12, cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.background = "rgba(239,68,68,0.05)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{ width: 13, height: 13, display: "flex" }}>{Icons.trash}</span>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div id="h-detail">
                  {/* Stats grid */}
                  <div className="h-stat-grid">
                    {[
                      { label: "Mode",      value: MODES[selected.mode]?.label ?? "—" },
                      { label: "Language",  value: selected.lang },
                      { label: "Chars",     value: selected.chars.toLocaleString() },
                      { label: "Date",      value: selected.time },
                    ].map(s => (
                      <div key={s.label} className="h-stat-card">
                        <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 6 }}>{s.label}</p>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#c5c5c5" }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Placeholder content card */}
                  <div style={{
                    background: "#131313", border: "1px solid #1e1e1e",
                    borderRadius: 14, padding: "20px 22px", marginBottom: 16,
                    animation: "h-fadein 0.3s ease",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: "linear-gradient(135deg,#1d4ed8,#7c3aed)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ width: 14, height: 14, display: "flex", color: "#93c5fd" }}>{Icons.sparkle}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>Saved Explanation</span>
                      {(() => {
                        const m = MODES[selected.mode];
                        return m ? (
                          <span style={{
                            fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 600,
                            background: m.bg, color: m.color, border: `1px solid ${m.color}25`,
                          }}>{m.label}</span>
                        ) : null;
                      })()}
                    </div>
                    <div style={{ height: 1, background: "#1e1e1e", marginBottom: 14 }} />
                    <pre style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13, lineHeight: 1.8, color: "#888",
                      whiteSpace: "pre-wrap", wordBreak: "break-word",
                      fontStyle: "italic",
                    }}>
                      {`The saved explanation for "${selected.title}" would be displayed here.\n\nIn a fully connected app, this would load the stored AI response from the backend or localStorage.\n\nClick "Re-analyze" to run a fresh analysis in the dashboard.`}
                    </pre>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => navigate("/dashboard")}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 16px", borderRadius: 9,
                        background: "#181818", border: "1px solid #252525",
                        color: "#aaa", fontSize: 13, cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#1e1e1e"; e.currentTarget.style.color = "#ddd"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#181818"; e.currentTarget.style.color = "#aaa"; }}
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty right panel */
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 12, padding: "40px 24px", textAlign: "center",
                animation: "h-fadein 0.4s ease",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "linear-gradient(135deg,#1a2840,#1e1042)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ width: 26, height: 26, display: "flex", color: "#60a5fa" }}>{Icons.history}</span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#555" }}>Select an item</p>
                <p style={{ fontSize: 13, color: "#383838", maxWidth: 260 }}>
                  Click any history entry on the left to view its details and saved explanation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════ CONFIRM MODAL ═══════════ */}
        {confirmDel !== null && (
          <div className="h-modal-backdrop" onClick={() => setConfirmDel(null)}>
            <div className="h-modal" onClick={e => e.stopPropagation()}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e5e5e5", marginBottom: 8 }}>
                {confirmDel === "all" ? "Clear all history?" : "Delete this entry?"}
              </h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 20, lineHeight: 1.6 }}>
                {confirmDel === "all"
                  ? "This will permanently remove all your history entries. This action cannot be undone."
                  : "This entry will be permanently deleted. This action cannot be undone."}
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={() => setConfirmDel(null)}
                  style={{
                    padding: "8px 16px", borderRadius: 9,
                    background: "#1e1e1e", border: "1px solid #2e2e2e",
                    color: "#aaa", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#252525"}
                  onMouseLeave={e => e.currentTarget.style.background = "#1e1e1e"}
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDel === "all" ? handleClearAll() : handleDelete(confirmDel)}
                  style={{
                    padding: "8px 16px", borderRadius: 9,
                    background: "rgba(239,68,68,0.9)", border: "1px solid rgba(239,68,68,0.5)",
                    color: "#fff", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {confirmDel === "all" ? "Clear All" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
