import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotesAPI,
  createNoteAPI,
  updateNoteAPI,
  deleteNoteAPI,
} from "../services/api";

/* Decode JWT to read user name */
function decodeToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/* Format a date string like "22 Jun 2026, 8:45 PM" */
function fmtDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? decodeToken(token) : null;

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [activeNote, setActiveNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sideOpen, setSideOpen] = useState(window.innerWidth > 640);
  const [isCreating, setIsCreating] = useState(false);

  const textareaRef = useRef(null);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  /* ── Load notes ── */
  useEffect(() => {
    if (!token) return;
    (async () => {
      setFetching(true);
      try {
        const data = await getNotesAPI(token);
        setNotes(data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setFetching(false);
      }
    })();
  }, [token, navigate]);

  /* ── Auto-grow textarea ── */
  const grow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(220, el.scrollHeight) + "px";
  }, []);
  useEffect(() => { grow(); }, [content, grow]);

  /* ── Handlers ── */
  const selectNote = (n) => {
    setActiveNote(n);
    setTitle(n.title);
    setContent(n.content);
    setIsCreating(false);
  };

  const newNote = () => {
    setActiveNote(null);
    setTitle("");
    setContent("");
    setIsCreating(true);
  };

  const saveNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) { alert("Title is required."); return; }
    if (!content.trim()) { alert("Content is required."); return; }
    setSaving(true);
    try {
      if (activeNote) {
        const res = await updateNoteAPI(activeNote._id, { title, content }, token);
        setNotes((prev) => prev.map((n) => (n._id === activeNote._id ? res.note : n)));
        setActiveNote(res.note);
      } else {
        const res = await createNoteAPI({ title, content }, token);
        setNotes((prev) => [res.note, ...prev]);
        setActiveNote(res.note);
        setIsCreating(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNoteAPI(id, token);
      const updatedNotes = notes.filter((n) => n._id !== id);
      setNotes(updatedNotes);
      if (activeNote?._id === id) {
        if (updatedNotes.length === 0) {
          setActiveNote(null);
          setIsCreating(false);
        } else {
          selectNote(updatedNotes[0]);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

        /* ── Layout ── */
        .app { display: flex; height: 100vh; background: #f3f4f6; overflow: hidden; }

        /* ── Toast ── */
        .toast {
          position: fixed; bottom: 24px; right: 24px; z-index: 999;
          background: #111827; color: #fff; padding: 10px 18px;
          border-radius: 7px; font-size: 13px; font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          animation: toast-in 0.25s ease;
        }
        @keyframes toast-in {
          from { opacity:0; transform: translateY(8px); }
          to   { opacity:1; transform: translateY(0); }
        }

        /* ── Sidebar ── */
        .sidebar {
          width: 280px;
          flex-shrink: 0;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          transition: width 0.22s ease, border 0.22s ease;
        }
        .sidebar.closed {
          width: 0;
          border-right: none;
          overflow: hidden;
        }

        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 700;
          color: #111827;
        }

        .btn-new-note {
          width: 100%;
          padding: 9px 14px;
          margin: 12px 0 8px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.15s;
        }
        .btn-new-note:hover { background: #1d4ed8; }

        .sidebar-search-wrap { padding: 0 12px 8px; }
        .sidebar-search {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          color: #374151;
          outline: none;
          background: #f9fafb;
        }
        .sidebar-search:focus { border-color: #2563eb; background: #fff; }

        .notes-list { flex: 1; overflow-y: auto; padding: 4px 0; }
        .notes-list::-webkit-scrollbar { width: 4px; }
        .notes-list::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }

        .note-item {
          padding: 11px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.1s;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          position: relative;
        }
        .note-item:hover { background: #f9fafb; }
        .note-item.active { background: #eff6ff; border-left: 3px solid #2563eb; }
        .note-item-body { flex: 1; min-width: 0; }
        .note-item-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .note-item-preview {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .note-item-date {
          font-size: 11px;
          color: #d1d5db;
          margin-top: 4px;
        }

        .btn-delete-note {
          background: none;
          border: none;
          cursor: pointer;
          color: #d1d5db;
          font-size: 15px;
          padding: 2px 4px;
          border-radius: 4px;
          flex-shrink: 0;
          opacity: 0;
          transition: all 0.12s;
          line-height: 1;
        }
        .note-item:hover .btn-delete-note { opacity: 1; }
        .btn-delete-note:hover { color: #ef4444; background: #fef2f2; }

        .sidebar-empty {
          text-align: center;
          padding: 40px 20px;
          color: #9ca3af;
          font-size: 13px;
          line-height: 1.6;
        }
        .sidebar-empty span { font-size: 28px; display: block; margin-bottom: 8px; }

        /* ── Sidebar User Footer ── */
        .sidebar-user {
          border-top: 1px solid #e5e7eb;
          padding: 14px 16px;
          flex-shrink: 0;
        }
        .user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #2563eb;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .btn-logout {
          width: 100%;
          padding: 8px;
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #6b7280;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-logout:hover { background: #fef2f2; border-color: #fecaca; color: #b91c1c; }

        /* ── Main content ── */
        .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

        .topbar {
          height: 54px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 12px;
          flex-shrink: 0;
        }

        .topbar-toggle {
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #6b7280;
          transition: all 0.15s;
        }
        .topbar-toggle:hover { background: #f3f4f6; }

        .topbar-title {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .topbar-count {
          font-size: 12px;
          color: #9ca3af;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 3px 10px;
        }

        /* ── Editor ── */
        .editor-area {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
          display: flex;
          justify-content: center;
        }

        .editor-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 28px;
          width: 100%;
          max-width: 760px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .editor-card h2 {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f3f4f6;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }

        .title-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          outline: none;
          transition: border-color 0.15s;
          margin-bottom: 18px;
        }
        .title-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }

        .content-textarea {
          width: 100%;
          min-height: 220px;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          color: #374151;
          line-height: 1.7;
          outline: none;
          resize: none;
          transition: border-color 0.15s;
          background: #fff;
        }
        .content-textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }

        .editor-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
          flex-wrap: wrap;
          gap: 10px;
        }

        .btn-delete {
          padding: 9px 16px;
          background: none;
          border: 1px solid #fecaca;
          border-radius: 6px;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-delete:hover { background: #fef2f2; }

        .right-actions { display: flex; gap: 8px; align-items: center; }

        .btn-cancel {
          padding: 9px 16px;
          background: none;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          color: #6b7280;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-cancel:hover { background: #f3f4f6; }

        .btn-save {
          padding: 9px 20px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-save:hover { background: #1d4ed8; }
        .btn-save:disabled { background: #93c5fd; cursor: not-allowed; }

        /* ── Welcome empty state ── */
        .welcome-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 24px;
          color: #6b7280;
        }
        .welcome-state span { font-size: 48px; margin-bottom: 16px; display: block; }
        .welcome-state h2 { font-size: 17px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .welcome-state p { font-size: 13px; line-height: 1.6; max-width: 300px; }
        .welcome-state button {
          margin-top: 18px;
          padding: 9px 20px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .welcome-state button:hover { background: #1d4ed8; }

        /* ── Loading ── */
        .loading-state { text-align: center; padding: 60px; color: #9ca3af; font-size: 14px; }

        /* ── Note metadata ── */
        .note-meta {
          font-size: 11.5px;
          color: #9ca3af;
          margin-bottom: 18px;
        }

        /* Mobile toggle sidebar */
        @media (max-width: 640px) {
          .sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; width: 280px !important; transform: translateX(-100%); transition: transform 0.22s; border-right: 1px solid #e5e7eb !important; }
          .sidebar.open { transform: translateX(0); }
          .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 99; }
          .sidebar-overlay.show { display: block; }
        }
      `}</style>

      <div className="app">
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay${sideOpen ? " show" : ""}`}
          onClick={() => setSideOpen(false)}
          style={{ display: window.innerWidth > 640 ? "none" : undefined }}
        />

        {/* ── Sidebar ── */}
        <aside className={`sidebar${sideOpen ? " open" : " closed"}`}>
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <span>📝</span> Notes Manager
            </div>
          </div>

          <div style={{ padding: "0 12px" }}>
            <button className="btn-new-note" onClick={newNote}>
              + New Note
            </button>
          </div>

          <div className="sidebar-search-wrap">
            <input
              type="text"
              className="sidebar-search"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="notes-list">
            {fetching ? (
              <div className="sidebar-empty">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="sidebar-empty">
                <span>🗒️</span>
                {search ? "No notes match your search." : "No notes yet.\nClick 'New Note' to start."}
              </div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n._id}
                  className={`note-item${activeNote?._id === n._id ? " active" : ""}`}
                  onClick={() => selectNote(n)}
                >
                  <div className="note-item-body">
                    <div className="note-item-title">{n.title}</div>
                    <div className="note-item-preview">{n.content}</div>
                    <div className="note-item-date">{fmtDate(n.updatedAt)}</div>
                  </div>
                  <button
                    className="btn-delete-note"
                    title="Delete"
                    onClick={(e) => deleteNote(n._id, e)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* User / Logout */}
          <div className="sidebar-user">
            <div className="user-row">
              <div className="user-avatar">{user ? user.name.charAt(0) : "U"}</div>
              <div className="user-name">{user ? user.name : "User"}</div>
            </div>
            <button className="btn-logout" onClick={logout}>Sign out</button>
          </div>
        </aside>

        {/* ── Main Area ── */}
        <div className="main">
          {/* Topbar */}
          <div className="topbar">
            <button
              className="topbar-toggle"
              onClick={() => setSideOpen((o) => !o)}
              title="Toggle sidebar"
            >
              ☰
            </button>
            <span className="topbar-title">
              {activeNote ? activeNote.title : isCreating ? "New Note" : "Dashboard"}
            </span>
            <span className="topbar-count">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
          </div>

          {/* Editor */}
          <div className="editor-area">
            {fetching ? (
              <div className="loading-state">Loading your notes...</div>
            ) : !activeNote && !isCreating ? (
              /* ── Empty/Welcome state (either no notes, or no note selected) ── */
              <div className="welcome-state">
                <span>📝</span>
                <h2>{notes.length === 0 ? "You have no notes yet" : "No note selected"}</h2>
                <p>
                  {notes.length === 0
                    ? "Click 'New Note' in the sidebar or below to write your first note."
                    : "Select a note from the sidebar or create a new one to start writing."}
                </p>
                <button onClick={newNote}>
                  {notes.length === 0 ? "+ Create your first note" : "+ Create new note"}
                </button>
              </div>
            ) : (
              <div className="editor-card">
                <h2>{activeNote ? "Edit Note" : "Create a New Note"}</h2>

                {activeNote && (
                  <p className="note-meta">
                    Created: {fmtDate(activeNote.createdAt)} &nbsp;·&nbsp; Last updated: {fmtDate(activeNote.updatedAt)}
                  </p>
                )}

                <form onSubmit={saveNote}>
                  <label className="field-label" htmlFor="note-title">Title</label>
                  <input
                    id="note-title"
                    type="text"
                    className="title-input"
                    placeholder="Note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />

                  <label className="field-label" htmlFor="note-content">Content</label>
                  <textarea
                    id="note-content"
                    ref={textareaRef}
                    className="content-textarea"
                    placeholder="Write your note here..."
                    value={content}
                    onChange={(e) => { setContent(e.target.value); grow(); }}
                  />

                  <div className="editor-actions">
                    <div>
                      {activeNote && (
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => deleteNote(activeNote._id)}
                        >
                          Delete Note
                        </button>
                      )}
                    </div>
                    <div className="right-actions">
                      {(activeNote || isCreating) && notes.length > 0 && (
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => {
                            setIsCreating(false);
                            if (notes.length > 0) {
                              selectNote(notes[0]);
                            } else {
                              setActiveNote(null);
                            }
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="btn-save"
                        disabled={saving || !title.trim() || !content.trim()}
                      >
                        {saving ? "Saving..." : activeNote ? "Save Changes" : "Create Note"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
