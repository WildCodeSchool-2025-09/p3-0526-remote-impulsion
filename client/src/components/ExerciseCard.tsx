import type { ExerciseSummary } from "../types/exercise";

function ExerciseCard({ exercise }: { exercise: ExerciseSummary }) {
  return (
    <button
      type="button"
      // TODO US10 : ouvrir la modale de la fiche exercice
      onClick={() => {}}
      className="group flex w-full items-center gap-3 rounded-xl border border-[#334155] bg-[#1E293B] p-3 text-left transition hover:border-[#FF6B35]/60 hover:bg-[#243247]"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-md border-2 border-[#64748B] transition group-hover:border-[#FF6B35]"
      />

      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#0F172A]">
        <img
          src={`${import.meta.env.VITE_API_URL}${exercise.imageUrl}`}
          alt={exercise.name}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = `${import.meta.env.VITE_API_URL}/assets/images/placeholder-exercise.png`;
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-bold text-[#F8FAFC]">
          {exercise.name}
        </h2>

        <p className="mt-1 truncate text-xs text-[#94A3B8]">
          {exercise.category}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="shrink-0 text-xl text-[#64748B] transition group-hover:text-[#FF6B35]"
      >
        ›
      </span>
    </button>
  );
}

export default ExerciseCard;
