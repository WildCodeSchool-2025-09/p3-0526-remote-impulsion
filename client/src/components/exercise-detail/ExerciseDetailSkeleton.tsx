import Skeleton from "../feedback/Skeleton";

function ExerciseDetailSkeleton() {
  return (
    <div className="space-y-5" aria-label="Chargement de la fiche exercice">
      <Skeleton className="h-36 w-full sm:h-44" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        {["step-one", "step-two", "step-three", "step-four"].map((step) => (
          <div key={step} className="flex items-center gap-3">
            <Skeleton className="size-6 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExerciseDetailSkeleton;
