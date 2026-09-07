function ExerciseCardSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-2 rounded-box border border-base-300 bg-base-200 p-3">
      <div className="aspect-square w-full animate-pulse rounded-field bg-base-300" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-base-300" />
      <div className="h-4 w-1/3 animate-pulse rounded-pill bg-base-300" />
    </div>
  );
}

export default ExerciseCardSkeleton;
