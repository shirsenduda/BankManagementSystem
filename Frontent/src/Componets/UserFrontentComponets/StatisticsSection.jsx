import { ArrowRight, Star, Shield, Award, Users } from "lucide-react";

// Statistics Component
const StatisticsSection = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 mb-10 pt-12 border-t border-slate-700/50">
    {stats.map((stat, index) => {
      const IconComponent = stat.icon;
      return (
        <div
          key={index}
          className="text-center group hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-center justify-center mb-3">
            <IconComponent
              size={24}
              className="text-blue-400 group-hover:text-blue-300"
            />
          </div>
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            {stat.value}
          </div>
          <div className="text-gray-400 text-sm font-medium tracking-wide">
            {stat.label}
          </div>
        </div>
      );
    })}
  </div>
);
export default StatisticsSection;