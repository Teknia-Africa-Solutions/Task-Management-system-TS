// frontend/src/pages/Admin/Projects.jsx

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

const Projects = ({ isMobile, searchTerm, onCreate, onDelete }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getProjects()
      .then((data) => {
        setProjects(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#EF4444' }}>
        <p><strong>Error:</strong> {error}</p>
        <p style={{ fontSize: '13px', color: '#6B7280' }}>
          Make sure you're logged in and the backend is running.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '12px' : '24px', overflowX: 'hidden' }}>
      {/* Controls */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
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
            padding: '8px 12px',
            flex: '1',
            minWidth: isMobile ? '100%' : '200px',
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
            fontSize: '13px',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          Create Project
        </button>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
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
          <p>No projects found.</p>
        </div>
      )}

      {/* Project Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
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
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                {p.name}
              </h4>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: p.color || '#05620C',
                  flexShrink: 0,
                  marginLeft: '8px',
                }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              {p.description || 'No description'}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '12px',
                fontSize: '12px',
                color: '#6B7280',
              }}
            >
              <span>Creator: {p.creator_name || 'Unknown'}</span>
              <span>
                {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
              </span>
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