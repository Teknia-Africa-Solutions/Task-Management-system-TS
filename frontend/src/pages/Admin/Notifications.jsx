// frontend/src/pages/Admin/Notifications.jsx

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

const Notifications = ({ isMobile }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationFilter, setNotificationFilter] = useState('all');

  useEffect(() => {
    adminApi
      .getNotifications()
      .then((data) => {
        setNotifications(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load notifications:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (notificationFilter === 'all') return true;
    if (notificationFilter === 'unread') return !n.is_read;
    return n.type === notificationFilter;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#EF4444' }}>
        <p><strong>Error:</strong> {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '12px' : '16px 24px 24px 24px', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
          {unreadCount} unread
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {['All', 'Unread', 'Task', 'Project', 'Deadline', 'Alert'].map((filter) => (
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

      {filteredNotifications.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#6B7280', border: '1px solid #E8F4E9' }}>
          <p>No notifications found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: '16px',
                padding: '16px 20px',
                background: n.is_read ? 'white' : '#E8F4E9',
                borderRadius: '10px',
                border: '1px solid #E8F4E9',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: n.is_read ? '#F8FAF8' : '#E8F4E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #E8F4E9',
                  fontSize: '20px',
                }}
              >
                {n.type === 'task' && '📋'}
                {n.type === 'project' && '📁'}
                {n.type === 'deadline' && '⏰'}
                {n.type === 'alert' && '⚠️'}
                {n.type === 'message' && '💬'}
                {!['task', 'project', 'deadline', 'alert', 'message'].includes(n.type) && '🔔'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#1F2937', margin: 0 }}>{n.title}</p>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0' }}>{n.message}</p>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>

              {!n.is_read && (
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: '#05620C',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;