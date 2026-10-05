import api from "./axios";

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteInput {
  title: string;
  content: string;
}

// Get all notes
export const getNotes = async (): Promise<Note[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get("/notes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new note
export const createNote = async (note: NoteInput): Promise<Note> => {
  const token = localStorage.getItem("token");
  const response = await api.post("/notes", note, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update a note
export const updateNote = async (id: number, note: NoteInput) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/notes/${id}`, note, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a note
export const deleteNote = async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
