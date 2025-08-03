import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, Edit3, Camera, Save, X, Lock, Mail, Phone, MapPin, Briefcase, DollarSign, Users, CreditCard, Shield, CheckCircle } from 'lucide-react';

const Profile = () => {
  const {
    userData,
    updateUserProfile,
    uploadProfileImage,
    changePassword,
    loading,
    currencySymbol
  } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    city: userData?.city || '',
    state: userData?.state || '',
    postalCode: userData?.postalCode || '',
    occupation: userData?.occupation || '',
    monthlyIncome: userData?.monthlyIncome || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      await uploadProfileImage(file);
    }
  };

  const handleSaveProfile = async () => {
    const result = await updateUserProfile(profileData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });

    if (result.success) {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Profile Image */}
            <div className="relative group flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-600 shadow-lg bg-gray-700">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 border-2 border-gray-800 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                disabled={loading}
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
                {/* <div className="flex items-center gap-2">
                  {userData.status === 'Active' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  )}
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    userData.status === 'Active' 
                      ? 'bg-green-900/30 text-green-400 border border-green-800' 
                      : 'bg-red-900/30 text-red-400 border border-red-800'
                  }`}>
                    {userData.status}
                  </span>
                </div> */}
              </div>
              
              <div className="text-gray-300 mb-6">
                <p className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  {userData.email}
                </p>
                <p className="text-sm text-gray-400">Account: {userData.accountNumber} • {userData.accountType}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          name: userData?.name || '',
                          phone: userData?.phone || '',
                          address: userData?.address || '',
                          city: userData?.city || '',
                          state: userData?.state || '',
                          postalCode: userData?.postalCode || '',
                          occupation: userData?.occupation || '',
                          monthlyIncome: userData?.monthlyIncome || ''
                        });
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="xl:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <p className="text-white font-medium">{userData.name}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <div className="flex items-center gap-2 text-white">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{userData.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <div className="flex items-start gap-2 text-white">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span>{userData.address || 'Not provided'}</span>
                      </div>
                    </div>
                  )}
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <p className="text-white">{userData.city}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={profileData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <p className="text-white">{userData.state}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="postalCode"
                      value={profileData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <p className="text-white">{userData.postalCode}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Professional Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Occupation</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="occupation"
                      value={profileData.occupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <p className="text-white">{userData.occupation}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Income</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="monthlyIncome"
                      value={profileData.monthlyIncome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <div className="flex items-center gap-2 text-white">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-semibold">{formatCurrency(userData.monthlyIncome)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Account Information */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Account Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">ACCOUNT NUMBER</label>
                  <p className="text-white font-mono text-lg">{userData.accountNumber}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">ACCOUNT TYPE</label>
                  <p className="text-white font-medium">{userData.accountType}</p>
                </div>
                
                <hr className="border-gray-600" />
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">ID TYPE</label>
                  <p className="text-white">{userData.idType}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">ID NUMBER</label>
                  <p className="text-white font-mono">{userData.idNumber}</p>
                </div>

                {userData.initialDeposit && (
                  <>
                    <hr className="border-gray-600" />
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">INITIAL DEPOSIT</label>
                      <p className="text-green-400 font-semibold text-lg">{formatCurrency(userData.initialDeposit)}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Nominee Information */}
            {(userData.nomineeName || userData.nomineeRelation || userData.nomineePhone) && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Nominee Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">NOMINEE NAME</label>
                    <p className="text-white font-medium">{userData.nomineeName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">RELATION</label>
                    <p className="text-white">{userData.nomineeRelation}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">PHONE NUMBER</label>
                    <p className="text-white font-mono">{userData.nomineePhone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Modal */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Change Password
                </h3>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;