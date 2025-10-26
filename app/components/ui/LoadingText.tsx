type LoadingTextProps = {
  children?: React.ReactNode;
  className?: string;
};

export function LoadingText({
  children = "Loading...",
  className = "opacity-50"
}: LoadingTextProps) {
  return (
    <span className={className} role="status" aria-live="polite">
      {children}
    </span>
  );
}
