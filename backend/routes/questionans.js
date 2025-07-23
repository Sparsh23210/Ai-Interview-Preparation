const express = require('express');
const router = express.Router();
const multer = require('multer');
const { generateWithFallback } = require('../Fallbackai');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const fs = require("fs");
const pdfParse = require("pdf-parse");
router.post('/engineering', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Resume file is required" });
  }

  try {
    
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    const prompt = `
You are a technical interviewer. The following is a candidate’s resume content. Identify all technical projects (if any) from the resume and generate 10 technical interview questions based on those projects. Ask questions that assess understanding of technologies used, challenges faced, design decisions, scalability, and practical implementation.

Resume Content:
${resumeText}

Return the questions as a JSON array only.
Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }
Do not include any extra explanation or markdown formatting.
`;

    const { text } = await generateWithFallback(prompt);
    const cleaned = text.trim();

    let questions = [];

    try {
      const parsed = JSON.parse(cleaned);
      if (!parsed.question || !Array.isArray(parsed.question)) {
        throw new Error("Invalid format from AI");
      }
      questions = parsed.question;
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr.message);
    }

    res.json({ question: questions });

    
    fs.unlink(req.file.path, () => {});
  } catch (err) {
    console.error("AI generation error:", err.message);
    return res.status(500).json({
      question: ["Explain your recent project in detail."],
    });
  }
});
router.post('/question/check', async (req, res) => {
 
  const { name, education } = req.body;
   if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: "Request body is missing or invalid." });
  }
  if (!name || !education) {
    return res.status(400).json({ error: "Name and education are required." });
  }

  const prompt = `Based on the candidate's profile below, generate a basic English speaking question designed to evaluate fluency. It should be open-ended, only one question.
Name: ${name}
Education: ${education}
`;

  try {
    const { text } = await generateWithFallback(prompt);
    res.json({ question: text});
  } catch (err) {
    res.json({ question: "Can you tell me about your daily routine and how your hobbies influence your life?", provider: "default" });
  }
});


router.get('/question/beginer', async (req, res) => {
  const prompt = `Generate 10 beginner-level English speaking questions. Each should be open-ended to evaluate vocabulary and grammar. Return only valid JSON in this format:
{ "question": ["Q1", "Q2", ..., "Q10"] }`;

  try {
    const { text } = await generateWithFallback(prompt);
     let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    let questions = [];
    try {
      const parsed = JSON.parse(cleaned);
      if (!parsed.question || !Array.isArray(parsed.question)) throw new Error("Invalid format");
      questions = parsed.question;
    } catch (parseErr) {
      console.error("Parse error:", parseErr.message);
    }

    res.json({ question: questions });
  } catch (err) {
    res.json({ question: ["Can you describe your daily routine?"] });
  }
});

router.get('/learn', async (req, res) => {
  const prompt = `Generate a English speaking question. Open-ended, check vocabulary and grammar. Return only the question.`;

  try {
    const {text } = await generateWithFallback(prompt);
    res.json({ question: text });
  } catch (err) {
    res.json({ question: "Can you describe your daily routine?"});
  }
});


router.get('/question/intermediate', async (req, res) => {
  const prompt = `Generate 10 intermediate-level English speaking questions to evaluate fluency. All questions should be open-ended. Return only valid JSON:
{ "question": ["Q1", "Q2", ..., "Q10"] }`;

  try {
    const { text } = await generateWithFallback(prompt);
    let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    let questions = [];
    try {
      const parsed = JSON.parse(cleaned);
      if (!parsed.question || !Array.isArray(parsed.question)) throw new Error("Invalid format");
      questions = parsed.question;
    } catch (parseErr) {
      console.error("Parse error:", parseErr.message);
    }

    res.json({ question: questions });
  } catch (err) {
    res.json({ question: ["What are the benefits and drawbacks of online education?"] });
  }
});

router.get('/question/ai', async (req, res) => {
 const prompt = `Generate 10 AI interview question (beginner/intermediate/hard) based on candidate level (B.Tech or M.Tech). Focus on core AI topics: ML, DL, Neural Networks, NLP, CV, or AI ethics. Tailor it for top tech companies.Return only the questions in a numbered list. 
Return only valid JSON without Markdown code block. Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }`

  try {
     const { text } = await generateWithFallback(prompt);
    let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }
let questions = [];

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !Array.isArray(parsed.question)) {
      throw new Error("Invalid format");
    }

    questions = parsed.question;

  } catch (parseErr) {
    
    console.error("Parse error:", parseErr.message);
    
  }

  res.json({ question: questions });
  } catch (err) {
    alert("Go back and try again");
  }
});

