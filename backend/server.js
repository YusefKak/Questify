import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const currentFilePath = fileURLToPath(
  import.meta.url
);

const currentDirectory = path.dirname(
  currentFilePath
);

dotenv.config({
  path: path.join(
    currentDirectory,
    ".env"
  ),
});

const app = express();
const PORT = 3001;

const model =
  process.env.FEATHERLESS_MODEL ||
  "google/gemma-4-31B-it";

const apiKey =
  process.env.FEATHERLESS_API_KEY;

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

app.get(
  "/api/health",
  (_request, response) => {
    response.json({
      running: true,
      model,
      hasApiKey: Boolean(apiKey),
      usingFakeQuests: true,
    });
  }
);

app.post(
  "/api/analyze-room",
  upload.single("roomImage"),

  async (request, response) => {
    try {
      console.log(
        "Fake room analysis request received."
      );

      if (!request.file) {
        return response
          .status(400)
          .json({
            error:
              "No room image was received.",
          });
      }

      console.log(
        "Image received:",
        request.file.originalname,
        request.file.size,
        request.file.mimetype
      );

      return response.json({
        roomSummary:
          "Your room is fairly organized, but there are several quick wins that can make it cleaner.",

        cleanlinessScore: 7,

        encouragement:
          "Complete a few quests to level up!",

        detectedAreas: [
          {
            id: "area-1",
            label: "Desk",
            box_2d: [
              170,
              120,
              520,
              430,
            ],
            questId: "quest-1",
          },

          {
            id: "area-2",
            label: "Backpack",
            box_2d: [
              540,
              620,
              900,
              900,
            ],
            questId: "quest-2",
          },

          {
            id: "area-3",
            label: "Bed",
            box_2d: [
              180,
              520,
              640,
              980,
            ],
            questId: "quest-3",
          },

          {
            id: "area-4",
            label: "Tennis Racket",
            box_2d: [
              70,
              760,
              500,
              940,
            ],
            questId: "quest-4",
          },

          {
            id: "area-5",
            label: "Belts",
            box_2d: [
              420,
              60,
              760,
              180,
            ],
            questId: "quest-5",
          },
        ],

        quests: [
          {
            id: "quest-1",
            title: "Clean Your Desk",

            description:
              "Throw away trash, organize papers, and clear the desk surface.",

            evidence:
              "The desk appears cluttered.",

            category: "cleaning",
            difficulty: "easy",
            estimatedMinutes: 10,
            xpReward: 30,
            targetAreaIds: [
              "area-1",
            ],
            completed: false,
          },

          {
            id: "quest-2",
            title:
              "Organize Your Backpack",

            description:
              "Remove unnecessary items and neatly organize everything inside.",

            evidence:
              "The backpack is sitting out.",

            category: "organization",
            difficulty: "easy",
            estimatedMinutes: 8,
            xpReward: 25,
            targetAreaIds: [
              "area-2",
            ],
            completed: false,
          },

          {
            id: "quest-3",
            title: "Make Your Bed",

            description:
              "Straighten the blankets, fix the sheets, and arrange the pillows.",

            evidence:
              "The bed appears unmade.",

            category: "cleaning",
            difficulty: "easy",
            estimatedMinutes: 5,
            xpReward: 20,
            targetAreaIds: [
              "area-3",
            ],
            completed: false,
          },

          {
            id: "quest-4",
            title:
              "Put Away Your Tennis Racket",

            description:
              "Return your tennis racket to its proper storage location.",

            evidence:
              "Sports equipment was left out.",

            category: "organization",
            difficulty: "easy",
            estimatedMinutes: 2,
            xpReward: 15,
            targetAreaIds: [
              "area-4",
            ],
            completed: false,
          },

          {
            id: "quest-5",
            title: "Hang Up Your Belts",

            description:
              "Collect the belts and hang or store them neatly.",

            evidence:
              "Belts appear to be left out.",

            category: "organization",
            difficulty: "easy",
            estimatedMinutes: 3,
            xpReward: 15,
            targetAreaIds: [
              "area-5",
            ],
            completed: false,
          },
        ],
      });
    } catch (error) {
      console.error(
        "Fake room analysis failed:",
        error
      );

      return response
        .status(500)
        .json({
          error:
            error instanceof Error
              ? error.message
              : "Room analysis failed.",
        });
    }
  }
);

app.listen(PORT, () => {
  console.log(
    `Questify backend running at http://localhost:${PORT}`
  );
});