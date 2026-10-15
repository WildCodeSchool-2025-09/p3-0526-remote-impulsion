import { useMessages } from "../../contexts/MessageContext";

const TONE_STYLES = {
  success:
    "border-success/50 bg-[color-mix(in_oklab,var(--color-success)_16%,var(--color-base-100))]",
  info: "border-info/50 bg-[color-mix(in_oklab,var(--color-info)_16%,var(--color-base-100))]",
  warning:
    "border-warning/50 bg-[color-mix(in_oklab,var(--color-warning)_16%,var(--color-base-100))]",
  error:
    "border-error/50 bg-[color-mix(in_oklab,var(--color-error)_16%,var(--color-base-100))]",
};

const TONE_BADGES = {
  success: "bg-success text-success-content",
  info: "bg-info text-info-content",
  warning: "bg-warning text-warning-content",
  error: "bg-error text-error-content",
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
      className={`fixed inset-x-4 bottom-24 z-40 flex items-center gap-3 rounded-box border py-3 pr-2 pl-3 shadow-lg lg:inset-x-auto lg:right-6 lg:bottom-6 lg:w-80 ${TONE_STYLES[currentMessage.tone]}`}
    >
      <span
        aria-hidden="true"
        className={`grid size-6 shrink-0 place-items-center rounded-full font-bold text-xs ${TONE_BADGES[currentMessage.tone]}`}
      >
        {TONE_ICONS[currentMessage.tone]}
      </span>

      <p className="min-w-0 flex-1 text-base-content text-sm leading-5">
        <span className="sr-only">{TONE_LABELS[currentMessage.tone]} : </span>
        {currentMessage.text}
      </p>

      <button
        type="button"
        aria-label="Fermer le message"
        className="grid size-8 shrink-0 place-items-center rounded-full text-lg text-neutral leading-none transition-colors hover:bg-base-300 hover:text-base-content focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
        onClick={() => dismissMessage(currentMessage.id)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

export default MessageBanner;
