const Label = ({ children, className = "", ...props }) => (
  <label
    className={`text-sm font-medium leading-none text-gray-300 ${className}`}
    {...props}
  >
    {children}
  </label>
);

export default Label;
