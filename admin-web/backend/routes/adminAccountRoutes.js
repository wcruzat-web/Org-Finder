import express from "express";
import { createAdminAccount } from "../controllers/adminAccountController.js";

const router = express.Router();

// Initial admin setup
router.post("/setup", createAdminAccount);

export default router;
