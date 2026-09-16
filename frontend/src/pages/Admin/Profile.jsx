// frontend/src/pages/Admin/Profile.jsx

import React, { useState } from 'react';

const Profile = ({ onToast }) => {
  // Local state for profile
  const [profileView, setProfileView] = useState('view');
  const [profileData, setProfileData] = useState({
    name: 'Admin',
    email: 'admin@taskflow.io',
    phone: '+1 (555) 000-0000',
    department: 'Management',
  });
  const [tempProfile, setTempProfile] = useState(profileData);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEditClick = () => {
    setTempProfile(profileData);
    setProfileView('edit');
  };

  const handleSaveProfile = () => {
    setProfileData(tempProfile);
    setProfileView('view');
    onToast('Profile updated successfully! ✅');
  };

  const handleCancelEdit = () => {
    setTempProfile(profileData);
    setProfileView('view');
  };

  const handlePasswordClick = () => {
    setProfileView('password');
    setPasswordData({ current: '', new: '', confirm: '' });
    setPasswordError('');
  };

  const handleSavePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setPasswordError('All fields are required');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwordData.new.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    onToast('Password changed successfully! ✅');
    setProfileView('view');
    setPasswordData({ current: '', new: '', confirm: '' });
    setPasswordError('');
  };

  const handleCancelPassword = () => {
    setProfileView('view');
    setPasswordData({ current: '', new: '', confirm: '' });
    setPasswordError('');
  };

  // ----- VIEW MODE -----
  if (profileView === 'view') {
    return (
      <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #E8F4E9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #05620C, #96AF25)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '700', flexShrink: 0 }}>
              {profileData.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', margin: 0 }}>{profileData.name}</h2>
              <p style={{ color: '#6B7280', margin: '4px 0 8px 0' }}>Administrator</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-block', padding: '2px 16px', borderRadius: '12px', background: '#E8F4E9', color: '#05620C', fontSize: '12px', fontWeight: '600' }}>Active</span>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Joined January 2026</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #E8F4E9', paddingTop: '20px' }}>
            <div><p style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</p><p style={{ fontSize: '14px', color: '#1F2937' }}>{profileData.email}</p></div>
            <div><p style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</p><p style={{ fontSize: '14px', color: '#1F2937' }}>Administrator</p></div>
            <div><p style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</p><p style={{ fontSize: '14px', color: '#1F2937' }}>{profileData.department}</p></div>
            <div><p style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Login</p><p style={{ fontSize: '14px', color: '#1F2937' }}>Today, 10:30 AM</p></div>
            <div><p style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</p><p style={{ fontSize: '14px', color: '#1F2937' }}>{profileData.phone}</p></div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E8F4E9', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={handleEditClick} style={{ padding: '8px 24px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Edit Profile</button>
            <button onClick={handlePasswordClick} style={{ padding: '8px 24px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Change Password</button>
          </div>
        </div>
      </div>
    );
  }

  // ----- EDIT MODE -----
  if (profileView === 'edit') {
    return (
      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #E8F4E9' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', marginBottom: '20px' }}>Edit Profile</h2>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Full Name</label>
            <input type="text" value={tempProfile.name} onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: '#F8FAF8', color: '#1F2937', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Email</label>
            <input type="email" value={tempProfile.email} onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: '#F8FAF8', color: '#1F2937', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Phone</label>
            <input type="text" value={tempProfile.phone} onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: '#F8FAF8', color: '#1F2937', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Department</label>
            <input type="text" value={tempProfile.department} onChange={(e) => setTempProfile({ ...tempProfile, department: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: '#F8FAF8', color: '#1F2937', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={handleSaveProfile} style={{ padding: '10px 28px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Save Changes</button>
            <button onClick={handleCancelEdit} style={{ padding: '10px 28px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // ----- PASSWORD MODE -----
  if (profileView === 'password') {
    return (
      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #E8F4E9' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', marginBottom: '20px' }}>Change Password</h2>
          {passwordError && <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>{passwordError}</p>}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Current Password</label>
            <input type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937', outline: 'none' }} placeholder="Enter current password" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937', outline: 'none' }} placeholder="Enter new password" />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }} type="button">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Confirm Password</label>
            <input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937', outline: 'none' }} placeholder="Confirm new password" />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={handleSavePassword} style={{ padding: '10px 28px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Update Password</button>
            <button onClick={handleCancelPassword} style={{ padding: '10px 28px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Profile;