import { useMessages } from "../../contexts/MessageContext";

const TONE_STYLES = {
  success: "border-success bg-success text-success-content",
  info: "border-info bg-info text-info-content",
  warning: "border-warning bg-warning text-warning-content",
  error: "border-error bg-error text-error-content",
};

const TONE_LABELS = {
  success: "Succès",
  info: "Information",
  warning: "Attention",
  error: "Erreur",
};

const TONE_ICONS = {
  success: "✓",
  info: "i",
  warning: "!",
  error: "×",
};

function MessageBanner() {
  const { currentMessage, dismissMessage } = useMessages();

  if (currentMessage === undefined) {
    return null;
  }

  return (
    <div
      role={currentMessage.tone === "error" ? "alert" : "status"}
      aria-live={currentMessage.tone === "error" ? "assertive" : "polite"}
      className={`fixed top-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-start gap-3 rounded-box border p-4 shadow-lg ${TONE_STYLES[currentMessage.tone]}`}
    >
      <span
        aria-hidden="true"
        className="grid size-7 shrink-0 place-items-center rounded-full bg-black/10 font-bold text-sm"
      >
        {TONE_ICONS[currentMessage.tone]}
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-display font-semibold text-sm uppercase tracking-wide">
          {TONE_LABELS[currentMessage.tone]}
        </p>
        <p className="mt-1 text-sm leading-5">{currentMessage.text}</p>
      </div>

      <button
        type="button"
        aria-label="Fermer le message"
        className="grid size-8 shrink-0 place-items-center rounded-full text-xl leading-none transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2"
        onClick={() => dismissMessage(currentMessage.id)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

export default MessageBanner;
