import './App.css'

function App() {
  return (
    <div className="app">
      <main className="content">
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

          <button className="scanButton">
            📷 Scan Your Room
          </button>
        </section>

        <section className="card messageCard">
          <div className="smallIcon">✨</div>
          <p>
            <strong>Your room awaits its next hero.</strong>
            Every clean tile is progress.
          </p>
        </section>

        <h2 className="journeyTitle">Continue Journey</h2>
      </main>

      <nav className="bottomNav">
        <button>🏠<span>Home</span></button>
        <button>📷<span>Scan</span></button>
        <button>🎯<span>Quests</span></button>
        <button>🏆<span>Rewards</span></button>
        <button>👤<span>Profile</span></button>
      </nav>
    </div>
  )
}

export default App