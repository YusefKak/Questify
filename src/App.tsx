import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type { RoomAnalysis } from "./types/RoomAnalysis";

import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";

import CameraSection from "./components/CameraSection";
import ProfileSection from "./components/ProfileSection";
import QuestsSection from "./components/QuestsSection";
import RewardsSection from "./components/RewardsSection";

import { auth, db } from "./firebase";
import SignUp from "./pages/SignUp";

import "./App.css";

interface UserStats {
  username: string;
  xp: number;
  level: number;
  streak: number;
  questsCompleted: number;
  title: string;
  scannedToday: boolean;
}

type ActiveSection =
  | "home"
  | "scan"
  | "quests"
  | "rewards"
  | "profile";

const defaultStats: UserStats = {
  username: "Hero",
  xp: 0,
  level: 1,
  streak: 0,
  questsCompleted: 0,
  title: "Adventurer",
  scannedToday: false,
};
const fakeRoomAnalysis: RoomAnalysis = {
  roomSummary:
    "Your room has a few quick tasks that can be completed to make it cleaner and more organized.",

  cleanlinessScore: 7,

  encouragement:
    "Complete these quests to earn XP and level up!",

  detectedAreas: [],

  quests: [
    {
      id: "quest-1",
      title: "Clean Your Desk",
      description:
        "Throw away trash, organize papers, and clear the desk surface.",
      evidence: "The desk appears cluttered.",
      category: "cleaning",
      difficulty: "easy",
      estimatedMinutes: 10,
      xpReward: 30,
      targetAreaIds: [],
      completed: false,
    },
    {
      id: "quest-2",
      title: "Organize Your Backpack",
      description:
        "Remove unnecessary items and organize everything inside.",
      evidence: "The backpack needs organization.",
      category: "organization",
      difficulty: "easy",
      estimatedMinutes: 8,
      xpReward: 25,
      targetAreaIds: [],
      completed: false,
    },
    {
      id: "quest-3",
      title: "Make Your Bed",
      description:
        "Straighten the blankets, fix the sheets, and arrange the pillows.",
      evidence: "The bed appears unmade.",
      category: "cleaning",
      difficulty: "easy",
      estimatedMinutes: 5,
      xpReward: 20,
      targetAreaIds: [],
      completed: false,
    },
    {
      id: "quest-4",
      title: "Put Away Your Tennis Racket",
      description:
        "Return your tennis racket to its proper storage location.",
      evidence: "The tennis racket was left out.",
      category: "organization",
      difficulty: "easy",
      estimatedMinutes: 2,
      xpReward: 15,
      targetAreaIds: [],
      completed: false,
    },
    {
      id: "quest-5",
      title: "Hang Up Your Belts",
      description:
        "Collect your belts and hang or store them neatly.",
      evidence: "The belts need to be put away.",
      category: "organization",
      difficulty: "easy",
      estimatedMinutes: 3,
      xpReward: 15,
      targetAreaIds: [],
      completed: false,
    },
  ],
};
function App() {
  const [user, setUser] =
    useState<User | null>(null);

  const [stats, setStats] =
    useState<UserStats>(defaultStats);

  const [activeSection, setActiveSection] =
    useState<ActiveSection>("home");

  const [roomAnalysis, setRoomAnalysis] =
  useState<RoomAnalysis | null>(
    fakeRoomAnalysis
  );

  const [roomImageUrl, setRoomImageUrl] =
    useState("");

  const [authLoading, setAuthLoading] =
    useState(true);

  const [statsLoading, setStatsLoading] =
    useState(true);

  const [statsError, setStatsError] =
    useState("");

  useEffect(() => {
    const unsubscribeFromAuth =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setUser(firebaseUser);
          setAuthLoading(false);

          if (!firebaseUser) {
            setStats(defaultStats);
            setStatsLoading(false);
          }
        }
      );

    return unsubscribeFromAuth;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    setStatsLoading(true);
    setStatsError("");

    const userDocumentReference = doc(
      db,
      "users",
      user.uid
    );

    const unsubscribeFromStats = onSnapshot(
      userDocumentReference,

      (snapshot) => {
        if (!snapshot.exists()) {
          setStats(defaultStats);

          setStatsError(
            "Your account data could not be found."
          );

          setStatsLoading(false);
          return;
        }

        const data = snapshot.data();

        setStats({
          username:
            typeof data.username === "string"
              ? data.username
              : "Hero",

          xp:
            typeof data.xp === "number"
              ? data.xp
              : 0,

          level:
            typeof data.level === "number"
              ? data.level
              : 1,

          streak:
            typeof data.streak === "number"
              ? data.streak
              : 0,

          questsCompleted:
            typeof data.questsCompleted === "number"
              ? data.questsCompleted
              : 0,

          title:
            typeof data.title === "string"
              ? data.title
              : "Adventurer",

          scannedToday:
            typeof data.scannedToday === "boolean"
              ? data.scannedToday
              : false,
        });

        setStatsLoading(false);
      },

      (error) => {
        console.error(
          "Could not load Firestore stats:",
          error
        );

        setStatsError(
          "Could not load your account stats."
        );

        setStatsLoading(false);
      }
    );

    return unsubscribeFromStats;
  }, [user]);

  function showHome() {
    setActiveSection("home");
  }

  function showScan() {
    setActiveSection("scan");
  }

  function showQuests() {
    setActiveSection("quests");
  }

  function showRewards() {
    setActiveSection("rewards");
  }

  function showProfile() {
    setActiveSection("profile");
  }

