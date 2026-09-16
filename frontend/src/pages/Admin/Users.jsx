// frontend/src/pages/Admin/Users.jsx

import React from 'react';
import { getStatusBadge } from '../../utils/badges';

const Users = ({
  users,
  stats,
  searchTerm,
  userFilter,
  setUserFilter,
  onAddUser,
  onToggleStatus,
  onDelete,
}) => {
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userFilter.role === 'all' || u.role === userFilter.role;
    const matchesStatus = userFilter.status === 'all' || u.status === userFilter.status;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div style={{ padding: '16px 24px 24px 24px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Total Users</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Active</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.activeUsers}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Inactive</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.inactiveUsers}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Admins</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.admins}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Managers</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.managers}</p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #E8F4E9', borderRadius: '8px', padding: '8px 14px', flex: '1', minWidth: '200px' }}>
          <span style={{ color: '#6B7280', fontSize: '16px', fontWeight: '400' }}>⌕</span>
          <input
            type="text"
            placeholder="Search users..."
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '13px', background: 'transparent', color: '#1F2937' }}
            value={searchTerm}
            readOnly
          />
        </div>
        <select
          style={{ padding: '8px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937', fontSize: '13px' }}
          value={userFilter.role}
          onChange={(e) => setUserFilter({ ...userFilter, role: e.target.value })}
        >
          <option value="all">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Project Manager">Project Manager</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="QA">QA</option>
          <option value="DevOps">DevOps</option>
        </select>
        <select
          style={{ padding: '8px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937', fontSize: '13px' }}
          value={userFilter.status}
          onChange={(e) => setUserFilter({ ...userFilter, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          onClick={onAddUser}
          style={{ padding: '8px 20px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}
        >
          + Add User
        </button>
      </div>

      {/* Users Table */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E8F4E9', background: '#F8FAF8' }}>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Team</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Active</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #E8F4E9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: u.role === 'Super Admin' || u.role === 'admin' ? '#FF883E' : '#05620C',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {u.avatar}
                      </div>
                      <span style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={getStatusBadge(u.role)} style={{ fontSize: '11px' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{u.team}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={getStatusBadge(u.status)} style={{ fontSize: '11px' }}>{u.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{u.lastActive}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => onToggleStatus(u.id)}
                      style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: '#6B7280' }}
                      title="Toggle Status"
                    >
                      &#x21BB;
                    </button>
                    <button
                      onClick={() => onDelete(u.id)}
                      style={{ padding: '4px 6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#1F2937', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
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

export default Users;