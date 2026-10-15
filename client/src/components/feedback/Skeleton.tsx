type SkeletonProps = {
  className?: string;
};

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-field bg-base-300 motion-reduce:animate-none ${className}`}
    />
  );
}

export default Skeleton;
