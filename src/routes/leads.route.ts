import { Router } from "express";
import { createLead, deleteLead, getAllLeads, getLeadById, updateLead } from "../controllers/leads.controller";
import { validateLeadPayload } from "../middleware/lead.validation";
import { createNote, getNotesByLeadId } from "../controllers/notes.controller";
import { validateNotePayload } from "../middleware/note.validation";

const router = Router();

// leads api routes
router.post("/", validateLeadPayload(false), createLead);
router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.put("/:id", validateLeadPayload(true), updateLead);
router.patch("/:id", validateLeadPayload(true), updateLead);
router.delete("/:id", deleteLead);

// notes api routes
router.post("/:id/notes", validateNotePayload, createNote);
router.get("/:id/notes", getNotesByLeadId);

export default router;