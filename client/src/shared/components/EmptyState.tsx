type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <section className="state-card">
      <h3>{title}</h3>
      <p>{message}</p>
    </section>
  );
}
