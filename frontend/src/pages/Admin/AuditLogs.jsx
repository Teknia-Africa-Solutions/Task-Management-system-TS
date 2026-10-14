// frontend/src/pages/Admin/AuditLogs.jsx

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

const AuditLogs = ({ isMobile, searchTerm }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getAuditLogs()
      .then((data) => {
        setLogs(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load audit logs:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter((log) => {
    const searchLower = (searchTerm || '').toLowerCase();
    return (
      (log.user_name || '').toLowerCase().includes(searchLower) ||
      (log.action || '').toLowerCase().includes(searchLower) ||
      (log.description || '').toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
        <p>Loading audit logs...</p>
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
      {filteredLogs.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center',
            color: '#6B7280',
            border: '1px solid #E8F4E9',
          }}
        >
          <p>No audit logs yet.</p>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
            Activity will appear here when users interact with tasks.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #E8F4E9',
          }}
        >
          <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
            <table style={{ width: '100%', minWidth: '750px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E8F4E9', background: '#F8FAF8' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Task</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #E8F4E9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1F2937', fontSize: '13px' }}>
                      {log.user_name || 'System'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{log.action}</td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>
                      {log.task_title || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>
                      {log.description || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;