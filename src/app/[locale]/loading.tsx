const LoadingSpinner = () => {
  return (
    <div
      role="status"
      className="flex items-center justify-center h-screen"
    >
      <div
        aria-hidden="true"
        className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1D3557] dark:border-white"
      />
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default LoadingSpinner;
