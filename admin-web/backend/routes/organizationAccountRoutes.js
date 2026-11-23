import express from "express";

import {
  getAvailableOrganizations,
  getOrganizationAccounts,
  createOrganizationAccount,
} from "../controllers/organizationAccountController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// all routes require an authenticated admin
router.use(authMiddleware, adminMiddleware);

// get organizations without accounts
router.get("/available-organizations", getAvailableOrganizations);

// get all organization accounts
router.get("/", getOrganizationAccounts);

// create an organization account
router.post("/", createOrganizationAccount);

export default router;
