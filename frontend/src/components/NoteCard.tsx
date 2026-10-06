import { useState } from "react";
import type { Note } from "../api/notes";
import { updateNote, deleteNote } from "../api/notes";
import { toast } from "react-toastify";

interface NoteCardProps {
  note: Note;
  onUpdate: () => void;
}

const NoteCard = ({ note, onUpdate }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleUpdate = async () => {
    if (!title.trim() || content.trim().length < 5) {
      toast.error("Please enter a title and at least 5 characters of content.");
      return;
    }

    try {
      await updateNote(note.id, {
        title: title.trim(),
        content: content.trim(),
      });

      toast.success("Note updated!");
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update note."
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(note.id);
      toast.success("Note deleted!");
      setShowDeleteConfirm(false);
      onUpdate();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete note."
      );
    }
  };

  if (isEditing) {
    return (
      <article className="note-card">
        <div className="note-edit-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea"
          />

          <div className="note-actions">
            <button onClick={handleUpdate} className="primary-button">
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="secondary-button"
            >
              Cancel
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <>
      <article className="note-card">
        <h2 className="note-title">{note.title}</h2>

        <p className="note-content">{note.content}</p>

        <div className="note-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="secondary-button"
          >
            Edit
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="danger-button"
          >
            Delete
          </button>
        </div>
      </article>

      {showDeleteConfirm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Delete note?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>"{note.title}"</strong>? This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="secondary-button"
              >
                Cancel
              </button>

              <button onClick={handleDelete} className="danger-button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;