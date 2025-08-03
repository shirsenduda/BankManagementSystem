import { Mail, Phone, MapPin, Clock, Send, ArrowRight, CheckCircle, Shield, Headphones } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState(null);

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      primary: '+1 (555) 123-4567',
      secondary: 'Mon-Fri 9am-6pm EST',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Mail,
      title: 'Email Us',
      primary: 'support@greenbank.com',
      secondary: 'We reply within 24 hours',
      color: 'from-teal-500 to-emerald-600'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      primary: '123 Financial District',
      secondary: 'New York, NY 10004',
      color: 'from-emerald-600 to-green-500'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      primary: 'Mon-Fri: 9am-6pm',
      secondary: 'Sat-Sun: 10am-4pm',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Communication',
      description: 'All communications are encrypted and secure'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance'
    },
    {
      icon: CheckCircle,
      title: 'Quick Response',
      description: 'Average response time under 2 hours'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section className="min-h-screen py-24 relative overflow-hidden bg-slate-900">
      {/* Background Effects - Matching PersonalizedCardSection */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Decorative Elements - Matching emerald theme */}
      <div className="absolute top-12 left-12 w-3 h-3 bg-emerald-400/80 rotate-45 animate-pulse shadow-lg shadow-emerald-400/20"></div>
      <div className="absolute bottom-24 right-24 w-2 h-2 bg-emerald-500/80 rotate-45 animate-pulse delay-300 shadow-lg shadow-emerald-500/20"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-emerald-300/60 rotate-45 animate-pulse delay-700"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Get In Touch</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Contact{' '}
            <span className="text-emerald-400">
              GreenBank
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 font-light">
            Have questions or need assistance? Our dedicated team is here to help you with all your banking needs.
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
              
              {/* Icon */}
              <div className="relative mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                  <info.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Floating particles */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400/60 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-300 transition-colors duration-300">
                {info.title}
              </h3>
              
              <p className="text-gray-300 font-medium mb-1 group-hover:text-gray-200 transition-colors duration-300">
                {info.primary}
              </p>
              
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                {info.secondary}
              </p>

              {/* Enhanced Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform -skew-x-12 group-hover:animate-shimmer rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      focusedField === 'name' ? 'border-emerald-500/50 bg-white/10' : 'border-white/20'
                    }`}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      focusedField === 'email' ? 'border-emerald-500/50 bg-white/10' : 'border-white/20'
                    }`}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      focusedField === 'phone' ? 'border-emerald-500/50 bg-white/10' : 'border-white/20'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      focusedField === 'subject' ? 'border-emerald-500/50 bg-white/10' : 'border-white/20'
                    }`}
                    placeholder="How can we help?"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={5}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none ${
                    focusedField === 'message' ? 'border-emerald-500/50 bg-white/10' : 'border-white/20'
                  }`}
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="group w-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-3"
              >
                <Send size={20} />
                Send Message
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            </form>
          </div>

          {/* Features & Additional Info */}
          <div className="space-y-8">
            {/* Why Contact Us */}
            <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Why Contact Us?</h3>
              
              <div className="space-y-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  const colors = [
                    'from-emerald-500 to-teal-500',
                    'from-teal-500 to-emerald-600', 
                    'from-emerald-600 to-green-500'
                  ];
                  
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colors[index]} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                        <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="relative bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-sm p-8 rounded-2xl border border-red-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Emergency Support</h3>
              </div>
              
              <p className="text-gray-300 mb-4">
                For urgent banking issues or fraud reporting, contact our 24/7 emergency line:
              </p>
              
              <div className="text-2xl font-bold text-white mb-2">1-800-EMERGENCY</div>
              <div className="text-red-400 text-sm font-medium">Available 24/7/365</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 md:p-16 overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                Need Quick Answers?
              </h3>
              
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                Check out our comprehensive FAQ section for instant answers to common questions about our services.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-3">
                  Visit FAQ
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
                
                <button className="px-8 py-4 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300 hover:bg-white/5">
                  Live Chat
                </button>
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

export default Contact;