router.get('/question/dsa', async (req, res) => {
  const prompt = `Give 10 random DSA interview question (beginner/intermediate/hard) suitable for tech interviews. Focus on common topics like Arrays, Trees, Graphs, DP, etc. Return only the questions in a numbered list.
Return only valid JSON without Markdown code block. Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }`

  try {
     const { text } = await generateWithFallback(prompt);
     let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }
  
let questions = [];

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !Array.isArray(parsed.question)) {
      throw new Error("Invalid format");
    }

    questions = parsed.question;

  } catch (parseErr) {
    
    console.error("Parse error:", parseErr.message);
    
  }

  res.json({ question: questions });
  } catch (err) {
    alert("Go back and try again");
  }
});
router.get('/question/common', async (req, res) => {
  const prompt = `Give 10 common non-technical (behavioral or soft-skill) interview questions suitable for software engineering or tech roles. Questions should assess communication, teamwork, problem-solving, leadership, adaptability, and work ethic. Return only the questions in a numbered list.
Return only valid JSON without Markdown code block. Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }`;


  try {
     const { text } = await generateWithFallback(prompt);
     let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }
  
let questions = [];

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !Array.isArray(parsed.question)) {
      throw new Error("Invalid format");
    }

    questions = parsed.question;

  } catch (parseErr) {
    
    console.error("Parse error:", parseErr.message);
    
  }

  res.json({ question: questions });
  } catch (err) {
    alert("Go back and try again");
  }
});

router.get('/question/os', async (req, res) => {
  const prompt = `Generate 10 OS interview question (any level) for B.Tech/M.Tech. Focus: processes, memory, scheduling, deadlocks, or file systems. For top tech interviews.Return only the questions in a numbered list.
Return only valid JSON without Markdown code block. Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }`

  try {
     const { text } = await generateWithFallback(prompt);
     let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }
  
let questions = [];

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !Array.isArray(parsed.question)) {
      throw new Error("Invalid format");
    }

    questions = parsed.question;

  } catch (parseErr) {
    
    console.error("Parse error:", parseErr.message);
    
  }

  res.json({ question: questions });
  } catch (err) {
   alert("Go back and try again");
  }
});

router.get('/question/cn', async (req, res) => {
  const prompt = `Generate 10 CN interview question (any level) for B.Tech/M.Tech. Focus: OSI, TCP/IP, routing, DNS, or protocols. For top tech interviews.Return only the questions in a numbered list.
Return only valid JSON without Markdown code block. Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }`
  try {
    const { text } = await generateWithFallback(prompt);
     let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }
  
let questions = [];

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !Array.isArray(parsed.question)) {
      throw new Error("Invalid format");
    }

    questions = parsed.question;

  } catch (parseErr) {
    
    console.error("Parse error:", parseErr.message);
    
  }

  res.json({ question: questions });
  } catch (err) {
    alert("Go back and try again");
  }
});


router.get('/question/dbms', async (req, res) => {
 const prompt = `Generate 10 DBMS interview question (any level) for B.Tech/M.Tech. Focus: SQL, normalization, indexing, transactions, ACID, or ER models. For top tech interviews.Return only the questions in a numbered list.
Return only valid JSON without Markdown code block. Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }`

  try {
    const { text } = await generateWithFallback(prompt);
     let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }
  
let questions = [];

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !Array.isArray(parsed.question)) {
      throw new Error("Invalid format");
    }

    questions = parsed.question;

  } catch (parseErr) {
    
    console.error("Parse error:", parseErr.message);
    
  }

  res.json({ question: questions });
  } catch (err) {
    alert("Go back and try again");
  }
});

