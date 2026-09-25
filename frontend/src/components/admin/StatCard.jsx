// frontend/src/components/admin/StatCard.jsx

import React from 'react';

const StatCard = ({
  label,
  value,
  subtext,
  icon,
  iconBg = '#E8F4E9',
  iconColor = '#05620C',
  subtextColor = '#05620C',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '10px',
        padding: '16px 14px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s',
        minWidth: 0,                    // ← CHANGED: allow shrinking
        overflow: 'hidden',             // ← CHANGED: prevent content overflow
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <div style={{ minWidth: 0, flex: 1 }}>    {/* ← CHANGED: allow text to shrink */}
          <p
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {label}
          </p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>
            {value}
          </p>
          {subtext && (
            <p
              style={{
                fontSize: '10px',
                color: subtextColor,
                fontWeight: '500',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: iconBg, flexShrink: 0 }}>  {/* ← CHANGED: prevent icon from shrinking */}
            <div style={{ color: iconColor, display: 'flex', alignItems: 'center' }}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;