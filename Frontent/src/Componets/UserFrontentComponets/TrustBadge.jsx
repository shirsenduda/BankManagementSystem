import { ArrowRight, Star, Shield, Award, Users } from "lucide-react";

// Trust Badge Component
const TrustBadge = () => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm mt-4">
    <Shield size={16} />
    <span>Bank-Grade Security & Trust</span>
  </div>
);

export default TrustBadge;