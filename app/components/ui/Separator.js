const Separator = ({ className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-gray-700" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
    </div>
  </div>
);


export default Separator;