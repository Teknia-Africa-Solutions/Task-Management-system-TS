// frontend/src/pages/Admin/AuditLogs.jsx

import React from 'react';

const AuditLogs = ({ searchTerm }) => {
  const auditLogs = [
    { user: 'Nova Admin', action: 'Logged In', resource: 'System', description: 'User logged in successfully', date: '5/21/2026', time: '10:30:00', status: 'Success' },
    { user: 'Jane Doe', action: 'Created Project', resource: 'Project', description: 'Created project "Alpha"', date: '5/21/2026', time: '09:15:00', status: 'Success' },
    { user: 'Mike Johnson', action: 'Assigned Task', resource: 'Task', description: 'Assigned task "API Integration" to Emily', date: '5/21/2026', time: '08:00:00', status: 'Success' },
    { user: 'Unknown', action: 'Failed Login', resource: 'Authentication', description: 'Failed login attempt for user@example.com', date: '5/21/2026', time: '07:30:00', status: 'Failed' },
    { user: 'Nova Admin', action: 'Changed Role', resource: 'User', description: 'Changed role of David from User to Admin', date: '5/20/2026', time: '18:00:00', status: 'Success' },
    { user: 'Sarah Wilson', action: 'Uploaded File', resource: 'File', description: 'Uploaded file "QA_Report.xlsx"', date: '5/20/2026', time: '16:45:00', status: 'Success' },
    { user: 'David Brown', action: 'Deleted Task', resource: 'Task', description: 'Deleted task "Old Task #42"', date: '5/20/2026', time: '14:20:00', status: 'Success' },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const searchLower = (searchTerm || '').toLowerCase();
    return (
      log.user.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.resource.toLowerCase().includes(searchLower) ||
      log.description.toLowerCase().includes(searchLower) ||
      log.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div style={{ padding: '16px 24px 24px 24px' }}>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8F4E9' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E8F4E9', background: '#F8FAF8' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resource</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #E8F4E9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1F2937', fontSize: '13px' }}>{log.user}</td>
                  <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{log.action}</td>
                  <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{log.resource}</td>
                  <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{log.description}</td>
                  <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{log.date}</td>
                  <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{log.time}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: log.status === 'Success' ? '#E8F4E9' : '#FEE2E2',
                        color: log.status === 'Success' ? '#05620C' : '#EF4444',
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;