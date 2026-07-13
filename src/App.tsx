<<<<<<< HEAD
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";

import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

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
=======
import { useState }from 'react'
import './App.css'
>>>>>>> 00b1931d6011a35a62b9136c52fe94560e9810cc


function App() {
<<<<<<< HEAD
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats>(defaultStats);

  const [activeSection, setActiveSection] =
    useState<ActiveSection>("home");

  const [authLoading, setAuthLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const unsubscribeFromAuth = onAuthStateChanged(
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
    xpRequiredForNextLevel - xpAtStartOfLevel,
    1
  );

  const xpRemaining = Math.max(
    xpRequiredForNextLevel - stats.xp,
    0
  );

  const xpProgress = Math.min(
    Math.max(
      (xpEarnedThisLevel / xpNeededThisLevel) * 100,
      0
    ),
    100
  );

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

=======
  const [page, setPage] = useState('login')
  const [selectedImage, setSelectedImage] = useState('')
  const [analysisResult, setAnalysisResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  if (page === 'login') {
>>>>>>> 00b1931d6011a35a62b9136c52fe94560e9810cc
  return (
    <div className="loginPage">
      <h1>Questify</h1>
      <p>Turn chores into adventures.</p>

      <input placeholder="Username" />

      <input
        type="password"
        placeholder="Password"
      />

      <button onClick={() => setPage('home')}>
        Start Adventure
      </button>
    </div>
  )
}
  if (page === 'scan') {
  async function analyzeRoom() {
    if (!selectedImage) {
      alert('Please choose an image first')
      return
    }

    setIsLoading(true)
    setAnalysisResult('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/analyze-room',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: selectedImage
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysisResult(data.result)
    } catch (error) {
      console.error(error)
      setAnalysisResult('Could not analyze the room.')
    }

    setIsLoading(false)
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setSelectedImage(reader.result as string)
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="simplePage">
      <h1>Scan Your Room</h1>
      <p>Upload a picture of your room.</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {selectedImage && (
        <img
          src={selectedImage}
          alt="Room preview"
          className="roomPreview"
        />
      )}

      <button
        type="button"
        onClick={analyzeRoom}
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Room'}
      </button>

      {analysisResult && (
        <div className="analysisResult">
          <h2>Your Quests</h2>
          <p>{analysisResult}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setPage('home')}
      >
        Back Home
      </button>
    </div>
  )
}
  


if (page === 'quests') {
  return (
    <div className="simplePage">
      <h1>Your Quests</h1>
      <p>Your cleaning quests will appear here.</p>

      <button onClick={() => setPage('home')}>
        Back Home
      </button>
    </div>
  )
}

if (page === 'rewards') {
  return (
    <div className="simplePage">
      <h1>Rewards</h1>
      <p>Your unlocked rewards will appear here.</p>

      <button onClick={() => setPage('home')}>
        Back Home
      </button>
    </div>
  )
}

if (page === 'profile') {
  return (
    <div className="simplePage">
      <h1>Profile</h1>
      <p>Your level and account information will appear here.</p>

      <button onClick={() => setPage('home')}>
        Back Home
      </button>
    </div>
  )
}
  return (
    
    <div className="app">
      <main className="content">
<<<<<<< HEAD
        {statsError && (
          <p className="dashboardError">
            {statsError}
=======
        <header className="header">
          <div>
            <p className="welcome">WELCOME BACK</p>
            <h1>
              Rohan <span>Geek</span>
            </h1>
          </div>

          <div className="avatar">🧙</div>
        </header>

        <section className="stats">
          <div className="statCard">
            <div className="icon">🔥</div>
            <div>
              <h2>5</h2>
              <p>Day Streak</p>
            </div>
          </div>

          <div className="statCard">
            <div className="icon">⭐</div>
            <div>
              <h2>Level 7</h2>
              <p>Adventurer</p>
            </div>
          </div>
        </section>

        <section className="card xpCard">
          <div className="xpTop">
            <strong>Level 7</strong>
            <span>2,340 / 3,000 XP</span>
          </div>

          <div className="progressTrack">
            <div className="progressFill"></div>
          </div>

          <p>660 XP to Level 8</p>
        </section>

        <section className="statusHeader">
          <h2>Today’s Status</h2>
          <span>NOT SCANNED</span>
        </section>

        <section className="card scanCard">
          <div className="cameraIcon">📷</div>
          <p>No scan completed yet</p>
          <h2>Ready for today’s adventure?</h2>

          <button className="scanButton"
          onClick={() => setPage('scan')}>
            📷 Scan Your Room
          </button>
        </section>

        <section className="card messageCard">
          <div className="smallIcon">✨</div>
          <p>
            <strong>Your room awaits its next hero.</strong>
            Every clean tile is progress.
>>>>>>> 00b1931d6011a35a62b9136c52fe94560e9810cc
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
                {stats.scannedToday
                  ? "SCANNED"
                  : "NOT SCANNED"}
              </span>
            </section>

            <section className="card scanCard">
              <div className="cameraIcon">
                {stats.scannedToday
                  ? "✅"
                  : "📷"}
              </div>

              <p>
                {stats.scannedToday
                  ? "Today's scan is complete"
                  : "No scan completed yet"}
              </p>

              <h2>
                {stats.scannedToday
                  ? "Your quests are ready."
                  : "Ready for today's adventure?"}
              </h2>

              <button
                type="button"
                className="scanButton"
                onClick={
                  stats.scannedToday
                    ? showQuests
                    : showScan
                }
              >
                {stats.scannedToday
                  ? "🎯 View Your Quests"
                  : "📷 Scan Your Room"}
              </button>
            </section>

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
            onQuestsGenerated={showQuests}
          />
        )}

        {activeSection === "quests" && (
          <QuestsSection />
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
<<<<<<< HEAD
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
=======
    <button onClick={() => setPage('home')}>
    🏠
    <span>Home</span>
    </button>

    <button onClick={() => setPage('scan')}>
    📷
    <span>Scan</span>
    </button>

    <button onClick={() => setPage('quests')}>
    🎯
    <span>Quests</span>
    </button>

   <button onClick={() => setPage('rewards')}>
    🏆
    <span>Rewards</span>
    </button>

    <button onClick={() => setPage('profile')}>
    👤
    <span>Profile</span>
    </button>
>>>>>>> 00b1931d6011a35a62b9136c52fe94560e9810cc
      </nav>
    </div>
  );
}

export default App;