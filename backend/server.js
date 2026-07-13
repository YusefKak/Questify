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
app.use(express.json({ limit: '10mb'}));
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
app.post('/api/generate-quests', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.featherless.ai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.FEATHERLESS_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: process.env.FEATHERLESS_MODEL,
          messages: [
            {
              role: 'user',
              content:
                req.body.prompt ||
                'Create 3 cleaning quests for a messy bedroom.'
            }
          ]
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error(data)

      return res.status(response.status).json({
        error: 'Featherless request failed',
        details: data
      })
    }

    const result =
      data.choices?.[0]?.message?.content ||
      'No response returned'

    res.json({ result })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Could not connect to Featherless'
    })
  }
})
app.listen(5000, () => {
  console.log("Server running on port 5000");
});