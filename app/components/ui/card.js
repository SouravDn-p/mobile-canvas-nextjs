const Card = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default:
      "rounded-2xl border border-gray-700/50 bg-gray-900/50 text-gray-100 shadow-xl backdrop-blur-sm",
    gradient:
      "rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/30 text-gray-100 shadow-xl backdrop-blur-sm",
    glass:
      "rounded-2xl bg-gray-900/30 border border-gray-700/30 text-gray-100 shadow-xl backdrop-blur-xl",
    premium:
      "rounded-2xl bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 text-gray-100 shadow-xl backdrop-blur-sm",
    admin:
      "rounded-2xl bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 text-gray-100 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300",
    product:
      "rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/40 text-gray-100 shadow-xl backdrop-blur-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 group",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
