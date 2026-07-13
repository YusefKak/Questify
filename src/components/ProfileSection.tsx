interface ProfileSectionProps {
  username: string;
  level: number;
  xp: number;
  streak: number;
  questsCompleted: number;
}

export default function ProfileSection({
  username,
  level,
  xp,
  streak,
  questsCompleted,
}: ProfileSectionProps) {
  return (
    <section className="pageSection">
      <div className="profileHero">
        <div className="profileAvatar">🧙</div>

        <div>
          <p className="sectionEyebrow">HERO PROFILE</p>
          <h2>{username}</h2>
          <span>Level {level} Adventurer</span>
        </div>
      </div>

      <div className="profileStats">
        <article>
          <strong>{xp.toLocaleString()}</strong>
          <span>Total XP</span>
        </article>

        <article>
          <strong>{questsCompleted}</strong>
          <span>Quests</span>
        </article>

        <article>
          <strong>{streak}</strong>
          <span>Day Streak</span>
        </article>
      </div>

      <section className="profileSettingsCard">
        <button type="button">
          <span>🎯</span>

          <div>
            <strong>Quest Preferences</strong>
            <small>Difficulty and daily goals</small>
          </div>

          <b>›</b>
        </button>

        <button type="button">
          <span>🔔</span>

          <div>
            <strong>Notifications</strong>
            <small>Daily quest reminders</small>
          </div>

          <b>›</b>
        </button>

        <button type="button">
          <span>🎨</span>

          <div>
            <strong>Appearance</strong>
            <small>Customize your hero experience</small>
          </div>

          <b>›</b>
        </button>
      </section>
    </section>
  );
}