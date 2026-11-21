const Groq = require("groq-sdk");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

if (!process.env.GROQ_API) {
  throw new Error("Missing GROQ_API in environment variables");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API,
});

async function generateRecommendation(student, organizations) {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `
          You are OrgFinder's AI organization recommendation assistant.

          Your task is to recommend the three most suitable student organizations.

          Consider:
          1. The student's academic course.
          2. Organization categories.
          3. Organization descriptions.
          4. Organization membership counts.

          Rules:
          - Only recommend organizations from the provided list.
          - Never invent organization IDs or names.
          - Consider the student's academic background.
          - Give smaller organizations a fair chance of being recommended.
          - Return exactly three different organizations.
          - Never return duplicate organization IDs.
          - Provide a brief explanation for each recommendation.
          - Respond only in valid JSON.
          - The recommendations array must contain exactly three objects.

          Required JSON format:
          {
            "recommendations": [
              {
                "organization_id": 0,
                "reason": "Brief explanation of why this organization was recommended."
              },
              {
                "organization_id": 0,
                "reason": "Brief explanation of why this organization was recommended."
              },
              {
                "organization_id": 0,
                "reason": "Brief explanation of why this organization was recommended."
              }
            ]
          }   
        `,
      },
      {
        role: "user",
        content: JSON.stringify({
          student,
          organizations,
        }),
      },
    ],
    temperature: 0.7,
    response_format: {
      type: "json_object",
    },
  });

  const result = response.choices[0].message.content;

  console.log("groq raw response:", result);

  const parsedResult = JSON.parse(result);

  console.log("groq parsed response:", parsedResult);

  return parsedResult;
}

module.exports = {
  generateRecommendation,
};
