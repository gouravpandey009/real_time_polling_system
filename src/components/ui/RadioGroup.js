"use client";

import { createContext, useContext } from "react";

const RadioGroupContext = createContext();

const RadioGroup = ({ children, value, onValueChange, className = "" }) => {
  const classes = `grid gap-2 ${className}`;

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div classNamae={classes} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

const RadioGroupItem = ({ value, id, className = "" }) => {
  const context = useContext(RadioGroupContext);
  const classes = `aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`;

  const handleChange = () => {
    if (context?.onValueChange) {
      context.onValueChange(value);
    }
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={context?.value === value}
      onClick={handleChange}
      className={classes}
      id={id}
    >
      {context?.value === value && (
        <div className="flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-current" />
        </div>
      )}
    </button>
  );
};

export { RadioGroup, RadioGroupItem };
