import { useState, useEffect } from 'react';

const BrandSlider = () => {
  const brands = [
    { 
      name: 'Google', 
      logo: (
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Microsoft', 
      logo: (
        <div className="w-8 h-8 grid grid-cols-2 gap-0.5 p-0.5">
          <div className="bg-[#F25022] rounded-[1px]"></div>
          <div className="bg-[#7FBA00] rounded-[1px]"></div>
          <div className="bg-[#00BCF2] rounded-[1px]"></div>
          <div className="bg-[#FFB900] rounded-[1px]"></div>
        </div>
      )
    },
    { 
      name: 'Apple', 
      logo: (
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-6 h-7" fill="#A3A3A3" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Amazon', 
      logo: (
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-7 h-5" viewBox="0 0 24 18">
            <path fill="#FF9900" d="M.045 15.411c.343.243.79.243 1.133 0 4.051-2.846 9.45-2.846 13.501 0 .343.243.79.243 1.133 0s.343-.638 0-.881C11.32 11.684 4.68 11.684.045 14.53c-.343.243-.343.638 0 .881z"/>
            <path fill="#FF9900" d="M18.832 12.707c-.237-.079-.474 0-.632.158l-1.264 1.264c-.158.158-.237.395-.158.632.079.237.316.395.553.316l2.054-.632c.237-.079.395-.316.316-.553-.079-.237-.316-.395-.553-.316l-.316.079z"/>
            <path fill="#232F3E" d="M1.5 2h21L21 8H3l-1.5-6zM5.25 5.25h1.5v1.5h-1.5v-1.5zm3 0h1.5v1.5h-1.5v-1.5zm3 0h1.5v1.5h-1.5v-1.5zm3 0h1.5v1.5h-1.5v-1.5zm3 0h1.5v1.5h-1.5v-1.5z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Netflix', 
      logo: (
        <div className="w-8 h-8 flex items-center justify-center bg-[#E50914] rounded">
          <svg className="w-5 h-6" fill="white" viewBox="0 0 24 24">
            <path d="M5.4 2.6L7.8 8.4 5.4 21.4 8.7 21.4 10.2 12.6 11.7 21.4 15 21.4 12.6 8.4 15 2.6 11.7 2.6 10.2 11.4 8.7 2.6z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Spotify', 
      logo: (
        <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.062 14.455c-.203.323-.625.426-.948.223-2.596-1.584-5.862-1.944-9.71-1.065-.416.094-.832-.158-.926-.574-.094-.416.158-.832.574-.926 4.239-.968 7.925-.565 10.836 1.227.323.203.426.625.223.948zm1.354-3.011c-.256.406-.797.537-1.203.281-2.974-1.831-7.505-2.363-11.047-1.292-.521.158-1.072-.105-1.23-.625-.158-.521.105-1.072.625-1.23 4.05-1.225 9.066-.644 12.422 1.462.406.256.537.797.281 1.203zm.115-3.133C14.684 8.727 8.542 8.516 4.974 9.71c-.618.203-1.281-.135-1.484-.754-.203-.618.135-1.281.754-1.484 4.141-1.381 10.929-1.116 15.312 1.338.496.281.664.912.383 1.408-.281.496-.912.664-1.408.383z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Adobe', 
      logo: (
        <div className="w-8 h-8 bg-[#FF0000] rounded flex items-center justify-center">
          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
            <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Tesla', 
      logo: (
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-6 h-6" fill="#CC0000" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c4.64 0 8.4 3.76 8.4 8.4 0 4.64-3.76 8.4-8.4 8.4-4.64 0-8.4-3.76-8.4-8.4 0-4.64 3.76-8.4 8.4-8.4zm-3.7 5.85h7.4v1.1h-7.4v-1.1zm0 2.2h7.4v1.1h-7.4v-1.1zm1.85 2.75h3.7v1.1h-3.7v-1.1z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Samsung', 
      logo: (
        <div className="w-8 h-8 bg-[#1428A0] rounded-sm flex items-center justify-center">
          <svg className="w-6 h-4" fill="white" viewBox="0 0 24 16">
            <path d="M7.27 3.18c-.67 0-1.23.19-1.68.57-.45.38-.67.88-.67 1.5 0 .63.22 1.13.67 1.51.45.38 1.01.57 1.68.57.67 0 1.23-.19 1.68-.57.45-.38.67-.88.67-1.51 0-.62-.22-1.12-.67-1.5-.45-.38-1.01-.57-1.68-.57zm8.5 0c-.67 0-1.23.19-1.68.57-.45.38-.67.88-.67 1.5 0 .63.22 1.13.67 1.51.45.38 1.01.57 1.68.57.67 0 1.23-.19 1.68-.57.45-.38.67-.88.67-1.51 0-.62-.22-1.12-.67-1.5-.45-.38-1.01-.57-1.68-.57zM2.5 8.5h19v3H2.5z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Intel', 
      logo: (
        <div className="w-8 h-8 bg-[#0071C5] rounded flex items-center justify-center">
          <svg className="w-6 h-4" fill="white" viewBox="0 0 24 16">
            <path d="M2 2h2v12H2V2zm4 3h2v9H6V5zm4-1h2v10h-2V4zm4 2h2v8h-2V6zm4-3h2v11h-2V3z"/>
            <circle cx="21" cy="4" r="1" fill="white"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'NVIDIA', 
      logo: (
        <div className="w-8 h-8 bg-[#76B900] rounded flex items-center justify-center">
          <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
            <path d="M12.876 4.455c-1.506-.236-3.04.014-4.423.721-1.686.862-2.934 2.446-3.42 4.344-.486 1.898-.208 3.9.763 5.493.971 1.593 2.546 2.745 4.317 3.162 1.771.417 3.626.088 5.085-.901 1.459-.989 2.451-2.527 2.72-4.218.269-1.691-.179-3.428-1.228-4.764-1.049-1.336-2.616-2.195-4.298-2.358m3.652 7.89c-.189 1.186-.832 2.267-1.764 2.965-.932.698-2.077.961-3.142.721-1.065-.24-2.004-.855-2.577-1.688-.573-.833-.733-1.832-.438-2.741.295-.909.896-1.686 1.648-2.133.752-.447 1.614-.547 2.367-.275.753.272 1.363.829 1.676 1.528.313.699.337 1.463.067 2.098"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Meta', 
      logo: (
        <div className="w-8 h-8 bg-gradient-to-r from-[#0866FF] to-[#00C6FF] rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
      )
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance slider
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % brands.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, brands.length]);

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects - EXACTLY Matching Hero Section */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent"></div>
      
      {/* Professional Grid Pattern - Same as Hero */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Decorative Elements - Same style as Hero */}
      <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400/60 rotate-45 animate-pulse"></div>
      <div className="absolute bottom-40 left-10 w-2 h-2 bg-indigo-400/60 rotate-45 animate-pulse delay-300"></div>
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-300/60 rotate-45 animate-pulse delay-700"></div>
      
      {/* Enhanced Curved Lines - ADDED from Hero Section */}
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Trusted Partnerships</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of companies worldwide who trust our financial solutions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>

        {/* Enhanced Brand Slider */}
        <div 
          className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Gradient Overlays for smooth fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900/80 to-transparent z-10 pointer-events-none"></div>

          {/* Continuous Sliding Animation */}
          <div className="flex items-center">
            <div 
              className="flex space-x-16 animate-infinite-scroll"
              style={{
                animationPlayState: isHovered ? 'paused' : 'running'
              }}
            >
              {/* Triple the brands for seamless infinite scroll */}
              {[...brands, ...brands, ...brands].map((brand, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center min-w-[280px] h-20 group"
                >
                  <div className="relative flex items-center gap-4">
                    {/* Brand Logo */}
                    <div className="transform group-hover:scale-110 transition-transform duration-500">
                      {brand.logo}
                    </div>
                    
                    {/* Brand Name */}
                    <div className="text-2xl md:text-3xl font-bold text-gray-400 group-hover:text-white transition-all duration-500 cursor-pointer tracking-tight">
                      {brand.name}
                    </div>
                    
                    {/* Hover effect underline - Same gradient as Hero */}
                    <div className="absolute -bottom-2 left-12 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }
        
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default BrandSlider;