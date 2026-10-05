import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

interface NoteFormProps {
  onNoteCreated: () => void;
}

const NoteForm = ({ onNoteCreated }: NoteFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({ title: "", content: "" });

  const validate = () => {
    const newErrors = { title: "", content: "" };
    if (!title.trim()) newErrors.title = "Title is required";
    if (content.trim().length < 5) newErrors.content = "Content must be at least 5 characters";
    setErrors(newErrors);
    return !newErrors.title && !newErrors.content;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.post("/notes", { title, content }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Note created!");
      setTitle("");
      setContent("");
      onNoteCreated();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create note");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md px-3 py-2 shadow-sm w-full transition"
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md px-3 py-2 shadow-sm w-full transition resize-none"
      />
      {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200">
        Add Note
      </button>
    </form>
  );
};

export default NoteForm;
