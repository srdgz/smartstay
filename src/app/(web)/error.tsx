"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto">
      <h2 className="font-heading text-[#1D3557] mb-10">
        Something went wrong!
      </h2>
      <button className="btn-primary" onClick={() => reset}>
        Try Again
      </button>
    </div>
  );
}
