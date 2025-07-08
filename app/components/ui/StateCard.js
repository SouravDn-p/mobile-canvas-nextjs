const { default: Card } = require("./card");
const { default: CardContent } = require("./cardContent");

const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
  color,
  bgGradient,
  glowColor,
}) => (
  <Card
    className={`hover:shadow-2xl ${glowColor} shadow-xl group cursor-pointer transition-all duration-500`}
  >
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-400 mb-1 truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-500 mt-1 truncate">{description}</p>
        </div>
        <div
          className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${bgGradient} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
        >
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