router.get('/question/oops', async (req, res) => {
  const prompt = `Generate 10 OOP interview question (any level) for B.Tech/M.Tech. Focus: inheritance, polymorphism, encapsulation, abstraction, interfaces, or SOLID. For top tech interviews.Return only the questions in a numbered list. 
Return only valid JSON without Markdown code block. Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }`
  try {
     const { text } = await generateWithFallback(prompt);
     let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }
  
let questions = [];

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !Array.isArray(parsed.question)) {
      throw new Error("Invalid format");
    }

    questions = parsed.question;

  } catch (parseErr) {
    
    console.error("Parse error:", parseErr.message);
    
  }

  res.json({ question: questions });
  } catch (err) {
   alert("error");
  }
});
router.get('/question/Devops', async (req, res) => {
  const prompt = `Generate 10 DevOps interview question (any level) for B.Tech/M.Tech. Focus: CI/CD, Docker, Kubernetes, version control, monitoring, or cloud (AWS/GCP/Azure). For top tech interviews. Return only the questions in a numbered list.
Return only valid JSON without Markdown code block. Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }`

  try {
    const { text } = await generateWithFallback(prompt);
     let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }
  
let questions = [];

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !Array.isArray(parsed.question)) {
      throw new Error("Invalid format");
    }

    questions = parsed.question;

  } catch (parseErr) {
    console.error("Parse error:", parseErr.message);
    
  }

  res.json({ question: questions }); 
  } catch (err) {
   alert("Go Back and try Again");
  }
});
router.get('/question/sd', async (req, res) => {
  const prompt = `
Generate 10 system design interview questions (basic to advanced) for B.Tech/M.Tech students. Focus on scalability, load balancing, caching, databases, and distributed systems. Return only the questions in a numbered list.
Return only valid JSON without Markdown code block. Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }`;



  try {
   const { text } = await generateWithFallback(prompt);
     let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }
  
let questions = [];

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !Array.isArray(parsed.question)) {
      throw new Error("Invalid format");
    }

    questions = parsed.question;

  } catch (parseErr) {
    console.error("Parse error:", parseErr.message);
    
  }

  res.json({ question: questions }); 
  } catch (err) {
   alert("Go Back and try Again")
  }
});



router.get('/question/expert', async (req, res) => {
  const prompt = `Generate 10 expert-level English speaking questions to evaluate fluency. All questions must be open-ended and analytical. Return only valid JSON:
{ "question": ["Q1", "Q2", ..., "Q10"] }`;

  try {
    const { text } = await generateWithFallback(prompt);
     let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    let questions = [];
    try {
      const parsed = JSON.parse(cleaned);
      if (!parsed.question || !Array.isArray(parsed.question)) throw new Error("Invalid format");
      questions = parsed.question;
    } catch (parseErr) {
      console.error("Parse error:", parseErr.message);
    }

    res.json({ question: questions });
  } catch (err) {
    res.json({ question: ["Should governments regulate AI technology development? Why or why not?"] });
  }
});





router.post('/answer/beginer', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No question provided." });
  }

  const prompt = `Generate an English answer for the following question suitable for beginner level.
Question: ${text}
Return only one answer in correct grammar, 5-6 lines max.`;

  try {
    const {text: answer } = await generateWithFallback(prompt);
    res.json({ answer});
  } catch (err) {
    res.json({ answer: "This question requires thoughtful analysis and a structured response."});
  }
});
router.post('/subject/answer', async (req, res) => {
  const { text } = req.body;

  const prompt = `You are a student preparing for an interview. Generate an impressive, grammatically correct answer (4-5 lines) to:
Question: ${text}`;

  try {
    const { text: answer } = await generateWithFallback(prompt);
    const plainAnswer = answer.replace(/[*_`~]/g, '').trim();
    res.json({ answer:plainAnswer});
  } catch (err) {
    res.json({ answer: "Polymorphism allows objects to behave differently based on their type, improving flexibility and code reuse.", provider: "default" });
  }
});
router.post('/learn/answer', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No question provided." });
  }

  const prompt = `Generate an English answer for the following question suitable for improving english.
Question: ${text}
Return only one answer in correct grammar, 9-10 lines max.`;

  try {
    const {text: answer } = await generateWithFallback(prompt);
    const plainAnswer = answer.replace(/[*_`~]/g, '').trim();
    res.json({ answer:plainAnswer});
  } catch (err) {
    res.json({ answer: "This question requires thoughtful analysis and a structured response."});
  }
});


router.post('/answer/intermediate', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No question provided." });
  }

  const prompt = `Generate an English answer for the following question suitable for intermediate level.
Question: ${text}
Return only one answer in correct grammar, 4–5 lines max.`;

  try {
    const { text: answer } = await generateWithFallback(prompt);
   const plainAnswer = answer.replace(/[*_`~]/g, '').trim();
    res.json({ answer:plainAnswer});
  } catch (err) {
    res.json({ answer: "This question requires thoughtful analysis and a structured response.", provider: "default" });
  }
});


router.post('/answer/expert', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No question provided." });
  }

  const prompt = `Generate an English answer for the following question suitable for expert level.
Question: ${text}
Return only one answer in correct grammar, 4–5 lines max.`;

  try {
    const {  text: answer } = await generateWithFallback(prompt);
   const plainAnswer = answer.replace(/[*_`~]/g, '').trim();
    res.json({ answer:plainAnswer});
  } catch (err) {
    res.json({ answer: "This question requires thoughtful analysis and a structured response."});
  }
});


