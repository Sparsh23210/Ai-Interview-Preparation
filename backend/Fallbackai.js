const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const TIMEOUT = 15000;


const axiosPost = (url, data, config) => 
  axios.post(url, data, { timeout: TIMEOUT, ...config });
async function openaiHandler(prompt) {
  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4.1',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_API}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.choices[0].message.content.trim();
}


async function geminiHandler(prompt) {
    if (!process.env.GEMINI_API_KEY) {
  throw new Error("environment variable is not set.");
}
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.candidates?.[0]?.content?.parts?.[0]?.text.trim();
}


async function cohereHandler(prompt) {
  const res = await axios.post(
    'https://api.cohere.ai/v1/generate',
    {
      model: 'command-r-plus',
      prompt,
      max_tokens: 300,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.generations[0].text.trim();
}


async function huggingFaceHandler(prompt) {
  const res = await axios.post(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
    }
  );
  return res.data[0].generated_text.trim();
}


// async function replicateHandler(prompt) {
//   const res = await axios.post(
//     'https://api.replicate.com/v1/predictions',
//     {
//       version: 'YOUR_MODEL_VERSION_ID', // e.g. from https://replicate.com/
//       input: { prompt },
//     },
//     {
//       headers: {
//         Authorization: 'Token YOUR_REPLICATE_API_TOKEN',
//         'Content-Type': 'application/json',
//       },
//     }
//   );
//   return res.data.output.trim();
// }


async function openRouterHandler(prompt) {
  const res = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'openai/gpt-4o', 
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.choices[0].message.content.trim();
}


async function groqHandler(prompt) {
  const res = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.choices[0].message.content.trim();
}


async function deepSeekHandler(prompt) {
  const res = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.choices[0].message.content.trim();
}





async function generateWithFallback(prompt) {
  let result;

  try {
    console.log('Trying: OpenAI');
    result = await openaiHandler(prompt);
    if (result) return { text: result };
  } catch (err) {
    console.warn(`❌ OpenAI failed: ${err.message}`);
  }

  try {
    console.log('Trying: Gemini');
    result = await geminiHandler(prompt);
    if (result) return {  text: result };
  } catch (err) {
    console.warn(`❌ Gemini failed: ${err.message}`);
  }

  try {
    console.log('Trying: Cohere');
    result = await cohereHandler(prompt);
    if (result) return {  text: result };
  } catch (err) {
    console.warn(`❌ Cohere failed: ${err.message}`);
  }

  try {
    console.log('Trying: HuggingFace');
    result = await huggingFaceHandler(prompt);
    if (result) return {  text: result };
  } catch (err) {
    console.warn(`❌ HuggingFace failed: ${err.message}`);
  }



  try {
    console.log('Trying: OpenRouter');
    result = await openRouterHandler(prompt);
    if (result) return {  text: result };
  } catch (err) {
    console.warn(`❌ OpenRouter failed: ${err.message}`);
  }

  try {
    console.log('Trying: Groq');
    result = await groqHandler(prompt);
    if (result) return {  text: result };
  } catch (err) {
    console.warn(`❌ Groq failed: ${err.message}`);
  }

  try {
    console.log('Trying: DeepSeek');
    result = await deepSeekHandler(prompt);
    if (result) return { text: result };
  } catch (err) {
    console.warn(`❌ DeepSeek failed: ${err.message}`);
  }

  throw new Error('All AI services failed.');
}
module.exports = { generateWithFallback }; 