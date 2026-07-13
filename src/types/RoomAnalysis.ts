export interface DetectedArea {
  id: string;
  label: string;

  box_2d: [
    number,
    number,
    number,
    number
  ];

  questId: string;
}

export interface GeneratedQuest {
  id: string;
  title: string;
  description: string;
  evidence: string;
  category: string;

  difficulty:
    | "easy"
    | "medium"
    | "hard";

  estimatedMinutes: number;
  xpReward: number;
  targetAreaIds: string[];
  completed: boolean;
}

export interface RoomAnalysis {
  roomSummary: string;
  cleanlinessScore: number;
  encouragement: string;
  detectedAreas: DetectedArea[];
  quests: GeneratedQuest[];
}