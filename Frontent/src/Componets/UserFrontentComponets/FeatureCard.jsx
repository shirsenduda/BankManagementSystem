import { ArrowRight, Star, Shield, Award, Users, CheckCircle, Globe, TrendingUp } from "lucide-react";
// Features Component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group cursor-pointer">
    <div className="bg-dark-800/30 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:bg-dark-800/60 hover:border-primary-500/50 transition-all duration-300">
      <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors duration-300">
        <Icon className="w-6 h-6 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default FeatureCard;