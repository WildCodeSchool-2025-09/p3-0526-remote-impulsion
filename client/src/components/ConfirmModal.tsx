type ConfirmModalProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal = ({
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-base-100/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-box border border-base-300 bg-base-200 p-6 shadow-2xl">
        <h2 className="font-display font-extrabold text-xl uppercase italic md:text-2xl">
          {title}
        </h2>

        <p className="mt-2 text-base-content/75 text-sm leading-6 md:whitespace-nowrap">
          {message}
        </p>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-5 w-full rounded-lg bg-error px-4 py-3 font-semibold text-error-content transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-error focus-visible:outline-offset-2"
        >
          {confirmLabel}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="mt-3 w-full rounded-lg border border-base-content/40 px-4 py-3 font-semibold transition-colors hover:border-base-content hover:bg-base-300 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
