import { ArrowRight, Star, Shield, Award, Users } from "lucide-react";

// Call to Action Buttons Component
const CTAButtons = () => (
  <div className="flex flex-col sm:flex-row gap-4">
    <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-3">
      Get Started Today
      <ArrowRight
        size={20}
        className="group-hover:translate-x-1 transition-transform duration-300"
      />
    </button>
    <button className="px-8 py-4 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300 hover:bg-white/5">
      Learn More
    </button>
  </div>
);
export default CTAButtons;