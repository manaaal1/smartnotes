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

export const getNotes = async (search = ""): Promise<Note[]> => {
  const response = await api.get("/notes", {
    params: { search },
  });

  return response.data.notes || [];
};

export const createNote = async (note: NoteInput): Promise<Note> => {
  const response = await api.post("/notes", note);
  return response.data.note;
};

export const updateNote = async (
  id: number,
  note: NoteInput
): Promise<void> => {
  await api.put(`/notes/${id}`, note);
};

export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`/notes/${id}`);
};