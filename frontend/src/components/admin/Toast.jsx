// frontend/src/components/admin/Toast.jsx

import React from 'react';

const Toast = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '12px 24px',
        borderRadius: '8px',
        background: type === 'success' ? '#05620C' : '#FF883E',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 2000,
        fontSize: '14px',
        fontWeight: '500',
      }}
    >
      {message}
    </div>
  );
};

export default Toast;