// frontend/src/components/admin/AdminHeader.jsx

import React from 'react';

const AdminHeader = ({
  activeTab,
  searchTerm,
  setSearchTerm,
  unreadCount,
  onProfileClick,
  onMenuToggle,
  isMobile,
}) => {
  return (
    <header
      style={{
        background: 'white',
        borderBottom: '1px solid #E8F4E9',
        padding: isMobile ? '12px 16px' : '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        gap: '8px',
      }}
    >
      {/* LEFT SIDE - Hamburger + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
        {/* HAMBURGER */}
        <button
          onClick={onMenuToggle}
          style={{
            display: isMobile ? 'flex' : 'none',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#1F2937',
            padding: '4px 8px',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ☰
        </button>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: '700',
              color: '#05620C',
              textTransform: 'capitalize',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {activeTab === 'dashboard' ? 'Admin Dashboard' : activeTab}
          </h1>
          {!isMobile && (
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Hello Admin, Here's your organization overview.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - Search, Notification, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px', flexShrink: 0 }}>
        {/* SEARCH - hidden on mobile */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F8FAF8',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #E8F4E9',
            }}
          >
            <span style={{ color: '#6B7280', fontSize: '16px', fontWeight: '400' }}>⌕</span>
            <input
              type="text"
              placeholder="Search..."
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '13px',
                color: '#1F2937',
                width: '160px',
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* BELL */}
        <button
          style={{
            position: 'relative',
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1F2937"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#FF883E',
              }}
            ></span>
          )}
        </button>

        {/* PROFILE */}
        <button
          onClick={onProfileClick}
          style={{
            width: isMobile ? '32px' : '36px',
            height: isMobile ? '32px' : '36px',
            borderRadius: '50%',
            backgroundColor: '#05620C',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: isMobile ? '12px' : '14px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          A
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;