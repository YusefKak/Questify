interface QuestPreview {
  id: number;
  icon: string;
  title: string;
  description: string;
  difficulty: string;
  minutes: number;
  xp: number;
}

const sampleQuests: QuestPreview[] = [
  {
    id: 1,
    icon: "🛏️",
    title: "Restore the Sleeping Chamber",
    description: "Make your bed and arrange the pillows.",
    difficulty: "Easy",
    minutes: 4,
    xp: 15,
  },
  {
    id: 2,
    icon: "📚",
    title: "Organize the Knowledge Tower",
    description: "Stack or shelve the books around your room.",
    difficulty: "Medium",
    minutes: 8,
    xp: 30,
  },
  {
    id: 3,
    icon: "👕",
    title: "Defeat the Laundry Pile",
    description: "Collect loose clothing and place it in the hamper.",
    difficulty: "Medium",
    minutes: 6,
    xp: 25,
  },
];

export default function QuestsSection() {
  return (
    <section className="pageSection">
      <div className="sectionHeading">
        <div>
          <p className="sectionEyebrow">TODAY'S ADVENTURE</p>
          <h2>Your Quests</h2>
        </div>

        <span className="sectionCounter">
          0 / {sampleQuests.length}
        </span>
      </div>

      <div className="questGrid">
        {sampleQuests.map((quest) => (
          <button
            type="button"
            className="questPreviewCard"
            key={quest.id}
          >
            <div className="questPreviewIcon">
              {quest.icon}
            </div>

            <div className="questPreviewContent">
              <div className="questPreviewTop">
                <div>
                  <span>{quest.difficulty}</span>
                  <h3>{quest.title}</h3>
                </div>

                <strong>+{quest.xp} XP</strong>
              </div>

              <p>{quest.description}</p>

              <div className="questPreviewFooter">
                <span>⏱ {quest.minutes} min</span>
                <span>Tap to begin</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="prototypeNotice">
        These are temporary preview quests. The room model will replace
        them after scanning is connected.
      </p>
    </section>
  );
}