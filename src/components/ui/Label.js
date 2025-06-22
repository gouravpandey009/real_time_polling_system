const Label = ({ children, htmlFor, className = "" }) => {
  const classes = `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`;

  return (
    <label htmlFor={htmlFor} className={classes}>
      {children}
    </label>
  );
};

export { Label };
