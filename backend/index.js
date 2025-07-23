const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const questionans = require("./routes/questionans");
app.use(cors());
app.use(express.json());
app.use("/api",questionans);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
