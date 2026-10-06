import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";
import { getNotes } from "../api/notes";
import type { Note } from "../api/notes";
import { toast } from "react-toastify";

const Home = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchNotes = async (query = "") => {
    try {
      const data = await getNotes(query);
      setNotes(data);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      toast.error("Error fetching notes");
    }
  };

  useEffect(() => {
    fetchNotes(search);
  }, [search]);

  return (
    <main className="page">
      <header className="page-header">
        <h1 className="page-title">My Notes</h1>
        <p className="page-subtitle">
          Keep your thoughts organized and easy to find.
        </p>
      </header>

      <NoteForm onNoteCreated={() => fetchNotes(search)} />

      <div className="search-wrapper">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <section className="notes-section">
        {notes.length > 0 ? (
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={() => fetchNotes(search)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            {search
              ? "No notes match your search."
              : "You don't have any notes yet. Create your first one above."}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;