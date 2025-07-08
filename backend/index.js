const express = require("express");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });



app.post("/api/questioncheck", async (req, res) => {
   const {
    name,
    location,
    education,
    fatherName,
    motherName,
    siblings,
    Hobbies,
  } = req.body;
     const prompt = `Based on the candidate's profile below,generate a basic English speaking question designed to evaluate a person's fluency. The question should be open-ended and encourage the speaker to speak for at least a minute.enerate a basic English question just to check a person's vocabulary and grammar, question without any header and footer only question ";
Name: ${name}
Location: ${location}
Education: ${education}
Father's Name: ${fatherName}
Mother's Name: ${motherName}
Number of Siblings: ${siblings}
Your Hobbies: ${Hobbies}

Respond with only one  question.`


    try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = await response.text();
     const question = content.trim();
    res.json({ question});
    } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ error: "Failed to generate question using Gemini." });
  }
});
app.get("/api/question/beginer", async (req, res) => {
  
    const prompt = "Generate a  English speaking question suitable for beginners designed to evaluate a person's fluency. The question should be open-ended and encourage the speaker to speak for at least a minute.enerate a beginners level English question just to check a person's vocabulary and grammar,give only one question without any description ";
    try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = await response.text();
     const question = content.trim();
    res.json({ question});
    } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ error: "Failed to generate question using Gemini." });
  }
});
app.get("/api/question/intermediate", async (req, res) => {
  
    const prompt = "Generate a  intermediate level English speaking question designed to evaluate a person's fluency. The question should be open-ended and encourage the speaker to speak for at least a minute.enerate a intermediate level English question just to check a person's vocabulary and grammar,give only one question without any description ";
    try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = await response.text();
     const question = content.trim();
    res.json({question});
    } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ error: "Failed to generate question using Gemini." });
  }
});
app.get("/api/question/expert", async (req, res) => {
  
    const prompt = "Generate a expert level English speaking question designed to evaluate a person's fluency. The question should be open-ended and encourage the speaker to speak for at least a minute.enerate a expert level English question just to check a person's vocabulary and grammar,give only one question without any description ";
    try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = await response.text();
     const question = content.trim();
    res.json({ question});
    } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ error: "Failed to generate question using Gemini." });
  }
});
app.post("/api/answer/check", async (req, res) => {
    const {text}=req.body;
     if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No Question provided" });
  }
  
    const prompt = `Generate a basic answer of the provided question.
    Question:${text} Respond with only one answer in a readable gramatically correct form with maximum of 4 to 5 lines.
    `;
    try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = await response.text();
     const answer = content.trim();
    res.json({ answer});
    } catch (err) {
    console.error("Gemini AI error:", err.message);
     
    res.status(500).json({ error: "Failed to generate question using Gemini." });
  }
});
app.post("/api/answer/beginer", async (req, res) => {
    const {text}=req.body;
  
    const prompt = `Generate a basic answer of the provided question suitable for beginners.
    Question:${text}
    Respond with only one answer in a readable gramatically correct form with maximum of 4 to 5 lines.`
    
    try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = await response.text();
     const answer = content.trim();
    res.json({ answer});
    } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ error: "Failed to generate question using Gemini." });
  }
});
app.post("/api/answer/intermediate", async (req, res) => {
    const { text } = req.body;
  
    const prompt = `Generate an answer to the provided question suitable for intermediate level. Question: ${text}
    Respond with only one answer in a readable gramatically correct form with maximum of 4 to 5 lines.`;
    try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = await response.text();
     const answer = content.trim();
    res.json({ answer});
    } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ error: "Failed to generate question using Gemini." });
  }
});
app.post("/api/answer/expert", async (req, res) => {
    const { text } = req.body;
  
    const prompt = `Generate an answer to the provided question suitable for expert level. Question: ${text}
    Respond with only one answer in a readable gramatically correct form with maximum of 4 to 5 lines.`;
    try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = await response.text();
     const answer = content.trim();
    res.json({ answer});
    } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ error: "Failed to generate question using Gemini." });
  }
});
app.post("/api/analyze-answer", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No text provided" });
  }

  const prompt = `
You are an English professor. Analyze the following student's spoken answer and rate:
1. Fluency from 0-100%
2. Grammar accuracy from 0-100%
Text: "${text}"
Respond in JSON format: {  "grammar": number }
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = await response.text();

    const json = JSON.parse(content);
    res.json({
      
      grammar: json.grammar,
    });
  } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ error: "Failed to analyze response using Gemini." });
  }
});



app.post("/api/engineering-question", upload.single("resume"), async (req, res) => {
  const {
    name,
    location,
    education,
    fatherName,
    motherName,
    siblings,
  } = req.body;

  const prompt = `
You are a technical interviewer. Based on the candidate's profile below, generate a relevant engineering interview question:

Name: ${name}
Location: ${location}
Education: ${education}
Father's Name: ${fatherName}
Mother's Name: ${motherName}
Number of Siblings: ${siblings}

Respond with only one interview question .
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = await response.text();

    const question = content.trim();
    res.json({ question});
  } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ error: "Failed to generate question using Gemini." });
  }
});

app.post("/api/engineering-question/answer", async (req, res) => {
  const { text } = req.body;
    
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No text provided" });
  }

  const prompt = `
You are a technical student sitting for an interview. Based on the question provided generate an impressive answer:
 Question: ${text}


Respond with only one answer in a readable format in paragraph with correct grammer with maximum of 4 to 5 lines .
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content =  await response.text();

    const answer = content.trim();
    res.json({ answer });
  } catch (err) {
    console.error("Gemini AI error:", err.message);
    res.status(500).json({ error: "Failed to generate answer using Gemini." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(express.static(path.join(__dirname, "../fontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../fontend/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
