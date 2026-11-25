
import express from "express";

import { createAdminAccount } from "../controllers/adminAccountController.js";
import {
  assignOrganizationOfficer,
} from "../controllers/organizationOfficerController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// initial admin setup, pwede na to disregard 
router.post("/setup", createAdminAccount);

// organization officer management
router.post(
  "/organizations/:organizationId/officers",
  authMiddleware,
  adminMiddleware,
  assignOrganizationOfficer
);

export default router;
