"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert" className="container mx-auto">
      <h1 className="font-heading text-[#1D3557] dark:text-white mb-10">
        Something went wrong!
      </h1>
      <button type="button" className="btn-primary" onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}
