"use client";

const Card = ({ children, className = "", onClick }) => {
  const classes = `rounded-lg border bg-card text-card-foreground shadow-sm ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  const classes = `flex flex-col space-y-1.5 p-6 ${className}`;

  return <div className={classes}>{children}</div>;
};

const CardTitle = ({ children, className = "" }) => {
  const classes = `text-2xl font-semibold leading-none tracking-tight ${className}`;

  return <h3 className={classes}>{children}</h3>;
};

const CardContent = ({ children, className = "" }) => {
  const classes = `p-6 pt-0 ${className}`;

  return <div className={classes}>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardContent };
