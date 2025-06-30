const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={`text-3xl font-bold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export default CardTitle;
