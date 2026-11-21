const express = require("express");
const cors = require("cors");
require("dotenv").config();


//para sa recommendations hey
const recommendations = require("./routes/recommendationRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Orgfinder Recommendation API is running",
  });
});

app.use("/api/recommendations", recommendations);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
