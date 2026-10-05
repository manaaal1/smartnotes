import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from "../controllers/noteController";

const router = express.Router();

router.use(authenticate);

// All routes require authentication
router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
