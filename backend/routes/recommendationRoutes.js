const express = require("express");
const router = express.Router();

const { getDailyRecommendation } = require("../services/recommendationService");

router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid authorization header",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    const recommendations = await getDailyRecommendation(accessToken);

    return res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);

    const isUnauthorized = error.message.includes("Unauthorized");

    return res.status(isUnauthorized ? 401 : 500).json({
      success: false,
      message:
        error.message || "An error occurred while fetching recommendations",
    });
  }
});

module.exports = router;
