import { Button } from "./Button";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <section className="state-card state-card-error" role="alert">
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>

      {onRetry ? (
        <Button type="button" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </section>
  );
}
