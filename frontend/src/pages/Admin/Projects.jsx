// frontend/src/pages/Admin/Projects.jsx

import React from 'react';
import { getStatusBadge } from '../../utils/badges';

const Projects = ({ projects, searchTerm, onCreate, onDelete }) => {
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            border: '1px solid #E8F4E9',
            borderRadius: '8px',
            padding: '8px 12px',
            flex: '1',
            minWidth: '200px',
          }}
        >
          <span style={{ color: '#6B7280', fontSize: '16px', fontWeight: '400' }}>⌕</span>
          <input
            type="text"
            placeholder="Search projects..."
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: '13px',
              background: 'transparent',
              color: '#1F2937',
            }}
            value={searchTerm}
            readOnly
          />
        </div>
        <button
          onClick={onCreate}
          style={{
            padding: '8px 20px',
            background: '#05620C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          Create Project
        </button>
      </div>

      {/* Project Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E8F4E9',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                {p.name}
              </h4>
              <span className={getStatusBadge(p.status)}>{p.status}</span>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{p.description}</p>
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#6B7280' }}>Progress</span>
                <span style={{ fontWeight: '600', color: '#05620C' }}>{p.progress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#E8F4E9', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${p.progress}%`,
                    height: '100%',
                    backgroundColor: p.progress < 50 ? '#F59E0B' : '#05620C',
                    borderRadius: '4px',
                  }}
                ></div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: '#6B7280' }}>
              <span>
                {p.tasks.completed}/{p.tasks.total} tasks
              </span>
              <span>Deadline: {p.deadline}</span>
            </div>
            <button
              onClick={() => onDelete(p.id)}
              style={{
                marginTop: '12px',
                padding: '4px 12px',
                border: '1px solid #E8F4E9',
                borderRadius: '6px',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#EF4444',
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;