import { useState } from "react";
import { createNote } from "../api/notes";
import { toast } from "react-toastify";

interface NoteFormProps {
  onNoteCreated: () => void;
}

const NoteForm = ({ onNoteCreated }: NoteFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: title.trim() ? "" : "Title is required.",
      content:
        content.trim().length >= 5
          ? ""
          : "Content must be at least 5 characters.",
    };

    setErrors(newErrors);

    if (newErrors.title || newErrors.content) return;

    try {
      await createNote({
        title: title.trim(),
        content: content.trim(),
      });

      toast.success("Note created!");
      setTitle("");
      setContent("");
      setErrors({ title: "", content: "" });
      onNoteCreated();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create note."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <h2 className="section-title">Create a note</h2>

      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          type="text"
          placeholder="Give your note a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Content</label>
        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-textarea"
        />
        {errors.content && (
          <p className="form-error">{errors.content}</p>
        )}
      </div>

      <button type="submit" className="primary-button">
        Add note
      </button>
    </form>
  );
};

export default NoteForm;