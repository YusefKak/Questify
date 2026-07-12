import { useState }from 'react'
import './App.css'


function App() {
  const [page, setPage] = useState('login')
  if (page === 'login') {
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
  return (
    <div className="simplePage">
      <h1>Scan Your Room</h1>
      <p>Upload or take a picture of your room.</p>

      <button onClick={() => setPage('home')}>
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
          </p>
        </section>

        <h2 className="journeyTitle">Continue Journey</h2>
      </main>

      <nav className="bottomNav">
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
      </nav>
    </div>
  )
}

export default App