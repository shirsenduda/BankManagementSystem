import { Shield, TrendingUp, CreditCard, ArrowRight, Check } from 'lucide-react';

const OfferSection = () => {
  const offers = [
    {
      icon: Shield,
      title: 'Security Guarantee',
      description: 'Your data and transactions are protected with bank-level security and fraud monitoring.',
      features: ['256-bit Encryption', 'Real-time Monitoring', 'Fraud Protection'],
      color: 'emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Smart Investing',
      description: 'Grow your wealth with our investment options and earn rewards on every purchase.',
      features: ['Auto-investing', 'Portfolio Management', 'Cashback Rewards'],
      color: 'teal-500'
    },
    {
      icon: CreditCard,
      title: 'Multiple Methods',
      description: 'Pay your way with flexible payment methods and contactless technology.',
      features: ['Contactless Payments', 'Digital Wallets', 'Global Acceptance'],
      color: 'cyan-500'
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400/60 rotate-45 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-3 h-3 bg-teal-400/60 rotate-45 animate-pulse delay-300"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Premium Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            What do we{' '}
            <span className="text-emerald-400">
              offer?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 font-light">
            Discover our comprehensive suite of financial solutions designed to elevate your banking experience
          </p>
          
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-${offer.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
              
              {/* Icon with Enhanced Design */}
              <div className="relative mb-8">
                <div className={`w-20 h-20 bg-${offer.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                  <offer.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-emerald-400/60 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-teal-400/60 rounded-full animate-pulse delay-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors duration-300">
                {offer.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
                {offer.description}
              </p>

              {/* Feature List */}
              <div className="space-y-3 mb-6">
                {offer.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 bg-${offer.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className="group/btn w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                Learn More
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>

              {/* Enhanced Hover Effect */}
              <div className="absolute inset-0 bg-emerald-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform -skew-x-12 group-hover:animate-shimmer rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        
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

export default OfferSection;