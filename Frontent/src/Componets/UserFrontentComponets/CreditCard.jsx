import { ArrowRight, Star, Shield, Award, Users, Lock, Zap } from "lucide-react";

// Credit Card Component - Mobile Responsive (Desktop Design Preserved)
const CreditCard = () => (
  <div className="relative group w-full flex justify-center">
    {/* Main Credit Card with Ultra-Professional Design */}
    <div className="w-full max-w-[320px] h-[200px] md:w-[400px] md:h-[250px] bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-[16px] md:rounded-[20px] p-4 md:p-8 relative overflow-hidden shadow-[0_15px_35px_-8px_rgba(0,0,0,0.6)] md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border border-slate-700/30 hover:scale-[1.01] md:hover:scale-[1.02] transition-all duration-700 ease-out hover:shadow-[0_25px_45px_-8px_rgba(59,130,246,0.3)] md:hover:shadow-[0_35px_60px_-12px_rgba(59,130,246,0.4)]">
      
      {/* Sophisticated Background Pattern */}
      <div className="absolute inset-0">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-[0.02] md:opacity-[0.03]">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,_white_1px,_transparent_1px)] bg-[length:16px_16px] md:bg-[length:20px_20px]"></div>
        </div>
        
        {/* Premium light reflections */}
        <div className="absolute top-0 right-0 w-28 h-28 md:w-40 md:h-40 bg-gradient-to-bl from-blue-500/6 md:from-blue-500/8 via-transparent to-transparent rounded-full -translate-y-14 translate-x-14 md:-translate-y-20 md:translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-slate-400/4 md:from-slate-400/5 via-transparent to-transparent rounded-full translate-y-12 -translate-x-12 md:translate-y-16 md:-translate-x-16"></div>
        
        {/* Sharp accent line */}
        <div className="absolute top-0 left-0 w-full h-[0.5px] md:h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 md:via-blue-400/30 to-transparent"></div>
      </div>

      {/* Card Content */}
      <div className="relative z-10 h-full flex flex-col justify-between text-white">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          {/* Premium Chip */}
          <div className="relative">
            <div className="w-10 h-7 md:w-14 md:h-10 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-md md:rounded-lg flex items-center justify-center shadow-md md:shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="w-6 h-4 md:w-8 md:h-6 bg-gradient-to-br from-amber-600 to-amber-700 rounded-sm relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-sm"></div>
              </div>
            </div>
            {/* Chip reflection */}
            <div className="absolute -top-0.5 md:-top-1 -left-0.5 md:-left-1 w-3 h-3 md:w-4 md:h-4 bg-white/10 rounded-full blur-sm"></div>
          </div>
          
          {/* Card Type & NFC */}
          <div className="text-right space-y-0.5 md:space-y-1">
            <div className="text-xs md:text-sm font-semibold tracking-[0.15em] md:tracking-[0.2em] text-slate-300 flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 md:w-5 md:h-5 rounded-full border border-white/30 md:border-2 md:border-white/40 flex items-center justify-center">
                <div className="w-1 h-1 md:w-2 md:h-2 bg-white/60 rounded-full animate-pulse"></div>
              </div>
              PLATINUM
            </div>
            <div className="text-[10px] md:text-xs text-slate-400 font-medium">CONTACTLESS</div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="space-y-3 md:space-y-6">
          {/* Card Number */}
          <div className="relative">
            <div className="text-base md:text-2xl font-mono tracking-[0.25em] md:tracking-[0.4em] font-medium text-white/95 relative">
              1692 0711 2019 2021
            </div>
            {/* Subtle highlight effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Card Details */}
          <div className="flex justify-between items-end">
            <div className="space-y-0.5 md:space-y-1">
              <div className="text-[8px] md:text-[10px] text-slate-400 font-semibold tracking-[0.1em] md:tracking-[0.15em] uppercase">
                Card Holder
              </div>
              <div className="text-sm md:text-base font-semibold tracking-[0.02em] md:tracking-[0.05em] text-white/95">
                JAMES ANDRE
              </div>
            </div>
            
            <div className="space-y-0.5 md:space-y-1 text-center">
              <div className="text-[8px] md:text-[10px] text-slate-400 font-semibold tracking-[0.1em] md:tracking-[0.15em] uppercase">
                Valid Thru
              </div>
              <div className="text-sm md:text-base font-semibold text-white/95">09/28</div>
            </div>
            
            {/* Premium Logo */}
            <div className="flex items-center gap-0.5 md:gap-1">
              <div className="w-6 h-4 md:w-8 md:h-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-sm md:rounded-md relative overflow-hidden shadow-sm md:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 bg-white/30 rounded-full -translate-y-0.5 -translate-x-0.5 md:-translate-y-1 md:-translate-x-1"></div>
              </div>
              <div className="w-6 h-4 md:w-8 md:h-6 bg-gradient-to-r from-indigo-500 via-purple-600 to-purple-700 rounded-sm md:rounded-md relative overflow-hidden shadow-sm md:shadow-md -ml-1 md:-ml-2">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <div className="absolute top-0 left-0 w-2 h-2 md:w-3 md:h-3 bg-white/30 rounded-full translate-y-0.5 translate-x-0.5 md:translate-y-1 md:translate-x-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features Indicator */}
        <div className="absolute bottom-1 md:bottom-2 left-4 md:left-8 opacity-30 md:opacity-40">
          <div className="flex items-center gap-0.5 md:gap-1 text-[6px] md:text-[8px] text-slate-400 font-medium">
            <Lock size={6} className="md:w-2 md:h-2" />
            <span>SECURED</span>
          </div>
        </div>
      </div>

      {/* Holographic Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.015] md:from-white/[0.02] via-transparent to-blue-500/[0.015] md:to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>

    {/* Professional Floating Elements */}
    <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-7 h-7 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl shadow-md md:shadow-lg flex items-center justify-center group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300">
      <Shield size={12} className="md:w-4 md:h-4 text-white" />
    </div>
    
    <div className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 w-5 h-5 md:w-7 md:h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-md md:rounded-lg shadow-md md:shadow-lg flex items-center justify-center group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300 delay-100">
      <Zap size={10} className="md:w-3 md:h-3 text-white" />
    </div>

    {/* Enhanced Card Stack - Hidden on mobile for cleaner look */}
    <div className="hidden md:block absolute top-3 left-3 w-[400px] h-[250px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-[20px] -z-10 opacity-40 border border-slate-600/20"></div>
    <div className="hidden md:block absolute top-6 left-6 w-[400px] h-[250px] bg-gradient-to-br from-slate-700 to-slate-800 rounded-[20px] -z-20 opacity-25 border border-slate-500/20"></div>

    {/* Professional Glow Effect */}
    <div className="absolute inset-0 -z-30 bg-gradient-to-r from-blue-600/15 md:from-blue-600/20 via-transparent to-purple-600/15 md:to-purple-600/20 rounded-[18px] md:rounded-[24px] blur-lg md:blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
  </div>
);

export default CreditCard;