function handleAnalysisComplete(
  analysis: RoomAnalysis,
  imageUrl: string
) {
  console.log(
    "Analysis received in App:",
    analysis
  );

  setRoomAnalysis(analysis);
  setRoomImageUrl(imageUrl);
  setActiveSection("quests");
}

  async function handleQuestComplete(
    questId: string,
    xpReward: number
  ) {
    if (!user) {
      throw new Error(
        "You must be signed in."
      );
    }

    const quest =
      roomAnalysis?.quests.find(
        (item) => item.id === questId
      );

    if (!quest) {
      throw new Error(
        "That quest could not be found."
      );
    }

    if (quest.completed) {
      return;
    }

    const userReference = doc(
      db,
      "users",
      user.uid
    );

    await runTransaction(
      db,
      async (transaction) => {
        const snapshot =
          await transaction.get(
            userReference
          );

        if (!snapshot.exists()) {
          throw new Error(
            "User stats were not found."
          );
        }

        const data = snapshot.data();

        const currentXp =
          typeof data.xp === "number"
            ? data.xp
            : 0;

        const currentCompleted =
          typeof data.questsCompleted ===
          "number"
            ? data.questsCompleted
            : 0;

        const nextXp =
          currentXp + xpReward;

        const nextLevel =
          Math.floor(nextXp / 1000) + 1;

        transaction.update(
          userReference,
          {
            xp: nextXp,
            level: nextLevel,

            questsCompleted:
              currentCompleted + 1,

            scannedToday: true,
          }
        );
      }
    );

    setRoomAnalysis(
      (currentAnalysis) => {
        if (!currentAnalysis) {
          return currentAnalysis;
        }

        return {
          ...currentAnalysis,

          quests:
            currentAnalysis.quests.map(
              (currentQuest) =>
                currentQuest.id === questId
                  ? {
                      ...currentQuest,
                      completed: true,
                    }
                  : currentQuest
            ),
        };
      }
    );
  }

  if (authLoading) {
    return (
      <div className="loadingScreen">
        <h2>Loading Questify...</h2>
      </div>
    );
  }

  if (!user) {
    return <SignUp />;
  }

  if (statsLoading) {
    return (
      <div className="loadingScreen">
        <h2>Loading your hero...</h2>
      </div>
    );
  }

  const xpRequiredForNextLevel =
    stats.level * 1000;

  const xpAtStartOfLevel = Math.max(
    (stats.level - 1) * 1000,
    0
  );

  const xpEarnedThisLevel = Math.max(
    stats.xp - xpAtStartOfLevel,
    0
  );

  const xpNeededThisLevel = Math.max(
    xpRequiredForNextLevel -
      xpAtStartOfLevel,
    1
  );

  const xpRemaining = Math.max(
    xpRequiredForNextLevel - stats.xp,
    0
  );

  const xpProgress = Math.min(
    Math.max(
      (xpEarnedThisLevel /
        xpNeededThisLevel) *
        100,
      0
    ),
    100
  );

  const hasRoomAnalysis =
  roomAnalysis !== null;

  return (
    <div className="app">
      <main className="content">
        {statsError && (
          <p className="dashboardError">
            {statsError}
          </p>
        )}

        {activeSection === "home" && (
          <>
            <header className="header">
              <div>
                <p className="welcome">
                  WELCOME BACK
                </p>

                <h1>
                  {stats.username}{" "}
                  <span>
                    the {stats.title}
                  </span>
                </h1>
              </div>

              <div className="avatar">
                🧙
              </div>
            </header>

            <section className="stats">
              <div className="statCard">
                <div className="icon">
                  🔥
                </div>

                <div>
                  <h2>{stats.streak}</h2>
                  <p>Day Streak</p>
                </div>
              </div>

              <div className="statCard">
                <div className="icon">
                  ⭐
                </div>

                <div>
                  <h2>
                    Level {stats.level}
                  </h2>

                  <p>
                    {stats.questsCompleted}{" "}
                    {stats.questsCompleted === 1
                      ? "Quest Completed"
                      : "Quests Completed"}
                  </p>
                </div>
              </div>
            </section>

            <section className="card xpCard">
              <div className="xpTop">
                <strong>
                  Level {stats.level}
                </strong>

                <span>
                  {stats.xp.toLocaleString()}
                  {" / "}
                  {xpRequiredForNextLevel.toLocaleString()}
                  {" XP"}
                </span>
              </div>

              <div className="progressTrack">
                <div
                  className="progressFill"
                  style={{
                    width: `${xpProgress}%`,
                  }}
                />
              </div>

              <p>
                {xpRemaining.toLocaleString()} XP
                to Level {stats.level + 1}
              </p>
            </section>

            <section className="statusHeader">
              <h2>Today's Status</h2>

              <span>
                {hasRoomAnalysis
                  ? "SCANNED"
                  : "NOT SCANNED"}
              </span>
            </section>

            <section className="card scanCard">
              <div className="cameraIcon">
                {hasRoomAnalysis
                  ? "✅"
                  : "📷"}
              </div>

              <p>
                {hasRoomAnalysis
                  ? `${roomAnalysis.quests.length} quests discovered`
                  : "No scan completed yet"}
              </p>

              <h2>
                {hasRoomAnalysis
                  ? "Your quests are ready."
                  : "Ready for today's adventure?"}
              </h2>

              <button
                type="button"
                className="scanButton"
                onClick={
                  hasRoomAnalysis
                    ? showQuests
                    : showScan
                }
              >
                {hasRoomAnalysis
                  ? "🎯 View Your Quests"
                  : "📷 Scan Your Room"}
              </button>
            </section>

            {hasRoomAnalysis && (
              <section className="card roomSummaryCard">
                <div className="roomScore">
                  <span>ROOM SCORE</span>

                  <strong>
                    {
                      roomAnalysis
                        .cleanlinessScore
                    }
                    /10
                  </strong>
                </div>

                <div>
                  <h3>
                    Latest Room Analysis
                  </h3>

                  <p>
                    {roomAnalysis.roomSummary}
                  </p>
                </div>
              </section>
            )}

            <section className="card messageCard">
              <div className="smallIcon">
                ✨
              </div>

              <p>
                <strong>
                  {stats.questsCompleted > 0
                    ? `${stats.questsCompleted} quests conquered.`
                    : "Your room awaits its next hero."}
                </strong>

                Every completed quest brings you
                closer to your next level.
              </p>
            </section>

            <h2 className="journeyTitle">
              Continue Journey
            </h2>

            <section className="journeyGrid">
              <button
                type="button"
                className="journeyCard"
                onClick={showScan}
              >
                <span>📷</span>

                <div>
                  <strong>Scan Room</strong>
                  <small>
                    Discover new quests
                  </small>
                </div>
              </button>

              <button
                type="button"
                className="journeyCard"
                onClick={showQuests}
              >
                <span>🎯</span>

                <div>
                  <strong>View Quests</strong>
                  <small>
                    Continue your adventure
                  </small>
                </div>
              </button>

              <button
                type="button"
                className="journeyCard"
                onClick={showRewards}
              >
                <span>🏆</span>

                <div>
                  <strong>Rewards</strong>
                  <small>
                    See what you can unlock
                  </small>
                </div>
              </button>

              <button
                type="button"
                className="journeyCard"
                onClick={showProfile}
              >
                <span>👤</span>

                <div>
                  <strong>Profile</strong>
                  <small>
                    View your hero stats
                  </small>
                </div>
              </button>
            </section>
          </>
        )}

        {activeSection === "scan" && (
          <CameraSection
            onAnalysisComplete={
              handleAnalysisComplete
            }
          />
        )}

        {activeSection === "quests" && (
          <QuestsSection
            analysis={roomAnalysis}
            imageUrl={roomImageUrl}
            onScanRoom={showScan}
            onQuestComplete={
              handleQuestComplete
            }
          />
        )}

        {activeSection === "rewards" && (
          <RewardsSection />
        )}

        {activeSection === "profile" && (
          <ProfileSection
            username={stats.username}
            level={stats.level}
            xp={stats.xp}
            streak={stats.streak}
            questsCompleted={
              stats.questsCompleted
            }
          />
        )}
      </main>

      <nav className="bottomNav">
        <button
          type="button"
          className={
            activeSection === "home"
              ? "activeNavButton"
              : ""
          }
          onClick={showHome}
        >
          🏠
          <span>Home</span>
        </button>

        <button
          type="button"
          className={
            activeSection === "scan"
              ? "activeNavButton"
              : ""
          }
          onClick={showScan}
        >
          📷
          <span>Scan</span>
        </button>

        <button
          type="button"
          className={
            activeSection === "quests"
              ? "activeNavButton"
              : ""
          }
          onClick={showQuests}
        >
          🎯
          <span>Quests</span>
        </button>

        <button
          type="button"
          className={
            activeSection === "rewards"
              ? "activeNavButton"
              : ""
          }
          onClick={showRewards}
        >
          🏆
          <span>Rewards</span>
        </button>

        <button
          type="button"
          className={
            activeSection === "profile"
              ? "activeNavButton"
              : ""
          }
          onClick={showProfile}
        >
          👤
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default App;