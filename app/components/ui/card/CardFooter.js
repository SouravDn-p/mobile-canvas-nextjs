const CardFooter = ({ children, className = "", ...props }) => (
  <div className={`flex items-center p-8 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export default CardFooter;
