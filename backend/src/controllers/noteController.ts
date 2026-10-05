import { Request, Response } from "express";
import { prisma } from "../prisma";

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = (req as any).user.id; // from JWT

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Both title and content are required." });
    }

    const note = await prisma.note.create({
      data: { title, content, userId },
    });

    res.status(201).json({ message: "Note created successfully.", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating note" });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const search = req.query.search as string | undefined;

    const notes = await prisma.note.findMany({
      where: {
        userId,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

     if (notes.length === 0) {
      return res.status(200).json({ message: "No matching notes found.", notes: [] });
    }

    res.json({ message: "Notes fetched successfully.", notes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const noteId = parseInt(req.params.id);
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch {
    res.status(500).json({ message: "Error fetching note" });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const noteId = parseInt(req.params.id);
    const { title, content } = req.body;

     if (!title && !content) {
      return res
        .status(400)
        .json({ message: "Please provide a title or content to update." });
    }

    const note = await prisma.note.updateMany({
      where: { id: noteId, userId },
      data: { title, content },
    });

    if (note.count === 0) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note updated successfully" });
  } catch {
    res.status(500).json({ message: "Error updating note" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const noteId = parseInt(req.params.id);

    const note = await prisma.note.deleteMany({
      where: { id: noteId, userId },
    });

    if (note.count === 0) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting note" });
  }
};
