import { ArrowRight, Star, Shield, Award, Users, CheckCircle, Globe, TrendingUp } from "lucide-react";
import AboutDescription from '../../Componets/UserFrontentComponets/AboutDescription';
import FeatureCard from '../../Componets/UserFrontentComponets/FeatureCard';
import StatsCard from '../../Componets/UserFrontentComponets/StatsCard';

const About = () => {
  const stats = [
    {
      icon: Users,
      number: "2M+",
      label: "Happy Customers",
      description: "Trusted by millions worldwide"
    },
    {
      icon: Globe,
      number: "50+",
      label: "Countries",
      description: "Global presence and reach"
    },
    {
      icon: Award,
      number: "25+",
      label: "Years Experience",
      description: "Decades of banking excellence"
    },
    {
      icon: TrendingUp,
      number: "99.9%",
      label: "Uptime",
      description: "Reliable service guarantee"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Advanced encryption and multi-layered security protocols protect your financial data 24/7."
    },
    {
      icon: Star,
      title: "Premium Rewards",
      description: "Earn valuable rewards on every transaction with our comprehensive cashback and points system."
    },
    {
      icon: CheckCircle,
      title: "Instant Approvals",
      description: "Get approved in minutes with our streamlined application process and real-time decisions."
    }
  ];

  return (
    <section className="min-h-screen py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900">
      {/* Background Effects - Matching OfferSection */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Decorative Elements - Matching OfferSection */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rotate-45 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-3 h-3 bg-indigo-400/60 rotate-45 animate-pulse delay-300"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Enhanced Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>About Our Bank</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Why Choose 
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent"> GreenBank?</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 font-light">
            We're committed to providing innovative financial solutions that adapt to your evolving needs, 
            backed by cutting-edge technology and unparalleled customer service.
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
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
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm font-medium tracking-wide mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-500 text-xs">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Stats Grid */}

        {/* Enhanced Features Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const colors = [
                'from-blue-500 to-indigo-500',
                'from-indigo-500 to-purple-500', 
                'from-purple-500 to-pink-500'
              ];
              return (
                <div key={index} className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors[index]} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                  
                  {/* Icon with Enhanced Design */}
                  <div className="relative mb-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${colors[index]} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Floating particles */}
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400/60 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-400/60 rounded-full animate-pulse delay-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* CTA Button */}
                  <button className="group/btn w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                    Learn More
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>

                  {/* Enhanced Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform -skew-x-12 group-hover:animate-shimmer rounded-2xl pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 md:p-16 overflow-hidden group hover:border-blue-500/20 transition-all duration-500">
            {/* CTA Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-flex items-center space-x-2 text-blue-400 mb-4">
                  <Star className="w-5 h-5" />
                  <span className="text-sm font-semibold tracking-wide uppercase">Get Started</span>
                  <Star className="w-5 h-5" />
                </div>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                Ready to Experience the Future?
              </h3>
              
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                Join millions of satisfied customers and discover how GreenBank can transform your financial journey 
                with innovative solutions tailored to your needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-3">
                  <span className="text-lg">Get Started Today</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
                
                <button className="px-8 py-4 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300 hover:bg-white/5">
                  <span className="text-lg">Learn More</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-8 mt-12 pt-8 border-t border-slate-700/50">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Bank-Level Security</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">FDIC Insured</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Award Winning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default About;