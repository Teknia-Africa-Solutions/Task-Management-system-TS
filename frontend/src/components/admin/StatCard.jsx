// frontend/src/components/admin/StatCard.jsx

import React from 'react';

/**
 * Reusable stat card for dashboard KPIs
 * @param {string} label - Card label (e.g. "Total Users")
 * @param {string|number} value - Main number displayed
 * @param {string} subtext - Small text below the value
 * @param {ReactNode} icon - SVG icon to display
 * @param {string} iconBg - Background color for icon container (default: #E8F4E9)
 * @param {string} iconColor - Color of the icon stroke (default: #05620C)
 * @param {string} subtextColor - Color of subtext (default: #05620C)
 * @param {Function} onClick - Optional click handler
 */
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
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              margin: 0,
            }}
          >
            {label}
          </p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>
            {value}
          </p>
          {subtext && (
            <p style={{ fontSize: '10px', color: subtextColor, fontWeight: '500', margin: 0 }}>
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: iconBg }}>
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