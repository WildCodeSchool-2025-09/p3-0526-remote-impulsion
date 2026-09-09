type LocalErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

function LocalErrorState({ message, onRetry }: LocalErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-box border border-error/40 bg-error/10 p-6 text-center"
    >
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-full bg-error font-bold text-error-content"
      >
        !
      </span>

      <p className="max-w-md text-base-content text-sm leading-5">{message}</p>

      {onRetry !== undefined && (
        <button
          type="button"
          className="rounded-field bg-error px-4 py-2 font-semibold text-error-content text-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-error focus-visible:outline-offset-2"
          onClick={onRetry}
        >
          Réessayer
        </button>
      )}
    </div>
  );
}

export default LocalErrorState;
