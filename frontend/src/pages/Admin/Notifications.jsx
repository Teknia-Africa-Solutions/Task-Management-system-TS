// frontend/src/pages/Admin/Notifications.jsx

import React from 'react';

const Notifications = ({
  notifications,
  notificationFilter,
  setNotificationFilter,
  onMarkAllRead,
  onMarkRead,
  onDelete,
}) => {
  const getFilteredNotifications = () => {
    if (notificationFilter === 'all') return notifications;
    if (notificationFilter === 'unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === notificationFilter);
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'user':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case 'project':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF883E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        );
      case 'task':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case 'file':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
      case 'security':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      case 'system':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
    }
  };

  return (
    <div style={{ padding: '16px 24px 24px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
          {unreadCount} unread
        </span>
        <button
          onClick={onMarkAllRead}
          style={{
            padding: '6px 16px',
            background: 'transparent',
            border: '1px solid #E8F4E9',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#05620C',
            fontWeight: '500',
          }}
        >
          Mark All Read
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {['All', 'Unread', 'User', 'Project', 'Task', 'File', 'Security', 'System'].map((filter) => (
          <button
            key={filter}
            onClick={() => setNotificationFilter(filter.toLowerCase())}
            style={{
              padding: '6px 18px',
              borderRadius: '20px',
              border: notificationFilter === filter.toLowerCase() ? 'none' : '1px solid #E8F4E9',
              background: notificationFilter === filter.toLowerCase() ? '#05620C' : 'white',
              color: notificationFilter === filter.toLowerCase() ? 'white' : '#1F2937',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: notificationFilter === filter.toLowerCase() ? '600' : '400',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              background: n.read ? 'white' : '#E8F4E9',
              borderRadius: '10px',
              border: '1px solid #E8F4E9',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: n.read ? '#F8FAF8' : '#E8F4E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid #E8F4E9',
              }}
            >
              {getIcon(n.type)}
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#1F2937', margin: 0 }}>{n.title}</p>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0' }}>{n.description}</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>
                {new Date(n.timestamp).toLocaleString()}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {!n.read && (
                <button
                  onClick={() => onMarkRead(n.id)}
                  style={{
                    padding: '6px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    background: '#05620C',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  Mark Read
                </button>
              )}
              <button
                onClick={() => onDelete(n.id)}
                style={{
                  padding: '4px 6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#1F2937',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Delete"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;