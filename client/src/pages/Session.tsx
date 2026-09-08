import usePreparedSessions from "../hooks/usePreparedSessions";

function Session() {
  return (
    <>
      <h1 className="text-2xl font-display italic font-extrabold uppercase">
        Séance
      </h1>

      <button type="button">Ajouter des exercices</button>

      <button type="button" disabled>
        Démarrer
      </button>
    </>
  );
}
export default Session;
