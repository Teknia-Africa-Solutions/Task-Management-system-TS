// frontend/src/components/admin/AdminSidebar.jsx

import React from 'react';
import MenuItem from './MenuItem';

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  menuItems,
  isMobile,
  isMobileSidebarOpen,
  onLogout,
}) => {
  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        width: isMobile ? 280 : sidebarOpen ? 260 : 72,
        backgroundColor: '#0B1F0D',
        color: 'white',
        borderRight: '1px solid #0B1F0D',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        transform: isMobile && !isMobileSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        boxShadow: isMobile ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderBottom: '1px solid #0B1F0D',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
        }}
      >
        <img
  src="/tekniafrica-logo-transparent.png"
  alt="Tekniaafrica"
  style={{
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    flexShrink: 0,
  }}
/>
        {sidebarOpen && (
          <div>
            <h1 style={{ fontWeight: '700', fontSize: '14px', color: 'white', margin: 0 }}>TaskFlow</h1>
            <p style={{ fontSize: '10px', color: '#e3e6da', margin: 0 }}>Admin Dashboard</p>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'absolute',
          right: '-12px',
          top: '80px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#96AF25',
          border: '1px solid #034A09',
          color: '#05620C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '10px',
          zIndex: 10,
        }}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
            sidebarOpen={sidebarOpen}
          />
        ))}
      </nav>

      {/* Profile + Logout */}
      <div
        style={{
          borderTop: '1px solid #0B1F0D',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#96AF25',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '14px',
              flexShrink: 0,
              color: '#05620C',
            }}
          >
            A
          </div>
          {sidebarOpen && (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: '500', color: 'white', margin: 0 }}>Admin</p>
              <p style={{ fontSize: '11px', color: '#96AF25', margin: 0 }}>Administrator</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 14px',
            borderRadius: '8px',
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#A3E635',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            transition: 'all 0.2s',
            fontSize: '13px',
            fontWeight: '500',
            marginTop: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;