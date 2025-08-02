import { ArrowRight, Star, Shield, Award, Users } from "lucide-react";

// Background Elements Component
const BackgroundElements = () => (
  <>
    {/* Enhanced Background Elements */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent"></div>

    {/* Professional Grid Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>

    {/* Refined Decorative Elements */}
    <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400/60 rotate-45 animate-pulse"></div>
    <div className="absolute bottom-40 left-10 w-2 h-2 bg-indigo-400/60 rotate-45 animate-pulse delay-300"></div>
    <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-300/60 rotate-45 animate-pulse delay-700"></div>

    {/* Enhanced Curved Lines */}
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute bottom-0 right-0 w-1/2 h-1/2 text-blue-500/10"
        viewBox="0 0 400 400"
      >
        <path
          d="M0,400 Q200,200 400,400"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0,350 Q150,150 300,350"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M50,400 Q250,250 450,400"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>
    </div>
  </>
);
export default BackgroundElements;