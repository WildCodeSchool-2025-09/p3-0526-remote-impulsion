type HomeSessionActionProps = {
  subtitle: string;
  buttonLabel: string;
  onAction: () => void;
  isLoading: boolean;
};

const HomeSessionAction = ({
  subtitle,
  buttonLabel,
  onAction,
  isLoading,
}: HomeSessionActionProps) => {
  return (
    <>
      <p>{subtitle}</p>

      <button type="button" onClick={onAction} disabled={isLoading}>
        {isLoading ? "Chargement..." : buttonLabel}
      </button>
    </>
  );
};

export default HomeSessionAction;
