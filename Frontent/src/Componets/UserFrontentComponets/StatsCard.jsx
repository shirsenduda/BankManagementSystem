import { ArrowRight, Star, Shield, Award, Users, CheckCircle, Globe, TrendingUp } from "lucide-react";

const StatsCard = ({ icon: Icon, number, label, description }) => (
  <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:bg-dark-800/70 transition-all duration-300">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-400" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white">{number}</h3>
        <p className="text-sm text-primary-400 font-medium">{label}</p>
      </div>
    </div>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

export default StatsCard;