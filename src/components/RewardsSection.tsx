const rewards = [
  {
    level: 2,
    icon: "🛡️",
    title: "Bronze Shield",
    description: "Complete your first room quest.",
    unlocked: true,
  },
  {
    level: 3,
    icon: "🧙",
    title: "Apprentice Robe",
    description: "Complete five total quests.",
    unlocked: false,
  },
  {
    level: 5,
    icon: "🐉",
    title: "Dragon Companion",
    description: "Maintain a seven-day streak.",
    unlocked: false,
  },
];

export default function RewardsSection() {
  return (
    <section className="pageSection">
      <div className="sectionHeading">
        <div>
          <p className="sectionEyebrow">YOUR TREASURY</p>
          <h2>Rewards</h2>
        </div>

        <span className="sectionCounter">1 unlocked</span>
      </div>

      <section className="featuredReward">
        <div className="featuredRewardIcon">🏆</div>

        <div>
          <span>NEXT REWARD</span>
          <h3>Apprentice Robe</h3>
          <p>Complete three more quests to unlock this reward.</p>

          <div className="rewardProgressTrack">
            <div className="rewardProgressFill" />
          </div>
        </div>
      </section>

      <div className="rewardGrid">
        {rewards.map((reward) => (
          <article
            className={
              reward.unlocked
                ? "rewardCard unlockedReward"
                : "rewardCard lockedReward"
            }
            key={reward.title}
          >
            <div className="rewardIcon">
              {reward.unlocked ? reward.icon : "🔒"}
            </div>

            <span>LEVEL {reward.level}</span>
            <h3>{reward.title}</h3>
            <p>{reward.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}