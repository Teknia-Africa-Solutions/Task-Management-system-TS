// frontend/src/pages/Admin/Teams.jsx

import React from 'react';
import { getStatusBadge } from '../../utils/badges';

const Teams = ({
  teams,
  stats,
  searchTerm,
  selectedTeam,
  setSelectedTeam,
  onCreate,
  onDelete,
}) => {
  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '16px 24px 24px 24px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Total Teams</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.totalTeams}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Active Teams</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.activeTeams}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Total Members</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.totalMembers}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Avg Workload</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.avgWorkload}%</p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #E8F4E9', borderRadius: '8px', padding: '8px 14px', flex: '1', minWidth: '200px' }}>
          <span style={{ color: '#6B7280', fontSize: '14px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search teams..."
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '13px', background: 'transparent', color: '#1F2937' }}
            value={searchTerm}
            readOnly
          />
        </div>
        <button
          onClick={onCreate}
          style={{ padding: '8px 20px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}
        >
          + Create Team
        </button>
      </div>

      {/* Team Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredTeams.map((team) => (
          <div key={team.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>{team.name}</h4>
              <span className={getStatusBadge(team.status)}>{team.status}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>{team.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#6B7280' }}>
              <div><span style={{ fontWeight: '500', color: '#1F2937' }}>Manager:</span> {team.manager}</div>
              <div><span style={{ fontWeight: '500', color: '#1F2937' }}>Members:</span> {team.members.length}</div>
              <div><span style={{ fontWeight: '500', color: '#1F2937' }}>Active Tasks:</span> {team.activeTasks}</div>
              <div><span style={{ fontWeight: '500', color: '#1F2937' }}>Completed:</span> {team.completedTasks}</div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#6B7280' }}>Workload</span>
                <span style={{ fontWeight: '600', color: team.workload > 70 ? '#F59E0B' : '#05620C' }}>{team.workload}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#E8F4E9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${team.workload}%`, height: '100%', backgroundColor: team.workload > 70 ? '#F59E0B' : '#05620C', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => setSelectedTeam(team)}
                style={{ padding: '6px 16px', background: '#05620C', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
              >
                View Details
              </button>
              <button
                onClick={() => onDelete(team.id)}
                style={{ padding: '6px 16px', background: 'transparent', border: '1px solid #E8F4E9', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#EF4444' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', margin: 0 }}>{selectedTeam.name}</h3>
              <button onClick={() => setSelectedTeam(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p><strong>Description:</strong> {selectedTeam.description}</p>
              <p><strong>Manager:</strong> {selectedTeam.manager}</p>
              <p><strong>Members:</strong> {selectedTeam.members.length}</p>
              <p><strong>Active Tasks:</strong> {selectedTeam.activeTasks}</p>
              <p><strong>Completed Tasks:</strong> {selectedTeam.completedTasks}</p>
              <p><strong>Workload:</strong> {selectedTeam.workload}%</p>
              <p><strong>Status:</strong> {selectedTeam.status}</p>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedTeam(null)} style={{ padding: '8px 20px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;