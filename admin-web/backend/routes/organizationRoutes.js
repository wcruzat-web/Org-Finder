import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

import {
  getOrganizations,
  createOrganization,
} from "../controllers/organizationController.js";

const router = express.Router();

//* protect routes: admin access only
router.use(authMiddleware, adminMiddleware);

//* get all organizations
router.get("/", getOrganizations);

//* create a new organization
router.post("/", createOrganization);

export default router;
