import Skeleton from "./feedback/Skeleton";

function ExerciseCardSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-2 rounded-box border border-base-300 bg-base-200 p-3">
      {/* Skeleton gere l'animation et le fond : on ne passe que la taille */}
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export default ExerciseCardSkeleton;
