import { useState } from "react";
import { Link } from "react-router";

import ChevronLeftIcon from "../../assets/icons/chevrons/chevron-left.svg?react";
import useWorkoutSessionDetail from "../../hooks/workout-session/useWorkoutSessionDetail";
import { formatDuration } from "../../utils/formatDuration";
import { formatSessionDateWithWeekday } from "../../utils/formatSessionDate";
import ExerciseDetailSheet from "../ExerciseDetailSheet";
import LocalErrorState from "../feedback/LocalErrorState";
import Skeleton from "../feedback/Skeleton";
import CompletedExerciseBlock from "./CompletedExerciseBlock";

type CompletedSessionViewProps = {
  sessionId: number;
};

function CompletedSessionView({ sessionId }: CompletedSessionViewProps) {
  const { session, loading, error, notFound, reload } =
    useWorkoutSessionDetail(sessionId);

  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    null,
  );

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return <LocalErrorState message={error} onRetry={reload} />;
  }

  if (notFound || !session) {
    return <p className="text-base-content/75">Séance introuvable.</p>;
  }

  let setCount = 0;
  let totalVolumeKg = 0;

  for (const exercise of session.exercises) {
    for (const set of exercise.sets) {
      setCount += 1;
      totalVolumeKg += Number(set.repetitions) * Number(set.weightKg);
    }
  }

  const startedAt = session.startedAt ?? session.createdAt;
  const endedAt = session.endedAt ?? startedAt;
  const durationSeconds =
    (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 pb-24">
      <div className="flex items-start gap-1">
        <Link
          to="/history"
          aria-label="Retour à l'historique"
          className="-ml-2 grid size-10 shrink-0 place-items-center rounded-full text-base-content transition-colors hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
        >
          <ChevronLeftIcon aria-hidden="true" className="size-6" />
        </Link>

        <h1 className="py-0.5 font-display font-extrabold text-2xl uppercase italic leading-snug lg:text-4xl">
          {formatSessionDateWithWeekday(startedAt)}
        </h1>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        <div className="flex flex-col-reverse gap-1 rounded-box border border-base-300 bg-base-200 p-3">
          <dt className="text-base-content/75 text-xs uppercase tracking-widest">
            Durée
          </dt>
          <dd className="font-display font-extrabold text-lg italic tabular-nums">
            {formatDuration(durationSeconds)}
          </dd>
        </div>
        <div className="flex flex-col-reverse gap-1 rounded-box border border-base-300 bg-base-200 p-3">
          <dt className="text-base-content/75 text-xs uppercase tracking-widest">
            Séries
          </dt>
          <dd className="font-display font-extrabold text-lg italic tabular-nums">
            {setCount}
          </dd>
        </div>
        <div className="flex flex-col-reverse gap-1 rounded-box border border-base-300 bg-base-200 p-3">
          <dt className="text-base-content/75 text-xs uppercase tracking-widest">
            Volume
          </dt>
          <dd className="font-display font-extrabold text-lg italic tabular-nums">
            {totalVolumeKg.toLocaleString("fr-FR")} kg
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-4">
        {session.exercises.map((exercise) => (
          <CompletedExerciseBlock
            key={exercise.sessionExerciseId}
            exercise={exercise}
            onOpenDetail={setSelectedExerciseId}
          />
        ))}
      </div>

      <ExerciseDetailSheet
        exerciseId={selectedExerciseId}
        onClose={() => setSelectedExerciseId(null)}
      />
    </main>
  );
}

export default CompletedSessionView;
