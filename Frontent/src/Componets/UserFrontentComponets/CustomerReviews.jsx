import { ArrowRight, Star, Shield, Award, Users } from "lucide-react";

// Customer Reviews Component
const CustomerReviews = ({ customerAvatars }) => (
  <div className="flex items-center gap-6 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
    <div className="flex -space-x-3">
      {customerAvatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Customer ${index + 1}`}
          className="w-12 h-12 rounded-full border-3 border-slate-800 object-cover ring-2 ring-blue-500/20"
        />
      ))}
    </div>
    <div className="text-sm">
      <div className="flex items-center gap-1 text-yellow-400 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
        <span className="text-white font-semibold ml-2">4.9/5</span>
      </div>
      <div className="text-gray-300">
        <span className="font-semibold text-white">7,200+</span>{" "}
        satisfied customers this year
      </div>
    </div>
  </div>
);
export default CustomerReviews;