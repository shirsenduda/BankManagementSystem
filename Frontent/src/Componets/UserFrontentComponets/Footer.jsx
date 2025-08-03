import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  CreditCard,
  Shield,
  Award,
  ArrowRight,
  ChevronUp
} from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    products: [
      { name: 'Credit Cards', href: '#' },
      { name: 'Personal Banking', href: '#' },
      { name: 'Business Banking', href: '#' },
      { name: 'Investment Services', href: '#' },
      { name: 'Insurance', href: '#' },
      { name: 'Loans & Mortgages', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Center', href: '#' },
      { name: 'Investor Relations', href: '#' },
      { name: 'Sustainability', href: '#' },
      { name: 'Community', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Security Center', href: '#' },
      { name: 'Fraud Protection', href: '#' },
      { name: 'Account Management', href: '#' },
      { name: 'Mobile App', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Accessibility', href: '#' },
      { name: 'Regulatory Info', href: '#' },
      { name: 'FDIC Insurance', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-800 relative overflow-hidden">
      {/* Simplified Background Effects */}
      <div className="absolute inset-0 bg-emerald-600/5"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400/60 rotate-45 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-3 h-3 bg-emerald-500/60 rotate-45 animate-pulse delay-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-slate-700/50">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Stay Updated with{' '}
                <span className="text-emerald-400">
                  Financial Insights
                </span>
              </h3>
              <p className="text-gray-300 text-lg">
                Get the latest updates on credit cards, financial tips, and exclusive offers delivered to your inbox.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                <button className="group bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-2 whitespace-nowrap">
                  Subscribe
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">FinanceHub</span>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                Your trusted financial partner providing innovative credit solutions and personalized banking services. 
                We're committed to helping you achieve your financial goals with security and confidence.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-300">FDIC Insured</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-gray-300">Award Winning</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">1-800-FINANCE (346-2623)</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">support@financehub.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">New York, NY 10001</span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 lg:col-span-4">
              {/* Products */}
              <div>
                <h4 className="text-white font-semibold mb-4">Products</h4>
                <ul className="space-y-3">
                  {footerLinks.products.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-3">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>© 2025 FinanceHub. All rights reserved.</p>
              <p className="mt-1">
                Member FDIC. Equal Housing Lender. 
                <span className="ml-2 text-emerald-400 hover:text-emerald-300 cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 group"
              aria-label="Back to top"
            >
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Additional Trust Section */}
      <div className="bg-slate-800/50 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-xs">
            <span>FDIC Insured up to $250,000</span>
            <span>•</span>
            <span>SOC 2 Type II Certified</span>
            <span>•</span>
            <span>256-bit SSL Encryption</span>
            <span>•</span>
            <span>PCI DSS Compliant</span>
            <span>•</span>
            <span>Equal Housing Lender</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;