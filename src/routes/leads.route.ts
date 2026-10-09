import { Router } from "express";
import { createLead, deleteLeadRecord, getAllLeadRecords, getLeadById, updateLeadRecord } from "../controllers/leads.controller";
import { validateLeadPayload } from "../middleware/lead.validation";
import { createNote, getNotesByLeadId } from "../controllers/notes.controller";
import { validateNotePayload } from "../middleware/note.validation";
const route = Router();

// leads api routes
route.post("/", validateLeadPayload(false), createLead);
route.get("/", getAllLeadRecords);
route.get("/:id", getLeadById);
route.put("/:id", validateLeadPayload(true), updateLeadRecord);
route.patch("/:id", validateLeadPayload(true), updateLeadRecord);
route.delete("/:id", deleteLeadRecord);

// notes api routes
route.post("/:id/notes", validateNotePayload, createNote);
route.get("/:id/notes", getNotesByLeadId);

export default route;