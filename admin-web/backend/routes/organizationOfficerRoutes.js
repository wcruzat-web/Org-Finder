
import express from "express";

import {
  assignOrganizationOfficer,
  removeOrganizationOfficer,
  getMyOfficerOrganizations,
  getOrganizationOfficers,
} from "../controllers/organizationOfficerController.js";

import {
  searchStudentAccounts,
} from "../controllers/adminAccountController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// retrieve organizations where the logged-in student is an officer
router.get(
  "/my-officer-organizations",
  authMiddleware,
  getMyOfficerOrganizations,
);

// search existing student accounts
router.get(
  "/students/search",
  authMiddleware,
  adminMiddleware,
  searchStudentAccounts,
);

// retrieve officers assigned to an organization
router.get(
  "/:organizationId/officers",
  authMiddleware,
  adminMiddleware,
  getOrganizationOfficers,
);

// assign a student as an organization officer
router.post(
  "/:organizationId/officers",
  authMiddleware,
  adminMiddleware,
  assignOrganizationOfficer,
);

// remove officer privileges while keeping membership
router.delete(
  "/:organizationId/officers",
  authMiddleware,
  adminMiddleware,
  removeOrganizationOfficer,
);

export default router;
