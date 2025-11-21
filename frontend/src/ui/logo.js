import { Sun } from "lucide-react";

const Logo = ({ className = "", iconSize = "w-8 h-8", textSize = "text-2xl", textColor = "text-green-700" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Sun className={`${iconSize} text-yellow-500`} />
      <span className={`${textSize} font-bold ${textColor}`}>SOLcial</span>
    </div>
  );
};

export { Logo };

