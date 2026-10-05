import { useState } from "react";
import api from "../api/axios";
import type { Note } from "../api/notes";
import { toast } from "react-toastify";

interface NoteCardProps {
  note: Note;
  onUpdate: () => void; // called after edit or delete
}

const NoteCard = ({ note, onUpdate }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [errors, setErrors] = useState({ title: "", content: "" });

  const validate = () => {
    const newErrors = { title: "", content: "" };
    if (!title.trim()) newErrors.title = "Title is required";
    if (content.trim().length < 5) newErrors.content = "Content must be at least 5 characters";
    setErrors(newErrors);
    return !newErrors.title && !newErrors.content;
  };

  // Edit / Update note
  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      await api.put(`/notes/${note.id}`, { title, content }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Note updated!");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error("Error updating note");
    }
  };

  // Delete note
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${note.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Note deleted!");
      onUpdate();
    } catch (error) {
      toast.error("Error deleting note");
    }
  };

   return (
    <div className="p-4 border rounded shadow">
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-1 mb-1 w-full"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-1 mb-1 w-full"
          />
          {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-3 py-1 rounded">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-3 py-1 rounded">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold">{note.title}</h2>
          <p>{note.content}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setIsEditing(true)} className="bg-yellow-400 px-3 py-1 rounded">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteCard;
