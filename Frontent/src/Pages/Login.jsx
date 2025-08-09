import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Shield, CheckCircle, Star, MapPin, CreditCard, Briefcase, DollarSign, Users } from 'lucide-react';
import { AppContext } from '../Context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, loading, error, clearError } = useContext(AppContext);
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    
    // Address Information
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    
    // Identification
    idType: 'Passport',
    idNumber: '',
    
    // Employment
    occupation: '',
    monthlyIncome: '',
    
    // Nominee Information
    nomineeName: '',
    nomineeRelation: '',
    nomineePhone: '',
    
    // Security
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Custom Green Logo Component
  const GreenBankLogo = ({ size = 48 }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className="hover:scale-105 transition-transform duration-300"
    >
      <rect 
        x="8" 
        y="8" 
        width="68" 
        height="68" 
        rx="12" 
        ry="12" 
        fill="#10B981"
        className="drop-shadow-lg"
      />
      <rect 
        x="24" 
        y="24" 
        width="68" 
        height="68" 
        rx="12" 
        ry="12" 
        fill="#14B8A6"
        className="drop-shadow-md"
      />
      <rect 
        x="40" 
        y="40" 
        width="36" 
        height="36" 
        rx="6" 
        ry="6" 
        fill="transparent"
        stroke="#1F2937"
        strokeWidth="3"
      />
      <rect 
        x="12" 
        y="12" 
        width="60" 
        height="4" 
        rx="2" 
        fill="#059669"
        opacity="0.8"
      />
      <rect 
        x="28" 
        y="28" 
        width="60" 
        height="4" 
        rx="2" 
        fill="#0D9488"
        opacity="0.8"
      />
    </svg>
  );

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    clearError();
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    clearError();
  };

  const validateLoginForm = () => {
    const errors = {};
    if (!loginData.email) errors.email = 'Email is required';
    if (!loginData.password) errors.password = 'Password is required';
    return errors;
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!signupData.firstName) errors.firstName = 'First name is required';
      if (!signupData.lastName) errors.lastName = 'Last name is required';
      if (!signupData.email) errors.email = 'Email is required';
      if (!signupData.phone) errors.phone = 'Phone number is required';
      if (!signupData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
      if (!signupData.gender) errors.gender = 'Gender is required';
    }
    
    if (step === 2) {
      if (!signupData.addressLine1) errors.addressLine1 = 'Address line 1 is required';
      if (!signupData.city) errors.city = 'City is required';
      if (!signupData.state) errors.state = 'State is required';
      if (!signupData.postalCode) errors.postalCode = 'Postal code is required';
      if (!signupData.idType) errors.idType = 'ID type is required';
      if (!signupData.idNumber) errors.idNumber = 'ID number is required';
    }
    
    if (step === 3) {
      if (!signupData.occupation) errors.occupation = 'Occupation is required';
      if (!signupData.monthlyIncome) errors.monthlyIncome = 'Monthly income is required';
    }
    
    if (step === 4) {
      if (!signupData.nomineeName) errors.nomineeName = 'Nominee name is required';
      if (!signupData.nomineeRelation) errors.nomineeRelation = 'Nominee relation is required';
      if (!signupData.nomineePhone) errors.nomineePhone = 'Nominee phone is required';
      if (!signupData.password) errors.password = 'Password is required';
      if (signupData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (signupData.password !== signupData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (!signupData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms';
    }
    
    return errors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateLoginForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const result = await login(loginData);
    if (result.success) {
      navigate('/');
    }
  };

  const handleNextStep = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setValidationErrors({});
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateStep(4);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Transform data to match backend expectations
    const backendData = {
      name: `${signupData.firstName} ${signupData.lastName}`,
      email: signupData.email,
      password: signupData.password,
      phone: signupData.phone,
      dateOfBirth: signupData.dateOfBirth,
      gender: signupData.gender,
      address: {
        line1: signupData.addressLine1,
        line2: signupData.addressLine2
      },
      city: signupData.city,
      state: signupData.state,
      postalCode: signupData.postalCode,
      idType: signupData.idType,
      idNumber: signupData.idNumber,
      occupation: signupData.occupation,
      monthlyIncome: parseFloat(signupData.monthlyIncome),
      nomineeName: signupData.nomineeName,
      nomineeRelation: signupData.nomineeRelation,
      nomineePhone: signupData.nomineePhone
    };
    
    const result = await register(backendData);
    if (result.success) {
      navigate('/');
    }
  };

  const features = [
    { icon: Shield, text: 'Bank-Grade Security' },
    { icon: CheckCircle, text: 'FDIC Insured' },
    { icon: Star, text: 'Award Winning Service' }
  ];

  const stepTitles = [
    'Personal Information',
    'Address & Identification',
    'Employment Information',
    'Nominee & Security'
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-emerald-600' : 'bg-gray-600'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="firstName"
              value={signupData.firstName}
              onChange={handleSignupChange}
              className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                validationErrors.firstName ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="First name"
            />
          </div>
          {validationErrors.firstName && <p className="text-red-400 text-xs mt-1">{validationErrors.firstName}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="lastName"
              value={signupData.lastName}
              onChange={handleSignupChange}
              className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                validationErrors.lastName ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="Last name"
            />
          </div>
          {validationErrors.lastName && <p className="text-red-400 text-xs mt-1">{validationErrors.lastName}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                validationErrors.email ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="Enter your email"
            />
          </div>
          {validationErrors.email && <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              name="phone"
              value={signupData.phone}
              onChange={handleSignupChange}
              className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                validationErrors.phone ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          {validationErrors.phone && <p className="text-red-400 text-xs mt-1">{validationErrors.phone}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={signupData.dateOfBirth}
            onChange={handleSignupChange}
            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              validationErrors.dateOfBirth ? 'border-red-500/50' : 'border-white/20'
            }`}
          />
          {validationErrors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{validationErrors.dateOfBirth}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
          <select
            name="gender"
            value={signupData.gender}
            onChange={handleSignupChange}
            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              validationErrors.gender ? 'border-red-500/50' : 'border-white/20'
            }`}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {validationErrors.gender && <p className="text-red-400 text-xs mt-1">{validationErrors.gender}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">Address Line 1</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            name="addressLine1"
            value={signupData.addressLine1}
            onChange={handleSignupChange}
            className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              validationErrors.addressLine1 ? 'border-red-500/50' : 'border-white/20'
            }`}
            placeholder="Street address"
          />
        </div>
        {validationErrors.addressLine1 && <p className="text-red-400 text-xs mt-1">{validationErrors.addressLine1}</p>}
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">Address Line 2 (Optional)</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            name="addressLine2"
            value={signupData.addressLine2}
            onChange={handleSignupChange}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Apartment, suite, etc."
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
          <input
            type="text"
            name="city"
            value={signupData.city}
            onChange={handleSignupChange}
            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              validationErrors.city ? 'border-red-500/50' : 'border-white/20'
            }`}
            placeholder="City"
          />
          {validationErrors.city && <p className="text-red-400 text-xs mt-1">{validationErrors.city}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
          <input
            type="text"
            name="state"
            value={signupData.state}
            onChange={handleSignupChange}
            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              validationErrors.state ? 'border-red-500/50' : 'border-white/20'
            }`}
            placeholder="State"
          />
          {validationErrors.state && <p className="text-red-400 text-xs mt-1">{validationErrors.state}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={signupData.postalCode}
            onChange={handleSignupChange}
            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              validationErrors.postalCode ? 'border-red-500/50' : 'border-white/20'
            }`}
            placeholder="ZIP/Postal"
          />
          {validationErrors.postalCode && <p className="text-red-400 text-xs mt-1">{validationErrors.postalCode}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">ID Type</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              name="idType"
              value={signupData.idType}
              onChange={handleSignupChange}
              className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                validationErrors.idType ? 'border-red-500/50' : 'border-white/20'
              }`}
            >
              <option value="Passport">Passport</option>
              <option value="Driver License">Driver License</option>
              <option value="National ID">National ID</option>
            </select>
          </div>
          {validationErrors.idType && <p className="text-red-400 text-xs mt-1">{validationErrors.idType}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">ID Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="idNumber"
              value={signupData.idNumber}
              onChange={handleSignupChange}
              className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                validationErrors.idNumber ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="Enter ID number"
            />
          </div>
          {validationErrors.idNumber && <p className="text-red-400 text-xs mt-1">{validationErrors.idNumber}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Occupation</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="occupation"
              value={signupData.occupation}
              onChange={handleSignupChange}
              className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                validationErrors.occupation ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="Your occupation"
            />
          </div>
          {validationErrors.occupation && <p className="text-red-400 text-xs mt-1">{validationErrors.occupation}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Income</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              name="monthlyIncome"
              value={signupData.monthlyIncome}
              onChange={handleSignupChange}
              className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                validationErrors.monthlyIncome ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="5000"
            />
          </div>
          {validationErrors.monthlyIncome && <p className="text-red-400 text-xs mt-1">{validationErrors.monthlyIncome}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Nominee Name</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="nomineeName"
              value={signupData.nomineeName}
              onChange={handleSignupChange}
              className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                validationErrors.nomineeName ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="Nominee full name"
            />
          </div>
          {validationErrors.nomineeName && <p className="text-red-400 text-xs mt-1">{validationErrors.nomineeName}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Relationship</label>
          <input
            type="text"
            name="nomineeRelation"
            value={signupData.nomineeRelation}
            onChange={handleSignupChange}
            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              validationErrors.nomineeRelation ? 'border-red-500/50' : 'border-white/20'
            }`}
            placeholder="e.g., Spouse, Parent, Child"
          />
          {validationErrors.nomineeRelation && <p className="text-red-400 text-xs mt-1">{validationErrors.nomineeRelation}</p>}
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">Nominee Phone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="tel"
            name="nomineePhone"
            value={signupData.nomineePhone}
            onChange={handleSignupChange}
            className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              validationErrors.nomineePhone ? 'border-red-500/50' : 'border-white/20'
            }`}
            placeholder="Nominee phone number"
          />
        </div>
        {validationErrors.nomineePhone && <p className="text-red-400 text-xs mt-1">{validationErrors.nomineePhone}</p>}
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={signupData.password}
            onChange={handleSignupChange}
            className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              validationErrors.password ? 'border-red-500/50' : 'border-white/20'
            }`}
            placeholder="Create a password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {validationErrors.password && <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>}
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={signupData.confirmPassword}
            onChange={handleSignupChange}
            className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              validationErrors.confirmPassword ? 'border-red-500/50' : 'border-white/20'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {validationErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{validationErrors.confirmPassword}</p>}
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={signupData.agreeToTerms}
          onChange={handleSignupChange}
          className={`w-4 h-4 text-emerald-600 bg-white/5 border rounded focus:ring-emerald-500/50 focus:ring-2 mt-1 ${
            validationErrors.agreeToTerms ? 'border-red-500/50' : 'border-white/20'
          }`}
        />
        <label className="ml-3 text-sm text-gray-300">
          I agree to the{' '}
          <button type="button" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
            Terms of Service
          </button>{' '}
          and{' '}
          <button type="button" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
            Privacy Policy
          </button>
        </label>
      </div>
      {validationErrors.agreeToTerms && <p className="text-red-400 text-xs mt-1">{validationErrors.agreeToTerms}</p>}
    </div>
  );

  return (
    <div className="min-h-screen py-24 relative overflow-hidden bg-slate-900">
      {/* Enhanced Background Effects - Matching About Component */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Refined Decorative Elements - Matching About Component */}
      <div className="absolute top-12 left-12 w-3 h-3 bg-emerald-400/80 rotate-45 animate-pulse shadow-lg shadow-emerald-400/20"></div>
      <div className="absolute bottom-24 right-24 w-2 h-2 bg-emerald-500/80 rotate-45 animate-pulse delay-300 shadow-lg shadow-emerald-500/20"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-emerald-300/60 rotate-45 animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <GreenBankLogo size={48} />
                <span className="text-2xl font-bold text-white">GreenBank</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Welcome to Your
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent"> Financial Future</span>
              </h1>
              
              <p className="text-xl text-gray-300 font-light leading-relaxed mb-8">
                Experience secure, innovative banking solutions designed to help you achieve your financial goals with confidence.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 text-gray-300">
                      <IconComponent size={20} className="text-emerald-400" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-8 border-t border-slate-700/50">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
                  2M+
                </div>
                <div className="text-gray-400 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent mb-1">
                  99.9%
                </div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent mb-1">
                  25+
                </div>
                <div className="text-gray-400 text-sm">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
              {/* Form Toggle */}
              <div className="flex bg-white/5 rounded-xl p-1 mb-8">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setCurrentStep(1);
                    setValidationErrors({});
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    isLogin
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setCurrentStep(1);
                    setValidationErrors({});
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    !isLogin
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Login Form */}
              {isLogin ? (
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-300 mb-6">Sign in to your account to continue</p>
                    {error && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          name="email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          onFocus={() => setFocusedField('login-email')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                            focusedField === 'login-email' ? 'border-emerald-500/50 bg-white/10' : validationErrors.email ? 'border-red-500/50' : 'border-white/20'
                          }`}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      {validationErrors.email && (
                        <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          onFocus={() => setFocusedField('login-password')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                            focusedField === 'login-password' ? 'border-emerald-500/50 bg-white/10' : validationErrors.password ? 'border-red-500/50' : 'border-white/20'
                          }`}
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {validationErrors.password && (
                        <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-emerald-600 bg-white/5 border-white/20 rounded focus:ring-emerald-500/50 focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-300">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-3"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                    {!loading && <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />}
                  </button>
                </form>
              ) : (
                // Signup Form
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-300 mb-4">Step {currentStep} of 4: {stepTitles[currentStep - 1]}</p>
                    {error && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                  </div>

                  {/* Step Indicator */}
                  {renderStepIndicator()}

                  <form onSubmit={currentStep === 4 ? handleSignupSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
                    {/* Render Current Step */}
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          Previous
                        </button>
                      )}
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className="group flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-3"
                      >
                        {loading ? 'Processing...' : currentStep === 4 ? 'Create Account' : 'Next'}
                        {!loading && <ArrowRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        />}
                      </button>
                    </div>
                  </form>
                </div>
              )}
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
    </div>
  );
};

export default Login;