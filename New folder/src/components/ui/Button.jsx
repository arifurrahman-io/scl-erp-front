const Button = ({ children, variant = "primary", className, ...props }) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline:
      "border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
