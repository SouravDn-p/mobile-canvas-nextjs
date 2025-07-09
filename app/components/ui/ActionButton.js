import Button from "./button";

const ActionButton = ({
  icon: Icon,
  title,
  description,
  onClick,
  variant = "outline",
}) => (
  <Button
    variant={variant}
    className="w-full justify-start h-auto p-4 flex-col items-start space-y-1 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center w-full">
      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
      <div className="text-left min-w-0 flex-1">
        <p className="font-medium text-sm truncate">{title}</p>
        <p className="text-xs text-gray-400 truncate">{description}</p>
      </div>
    </div>
  </Button>
);

export default ActionButton;
