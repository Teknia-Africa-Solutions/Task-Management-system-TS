// frontend/src/components/admin/MenuItem.jsx

import React from 'react';

const MenuItem = ({ item, isActive, onClick, sidebarOpen }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: '8px',
        width: '100%',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: isActive ? '#96AF25' : 'transparent',
        color: isActive ? '#05620C' : '#E8F4E9',
        justifyContent: sidebarOpen ? 'flex-start' : 'center',
        transition: 'all 0.2s',
        fontSize: '13px',
        fontWeight: isActive ? '600' : '400',
      }}
    >
      <span
        style={{
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: isActive ? '#05620C' : '#E8F4E9',
        }}
      >
        {item.icon}
      </span>
      {sidebarOpen && <span>{item.label}</span>}
    </button>
  );
};

export default MenuItem;