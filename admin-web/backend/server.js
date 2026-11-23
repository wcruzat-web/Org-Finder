
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import organizationAccountRoutes from "./routes/organizationAccountRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import adminAccountRoutes from "./routes/adminAccountRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//* health check
app.get("/", (req, res) => {
  res.json({
    message: "OrgApp Backend API is running",
  });
});

//* route registrations
app.use("/api/organization-accounts", organizationAccountRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/admin-accounts", adminAccountRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
