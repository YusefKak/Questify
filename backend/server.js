require('dotenv').config()


console.log(
  process.env.FEATHERLESS_API_KEY
    ? 'Featherless key loaded'
    : 'Featherless key missing'
)
const apiKey = process.env.FEATHERLESS_API_KEY
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/test', (req, res) => {
  res.json({ message: 'Questify backend is working' })
})

app.get("/", (req, res) => {
  res.json({
    message: "Questify backend running 🚀"
  });
});

app.get("/quests", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Defeat the Trash Goblins",
      xp: 25
    },
    {
      id: 2,
      title: "Recover Lost Sock",
      xp: 10
    }
  ]);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});