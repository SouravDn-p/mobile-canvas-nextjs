const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default:
      "bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10",
    secondary:
      "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shadow-lg shadow-yellow-500/10",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    success:
      "bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg shadow-green-500/10",
    purple:
      "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10",
    admin: "bg-red-500/20 text-red-300 border border-red-500/30",
    outline: "text-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
