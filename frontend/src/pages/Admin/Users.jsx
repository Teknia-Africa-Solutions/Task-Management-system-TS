// frontend/src/pages/Admin/Users.jsx

import React, { useState, useEffect } from 'react';
import { getStatusBadge } from '../../utils/badges';
import { adminApi } from '../../services/adminApi';

const Users = ({
  isMobile,
  searchTerm,
  onAddUser,
  onDelete,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userFilter, setUserFilter] = useState({ role: 'all' });

  useEffect(() => {
    adminApi
      .getUsers()
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load users:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.length,
    inactiveUsers: 0,
    admins: users.filter((u) => u.role === 'Admin' || u.role === 'SuperAdmin').length,
    managers: users.filter((u) => u.role === 'Admin').length,
  };

  const getAvatar = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userFilter.role === 'all' || u.role === userFilter.role;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#EF4444' }}>
        <p><strong>Error:</strong> {error}</p>
        <p style={{ fontSize: '13px', color: '#6B7280' }}>Make sure you're logged in and the backend is running.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '12px' : '16px 24px 24px 24px', overflowX: 'hidden' }}>
      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(5, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Total Users</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Active</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.activeUsers}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Inactive</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.inactiveUsers}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Admins</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.admins}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Managers</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.managers}</p>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          alignItems: isMobile ? 'stretch' : 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            border: '1px solid #E8F4E9',
            borderRadius: '8px',
            padding: '8px 14px',
            flex: '1',
            minWidth: isMobile ? '100%' : '200px',
          }}
        >
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
          style={{
            padding: '8px 14px',
            border: '1px solid #E8F4E9',
            borderRadius: '8px',
            background: 'white',
            color: '#1F2937',
            fontSize: '13px',
            width: isMobile ? '100%' : 'auto',
          }}
          value={userFilter.role}
          onChange={(e) => setUserFilter({ ...userFilter, role: e.target.value })}
        >
          <option value="all">All Roles</option>
          <option value="SuperAdmin">SuperAdmin</option>
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>
        <button
          onClick={onAddUser}
          style={{
            padding: '8px 20px',
            background: '#05620C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '13px',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          + Add User
        </button>
      </div>

      {/* MOBILE: Card layout */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredUsers.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#6B7280', border: '1px solid #E8F4E9' }}>
              <p>No users found.</p>
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #E8F4E9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                {/* Header: Avatar + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: u.role === 'SuperAdmin' || u.role === 'Admin' ? '#FF883E' : '#05620C',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      flexShrink: 0,
                    }}
                  >
                    {getAvatar(u.name)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#1F2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.email}
                    </p>
                  </div>
                </div>

                {/* Details: Label + Value rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Role</span>
                    <span className={getStatusBadge(u.role)} style={{ fontSize: '11px' }}>{u.role}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Created</span>
                    <span style={{ fontSize: '13px', color: '#1F2937' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                  <button
                    onClick={() => onDelete(u.id)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E8F4E9',
                      borderRadius: '8px',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#EF4444',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Delete User
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* DESKTOP: Table layout (unchanged) */
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #E8F4E9',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
            <table style={{ width: '100%', minWidth: '750px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E8F4E9', background: '#F8FAF8' }}>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Created</th>
                  <th style={{ textAlign: 'center', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #E8F4E9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: u.role === 'SuperAdmin' || u.role === 'Admin' ? '#FF883E' : '#05620C',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '600',
                              flexShrink: 0,
                            }}
                          >
                            {getAvatar(u.name)}
                          </div>
                          <span style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px', whiteSpace: 'nowrap' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px', whiteSpace: 'nowrap' }}>{u.email}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span className={getStatusBadge(u.role)} style={{ fontSize: '11px' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;