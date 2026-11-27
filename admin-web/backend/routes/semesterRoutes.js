
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

import {
  getSemesters,
  createSemester,
  updateSemester,
} from "../controllers/semesterController.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getSemesters);
router.post("/", authMiddleware, adminMiddleware, createSemester);
router.put("/:id", authMiddleware, adminMiddleware, updateSemester);

export default router;
