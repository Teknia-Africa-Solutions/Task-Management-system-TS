// frontend/src/pages/Admin/Teams.jsx

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

const Teams = ({ isMobile, searchTerm }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getTeams()
      .then((data) => {
        setTeams(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load teams:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTeams = teams.filter((t) =>
    (t.project_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
        <p>Loading teams...</p>
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
      {/* Info banner */}
      <div
        style={{
          background: '#F8FAF8',
          border: '1px solid #E8F4E9',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#6B7280',
        }}
      >
        Teams are project-based. Each project's members are shown below.
      </div>

      {filteredTeams.length === 0 ? (
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
          <p>No teams found.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredTeams.map((team) => (
            <div
              key={team.project_id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #E8F4E9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E8F4E9' }}>
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: team.color || '#05620C',
                    flexShrink: 0,
                  }}
                />
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                  {team.project_name}
                </h4>
                <span
                  style={{
                    marginLeft: 'auto',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    background: '#E8F4E9',
                    color: '#05620C',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Members List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      background: '#F8FAF8',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: member.role === 'SuperAdmin' || member.role === 'Admin' ? '#FF883E' : '#05620C',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        flexShrink: 0,
                      }}
                    >
                      {member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#1F2937', margin: 0 }}>
                        {member.name}
                      </p>
                      <p style={{ fontSize: '11px', color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {member.email}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: '600',
                        background: member.role === 'SuperAdmin' ? '#FEF3C7' : member.role === 'Admin' ? '#DBEAFE' : '#E8F4E9',
                        color: member.role === 'SuperAdmin' ? '#92400E' : member.role === 'Admin' ? '#1E40AF' : '#05620C',
                        flexShrink: 0,
                      }}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;