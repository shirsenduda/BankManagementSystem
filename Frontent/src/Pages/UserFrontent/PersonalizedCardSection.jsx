import React, { useContext } from 'react';
import { ArrowRight, Palette, Sparkles, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';

const PersonalizedCardSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AppContext);

  const handleCreateAccount = () => {
    if (isAuthenticated) {
      // User is already logged in, maybe redirect to dashboard or card customization
      navigate('/dashboard');
    } else {
      // Scroll to top smoothly to show navbar
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Navigate to login page after a short delay to allow scroll animation
      setTimeout(() => {
        navigate('/login');
      }, 500);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Refined Decorative Elements */}
      <div className="absolute top-12 left-12 w-3 h-3 bg-emerald-400/80 rotate-45 animate-pulse shadow-lg shadow-emerald-400/20"></div>
      <div className="absolute bottom-24 right-24 w-2 h-2 bg-emerald-500/80 rotate-45 animate-pulse delay-300 shadow-lg shadow-emerald-500/20"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-emerald-300/60 rotate-45 animate-pulse delay-700"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Enhanced */}
          <div className="space-y-10">
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm">
                <Sparkles size={16} />
                <span>Personalization Studio</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                Design your{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  personalized
                </span>{' '}
                credit card.
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed font-light max-w-lg">
                You have the freedom to personalize the design of your own credit card, ensuring a truly unique experience that makes you stand out from the crowd.
              </p>

              {/* Enhanced Features List */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm font-medium">Custom colors and patterns</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm font-medium">Premium materials available</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm font-medium">Real-time preview</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleCreateAccount}
                  className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-3"
                >
                  <Palette size={20} />
                  {isAuthenticated ? 'Customize Card' : 'Create account'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                {/* <button className="px-8 py-4 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300 hover:bg-white/5">
                  View Gallery
                </button> */}
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Card Stack */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Card Stack with Enhanced Design */}
              <div className="relative">
                {/* Green Card (Top) - Enhanced */}
                <div className="w-80 h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-6 relative overflow-hidden transform rotate-2 shadow-2xl hover:rotate-1 transition-transform duration-500 border border-emerald-300/20">
                  {/* Enhanced Card Pattern */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-700/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-bold tracking-wide">CREDIT CARD PRO</div>
                      <div className="w-10 h-6 bg-white/30 rounded backdrop-blur-sm border border-white/20"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-lg font-mono tracking-[0.2em] font-light">
                        •••• •••• •••• 2021
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
                  
                  {/* Card Chip Enhancement */}
                  <div className="absolute top-16 left-6 w-10 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md shadow-lg border border-yellow-200/50"></div>
                </div>

                {/* White Card (Bottom) - Enhanced */}
                <div className="absolute top-8 left-8 w-80 h-48 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-2xl transform -rotate-2 hover:-rotate-1 transition-transform duration-500 border border-gray-200">
                  {/* Enhanced Pattern */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-gray-100 to-transparent rounded-full -translate-y-14 translate-x-14"></div>
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between text-slate-800">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-bold tracking-wide">CREDIT CARD</div>
                      <div className="w-10 h-6 bg-gray-300 rounded border border-gray-400/50"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-lg font-mono tracking-[0.2em] font-light">
                        •••• •••• •••• 2021
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-75 font-medium tracking-wide">JAMES ANDRE</div>
                        </div>
                        <div className="text-xs opacity-75 font-medium">09/28</div>
                        <div className="flex gap-1">
                          <div className="w-6 h-4 bg-slate-800 rounded-sm shadow-sm"></div>
                          <div className="w-6 h-4 bg-slate-800 rounded-sm shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Chip Enhancement */}
                  <div className="absolute top-16 left-6 w-10 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-md shadow-lg border border-gray-400/50"></div>
                </div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-8 -left-10 w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rotate-45 animate-pulse delay-500 shadow-lg rounded-sm"></div>
              
              {/* Additional Floating Particles */}
              <div className="absolute top-1/4 -left-4 w-3 h-3 bg-emerald-300/60 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/4 -right-2 w-2 h-2 bg-teal-400/60 rounded-full animate-pulse delay-1500"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="mt-20 pt-16 border-t border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto">
                <Palette className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Custom Design</h3>
              <p className="text-gray-400 text-sm">Choose from hundreds of templates or create your own</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Secure Process</h3>
              <p className="text-gray-400 text-sm">Bank-grade security throughout the customization process</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Premium Materials</h3>
              <p className="text-gray-400 text-sm">High-quality materials for a premium feel</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedCardSection;