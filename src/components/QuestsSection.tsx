import {
  useState,
} from "react";

import type {
  RoomAnalysis,
} from "../types/RoomAnalysis";

interface QuestsSectionProps {
  analysis: RoomAnalysis | null;
  imageUrl: string;
  onScanRoom: () => void;

  onQuestComplete: (
    questId: string,
    xpReward: number
  ) => Promise<void>;
}

export default function QuestsSection({
  analysis,
  imageUrl,
  onScanRoom,
  onQuestComplete,
}: QuestsSectionProps) {
  const [
    completingQuestId,
    setCompletingQuestId,
  ] = useState("");

  const [
    completionError,
    setCompletionError,
  ] = useState("");

  async function completeQuest(
    questId: string,
    xpReward: number
  ) {
    try {
      setCompletionError("");
      setCompletingQuestId(
        questId
      );

      await onQuestComplete(
        questId,
        xpReward
      );
    } catch (error) {
      console.error(
        "Quest completion failed:",
        error
      );

      setCompletionError(
        error instanceof Error
          ? error.message
          : "Could not complete the quest."
      );
    } finally {
      setCompletingQuestId("");
    }
  }

  if (!analysis) {
    return (
      <section className="pageSection">
        <div className="emptyQuestState">
          <div>📷</div>

          <h2>No quests yet</h2>

          <p>
            Scan your room to generate
            personalized quests.
          </p>

          <button
            type="button"
            onClick={onScanRoom}
          >
            Scan Room
          </button>
        </div>
      </section>
    );
  }

  const completedCount =
    analysis.quests.filter(
      (quest) => quest.completed
    ).length;

  const allCompleted =
    analysis.quests.length > 0 &&
    completedCount ===
      analysis.quests.length;

  return (
    <section className="pageSection">
      <div className="sectionHeading">
        <div>
          <p className="sectionEyebrow">
            ROOM ANALYSIS
          </p>

          <h2>Your Quests</h2>
        </div>

        <span className="sectionCounter">
          {completedCount}/
          {analysis.quests.length}
        </span>
      </div>

    {imageUrl && (
    <section className="annotatedRoomCard">
        <div className="annotatedImageWrapper">
        <img
            src={imageUrl}
            alt="Analyzed room"
        />

        {analysis.detectedAreas.map(
            (area, index) => {
            const [
                yMin,
                xMin,
                yMax,
                xMax,
            ] = area.box_2d;

            const quest =
                analysis.quests.find(
                (item) =>
                    item.id === area.questId
                );

            return (
                <div
                key={area.id}
                className="questBoundingBox"
                style={{
                    top: `${yMin / 10}%`,
                    left: `${xMin / 10}%`,
                    width: `${
                    (xMax - xMin) / 10
                    }%`,
                    height: `${
                    (yMax - yMin) / 10
                    }%`,
                }}
                >
                <span className="boundingBoxLabel">
                    {index + 1}.{" "}
                    {quest?.title ||
                    area.label}
                </span>
                </div>
            );
            }
        )}
        </div>

        <div className="roomAnalysisSummary">
        <div>
            <span>ROOM SCORE</span>

            <strong>
            {analysis.cleanlinessScore}
            /10
            </strong>
        </div>

        <p>{analysis.roomSummary}</p>
        </div>
    </section>
    )}

      {allCompleted ? (
        <section className="allQuestsCompleted">
          <div>🏆</div>

          <h2>
            Room Adventure Complete!
          </h2>

          <p>
            You completed every quest and
            earned your XP.
          </p>

          <button
            type="button"
            onClick={onScanRoom}
          >
            Scan Again
          </button>
        </section>
      ) : (
        <p className="analysisEncouragement">
          ✨ {analysis.encouragement}
        </p>
      )}

      {completionError && (
        <p className="questCompletionError">
          {completionError}
        </p>
      )}

      <div className="questGrid">
        {analysis.quests.map(
          (quest, index) => (
            <article
              key={quest.id}
              className={
                quest.completed
                  ? "questPreviewCard questCompletedCard"
                  : "questPreviewCard"
              }
            >
              <div className="questNumberBadge">
                {quest.completed
                  ? "✓"
                  : index + 1}
              </div>

              <div className="questPreviewContent">
                <div className="questPreviewTop">
                  <div>
                    <span>
                      {quest.difficulty}
                    </span>

                    <h3>
                      {quest.title}
                    </h3>
                  </div>

                  <strong>
                    +{quest.xpReward} XP
                  </strong>
                </div>

                <p>
                  {quest.description}
                </p>

                <div className="questPreviewFooter">
                  <span>
                    ⏱{" "}
                    {
                      quest
                        .estimatedMinutes
                    }{" "}
                    min
                  </span>

                  <span>
                    {quest.category}
                  </span>
                </div>

                <small className="questEvidence">
                  Detected:{" "}
                  {quest.evidence}
                </small>

                <button
                  type="button"
                  className="questCompleteButton"
                  disabled={
                    quest.completed ||
                    completingQuestId ===
                      quest.id
                  }
                  onClick={() =>
                    completeQuest(
                      quest.id,
                      quest.xpReward
                    )
                  }
                >
                  {quest.completed
                    ? "Quest Completed ✓"
                    : completingQuestId ===
                        quest.id
                      ? "Saving..."
                      : `Complete Quest · +${quest.xpReward} XP`}
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}