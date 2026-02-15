"use client";

import { FormEvent, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

type Mode = "create" | "edit";

function getApiBaseUrl(): string {
  if (typeof window === "undefined") return "/api";
  return window.location.hostname === "localhost" ? "http://localhost:8000/api" : "/api";
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState("Click Refresh to load notes");

  const apiBase = getApiBaseUrl();

  async function loadNotes() {
    try {
      const res = await fetch(`${apiBase}/notes`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to load notes (${res.status})`);
      }
      const data = (await res.json()) as Note[];
      setNotes(data);
      setStatus(`Loaded ${data.length} note(s)`);
    } catch (err: unknown) {
      setStatus(err instanceof Error ? err.message : "Failed to load notes");
    }
  }

  function resetForm() {
    setMode("create");
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(mode === "create" ? "Creating note..." : "Updating note...");

    const payload = {
      title,
      content,
    };

    const endpoint = mode === "create" ? `${apiBase}/notes` : `${apiBase}/notes/${editingId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setStatus(data?.detail ?? `Request failed (${res.status})`);
      return;
    }

    setStatus(mode === "create" ? "Note created" : "Note updated");
    resetForm();
    await loadNotes();
  }

  function startEdit(note: Note) {
    setMode("edit");
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setStatus(`Editing note #${note.id}`);
  }

  async function removeNote(noteId: number) {
    setStatus(`Deleting note #${noteId}...`);

    const res = await fetch(`${apiBase}/notes/${noteId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setStatus(data?.detail ?? `Delete failed (${res.status})`);
      return;
    }

    if (editingId === noteId) {
      resetForm();
    }

    setStatus(`Deleted note #${noteId}`);
    await loadNotes();
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Note CRUD test page</h1>
      <p style={{ marginTop: 0, color: "#555" }}>FastAPI + Next.js (Vercel rewrite) test UI</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, marginBottom: 24 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
          required
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="content"
          required
          rows={6}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={{ padding: "10px 14px" }}>
            {mode === "create" ? "Create" : `Update #${editingId}`}
          </button>
          {mode === "edit" ? (
            <button type="button" onClick={resetForm} style={{ padding: "10px 14px" }}>
              Cancel
            </button>
          ) : null}
          <button type="button" onClick={loadNotes} style={{ padding: "10px 14px" }}>
            Refresh
          </button>
        </div>
      </form>

      <p style={{ marginBottom: 12, color: "#0a5" }}>{status}</p>

      <section style={{ display: "grid", gap: 12 }}>
        {notes.map((note) => (
          <article key={note.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <h2 style={{ margin: 0 }}>{note.title}</h2>
            <p style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{note.content}</p>
            <small style={{ color: "#666", display: "block", marginBottom: 10 }}>
              id={note.id} | created={new Date(note.created_at).toLocaleString()} | updated={new Date(note.updated_at).toLocaleString()}
            </small>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => startEdit(note)} style={{ padding: "8px 12px" }}>
                Edit
              </button>
              <button type="button" onClick={() => removeNote(note.id)} style={{ padding: "8px 12px" }}>
                Delete
              </button>
            </div>
          </article>
        ))}
        {notes.length === 0 ? <p>No notes yet.</p> : null}
      </section>
    </main>
  );
}
