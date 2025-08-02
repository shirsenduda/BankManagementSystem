import { ArrowRight, Search, Target, Award, TrendingUp } from 'lucide-react';

const FindPerfectCardSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-emerald-600/15 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Enhanced Decorative Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-1/3 h-1/3 text-emerald-500/10" viewBox="0 0 400 400">
          <path d="M0,0 Q200,200 0,400" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M50,0 Q250,150 50,350" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-emerald-400/60 rotate-45 animate-pulse"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-emerald-500/60 rotate-45 animate-pulse delay-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Enhanced Card Stack */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative">
              {/* Enhanced Card Stack with Multiple Cards */}
              <div className="relative">
                {/* Black Card (Back) - Enhanced */}
                <div className="w-80 h-48 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl p-6 relative overflow-hidden transform rotate-6 shadow-2xl border border-slate-500/30">
                  {/* Enhanced Pattern */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-bold opacity-75 tracking-wide">CREDIT CARD PRO</div>
                      <div className="w-10 h-6 bg-white/20 rounded backdrop-blur-sm"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-lg font-mono tracking-[0.2em] opacity-75 font-light">
                        1692 0711 2019 2021
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-50 font-medium tracking-wide">JAMES ANDRE</div>
                        </div>
                        <div className="text-xs opacity-50 font-medium">09/28</div>
                        <div className="flex gap-1">
                          <div className="w-6 h-4 bg-white/20 rounded-sm"></div>
                          <div className="w-6 h-4 bg-white/20 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Chip */}
                  <div className="absolute top-16 left-6 w-10 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-md shadow-lg opacity-75"></div>
                </div>

                {/* Green Card (Middle) - Enhanced */}
                <div className="absolute top-4 left-4 w-80 h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-6 relative overflow-hidden transform rotate-3 shadow-2xl border border-emerald-300/30 hover:rotate-2 transition-transform duration-500">
                  {/* Enhanced Pattern */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/15 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-emerald-700/20 to-transparent rounded-full translate-y-10 -translate-x-10"></div>
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-bold tracking-wide">CREDIT CARD PRO</div>
                      <div className="w-10 h-6 bg-white/30 rounded backdrop-blur-sm border border-white/20"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-lg font-mono tracking-[0.2em] font-light">
                        1692 0711 2019 2021
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-75 font-medium tracking-wide">JAMES ANDRE</div>
                        </div>
                        <div className="text-xs opacity-75 font-medium">09/28</div>
                        <div className="flex gap-1">
                          <div className="w-6 h-4 bg-white/90 rounded-sm shadow-sm"></div>
                          <div className="w-6 h-4 bg-white/90 rounded-sm shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Chip */}
                  <div className="absolute top-16 left-6 w-10 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md shadow-lg border border-yellow-200/50"></div>
                </div>

                {/* Light Green Card (Front) - Enhanced */}
                <div className="absolute top-8 left-8 w-80 h-48 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-2xl p-6 relative overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500 ring-2 ring-emerald-400/20">
                  {/* Enhanced Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-white/10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 to-transparent"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-bold tracking-wide">CREDIT CARD PRO</div>
                      <div className="w-10 h-6 bg-white/40 rounded backdrop-blur-sm border border-white/30"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-lg font-mono tracking-[0.2em] font-light">
                        1692 0711 2019 2021
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-90 font-medium tracking-wide">JAMES ANDRE</div>
                        </div>
                        <div className="text-xs opacity-90 font-medium">09/28</div>
                        <div className="flex gap-1">
                          <div className="w-6 h-4 bg-white rounded-sm shadow-sm"></div>
                          <div className="w-6 h-4 bg-white rounded-sm shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Chip */}
                  <div className="absolute top-16 left-6 w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md shadow-lg border border-yellow-100/50"></div>
                </div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className="absolute -top-8 -right-8 w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                <Target size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rotate-45 shadow-lg animate-pulse delay-300"></div>
              
              {/* Additional Floating Particles */}
              <div className="absolute top-1/3 -right-4 w-3 h-3 bg-emerald-300/60 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/3 -left-2 w-2 h-2 bg-teal-400/60 rounded-full animate-pulse delay-1500"></div>
            </div>
          </div>

          {/* Right Content - Enhanced */}
          <div className="space-y-10">
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm">
                <Search size={16} />
                <span>Smart Card Finder</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                Find the Perfect{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Credit Card
                </span>{' '}
                for You
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed font-light">
                Discover your ideal credit card with ease. Our comprehensive selection engine guides credit cards to deliver personalized recommendations. Whether you prioritize rewards, low fees, or building credit, we'll help you find the perfect credit card that fits your unique goals and lifestyle.
              </p>

              {/* Enhanced Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Reward Optimization</div>
                    <div className="text-gray-400 text-xs">Maximize your cashback</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Award size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Credit Building</div>
                    <div className="text-gray-400 text-xs">Improve your score</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-3">
                  <Search size={20} />
                  Find My Card
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button className="px-8 py-4 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300 hover:bg-white/5">
                  Compare Cards
                </button>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default FindPerfectCardSection;