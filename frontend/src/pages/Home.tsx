import { useEffect, useState } from "react";
import api from "../api/axios";
import SearchBar from "../components/SearchBar";
import type { Note as NoteType } from "../api/notes";
import NoteForm from "../components/NoteForm";
import { toast } from "react-toastify";


const Home = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [search, setSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editErrors, setEditErrors] = useState<{ title?: string; content?: string }>({});

  const fetchNotes = async (query: string = "") => {
    try {
      // Use your backend endpoint with optional search query
      const response = await api.get(`/notes?search=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes(response.data.notes || []);
    } catch (error) {
      toast.error("Error fetching notes");
    }
  };

  useEffect(() => {
    fetchNotes(search);
  }, [search]);

  const startEditing = (note: NoteType) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async (id: number) => {
     const newErrors: typeof editErrors = {};
     if (!editTitle.trim()) newErrors.title = "Title is required.";
     if (!editContent.trim()) newErrors.content = "Content is required.";

     if (Object.keys(newErrors).length > 0) {
       setEditErrors(newErrors);
       return;
     }
     try {
      await api.put(
        `/notes/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      cancelEditing();
      fetchNotes(search);
      toast.success("Note updated successfully!");
     } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note.");
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await api.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchNotes(search);
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">SmartNotes</h1>
      <NoteForm onNoteCreated={() => fetchNotes(search)} />
      <SearchBar value={search} onChange={setSearch} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.length > 0 ? (
          notes.map((note) =>
            editingNoteId === note.id ? (
              <div key={note.id} className="p-4 border rounded shadow">
                <input
                  className="border p-1 w-full mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                {editErrors.title && <span className="text-red-500 text-sm">{editErrors.title}</span>}
                <textarea
                  className="border p-1 w-full mb-2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                {editErrors.content && <span className="text-red-500 text-sm">{editErrors.content}</span>}
                <button
                  className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                  onClick={() => saveEdit(note.id)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div key={note.id} className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition cursor-pointer">
                <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                <p className="text-gray-700">{note.content}</p>
                <div className="mt-3 flex gap-2 justify-end">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => startEditing(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )
        ) : (
          <p>No notes found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
