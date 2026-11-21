const { generateRecommendation } = require("./groqService");

const student = {
  course: "BS Information Technology",
};

const organizations = [
  {
    id: 1,
    name: "Computer Science Organization",
    category: "Academic",
    description: "An organization focused on technology and programming.",
    memberCount: 25,
  },
  {
    id: 2,
    name: "The Gazette",
    category: "Non Academic",
    description: "A student publication organization.",
    memberCount: 10,
  },
];

async function testGroq() {
  try {
    const result = await generateRecommendation(student, organizations);

    console.log("Groq connection successful!");
    console.log("Recommendation:", result);
  } catch (error) {
    console.error("Groq test failed:", error.message);
  }
}

testGroq();