router.post('/answer/check', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No question provided." });
  }

  const prompt = `Generate an English answer for the following question suitable for general fluency check.
Question: ${text}
Return only one answer in correct grammar, 5-6 lines max.`;

  try {
    const { text: answer } = await generateWithFallback(prompt);
   const plainAnswer = answer.replace(/[*_`~]/g, '').trim();
    res.json({ answer:plainAnswer});
  } catch (err) {
    res.json({ answer: "This question requires thoughtful analysis and a structured response."});
  }
});




router.post('/engineering-question', upload.single('resume'), async (req, res) => {
  const { name, education } = req.body;

   const prompt = `
You are a technical interviewer. Generate 10 different and relevant technical interview questions based on the following profile. Return the questions as a JSON array only.

Candidate Profile:
Name: ${name}
Education: ${education}
resume:null

Return only valid JSON without Markdown code block. Format strictly like this:
{ "question": ["Q1", "Q2", ..., "Q10"] }

  `;


  try {
    
    const { text } = await generateWithFallback(prompt);
    const cleaned = text.trim();
  
let questions = [];

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !Array.isArray(parsed.question)) {
      throw new Error("Invalid format");
    }

    questions = parsed.question;

  } catch (parseErr) {
    console.error("Parse error:", parseErr.message);
    
  }

  res.json({ question: questions }); 

} catch (err) {
  console.error("AI generation error:", err.message);
  return res.status(500).json({
    question: [
       "Explain polymorphism in object-oriented programming.",
        "What is the difference between a stack and a queue?",
        "Describe your process for debugging a complex software issue.",
        "How does a REST API work?",
        "What is the difference between GET and POST requests?",
        "Explain the benefits of version control systems like Git.",
        "What is Big-O notation?",
        "What are HTTP status codes and what does 404 mean?",
        "How do you optimize a slow SQL query?",
        "What is the difference between synchronous and asynchronous programming?"
    ],
    
  })}});

router.post('/engineering-question/answer', async (req, res) => {
  const { text } = req.body;

  const prompt = `You are a student preparing for an interview. Generate an impressive, grammatically correct answer (4-5 lines) to:
Question: ${text}`;

  try {
    const { text: answer } = await generateWithFallback(prompt);
    const plainAnswer = answer.replace(/[*_`~]/g, '').trim();
    res.json({ answer:plainAnswer});
  } catch (err) {
    res.json({ answer: "Polymorphism allows objects to behave differently based on their type, improving flexibility and code reuse.", provider: "default" });
  }
});



router.post('/analyze-answer', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No text provided" });
  }

  const prompt = `
You are an English professor. Analyze the following student's spoken answer and rate grammar from 0-100%.
Respond only in strict JSON format like this: { "grammar": number }

Text: "${text}"
`;

  try {
    const { text: raw } = await generateWithFallback(prompt);

    const match = raw.match(/\{[^}]*\}/);
    if (!match) throw new Error('No valid JSON found in response');

    const json = JSON.parse(match[0]);
    res.json({ grammar: json.grammar});
  } catch (err) {
    console.error("AI JSON parse error:", err.message);
    res.json({ grammar: 0});
  }
});
router.post("/engineering/answer",upload.single("resume"), async (req, res) => {
  try{
  const { question } = req.body;
const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Resume file is required." });
    }

  
    const pdfText = await pdfParse(file.buffer);
    const fullText = pdfText.text;

   
    const projectSection = extractProjectSection(fullText); 

   
    const aiPrompt = `Using the following resume project details:\n\n${projectSection}\n\nAnswer the following question in impressive way assuming yourself as technical students:\n${question}`;
    const aiAnswer = await generateAnswerFromAI(aiPrompt); 

    res.json({ answer: aiAnswer });
  } catch (error) {
    console.error("Error generating answer:", error);
    res.status(500).json({ error: "Failed to generate answer." });
  }
});


function extractProjectSection(text) {
  const lower = text.toLowerCase();
  const start = lower.indexOf("project");
  if (start === -1) return text; // fallback if "project" section not found

  const sliced = text.slice(start);
  const nextSectionIndex = sliced.search(/\n[A-Z][A-Z\s]{3,}\n/); // crude next section match
  return nextSectionIndex !== -1 ? sliced.slice(0, nextSectionIndex) : sliced;
}



module.exports = router;
