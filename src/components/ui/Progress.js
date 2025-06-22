const Progress = ({ value = 0, className = "", max = 100 }) => {
  const percentage = Math.min(Math.max(value, 0), max);
  const classes = `relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`;

  return (
    <div className={classes}>
      <div
        className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
        style={{ transform: `translateX(-${100 - (percentage / max) * 100}%)` }}
      />
    </div>
  );
};

export { Progress };
