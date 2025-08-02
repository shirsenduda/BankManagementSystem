import { ArrowRight, Star, Shield, Award, Users } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { value: "16y", label: "Experience", icon: Award },
    { value: "250+", label: "Products Served", icon: Star },
    { value: "18+", label: "Awards Received", icon: Award },
    { value: "10.2k+", label: "Satisfied Clients", icon: Users },
  ];

  const customerAvatars = [
    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1",
    "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1",
    "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1",
  ];

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm mt-4">
                <Shield size={16} />
                <span>Bank-Grade Security & Trust</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Discover the Perfect{" "}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Bank Card
                </span>{" "}
                for You
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed max-w-lg font-light">
                Experience the power of our secure and rewarding credit cards.
                Explore our comprehensive range of financial solutions and take
                complete control of your financial future.
              </p>

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
            </div>

            {/* Enhanced Customer Reviews */}
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
          </div>

          {/* Right Content - Enhanced Credit Card */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Credit Card with Enhanced Design */}
              <div className="w-80 h-48 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-2xl border border-slate-600/50 hover:scale-105 transition-transform duration-500">
                {/* Premium Card Pattern */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded flex items-center justify-center shadow-lg">
                      <div className="w-6 h-4 bg-yellow-600/80 rounded-sm"></div>
                    </div>
                    <div className="text-right text-sm font-medium tracking-wider">
                      <div className="text-blue-300">PLATINUM</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-xl font-mono tracking-[0.3em] font-light">
                      1692 0711 2019 2021
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs text-gray-400 font-medium tracking-wide">
                          CARD HOLDER
                        </div>
                        <div className="font-semibold tracking-wide">
                          JAMES ANDRE
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium tracking-wide">
                          VALID THRU
                        </div>
                        <div className="font-semibold">09/28</div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-7 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded"></div>
                        <div className="w-7 h-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse delay-300 shadow-lg"></div>

              {/* Additional Cards Behind */}
              <div className="absolute top-2 left-2 w-80 h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl -z-10 opacity-60"></div>
              <div className="absolute top-4 left-4 w-80 h-48 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl -z-20 opacity-40"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics */}
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
      </div>
    </section>
  );
};

export default HeroSection;
