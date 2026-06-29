type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <section className="state-card" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </section>
  );
}
