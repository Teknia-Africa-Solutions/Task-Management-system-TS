// frontend/src/pages/Admin/Tasks.jsx

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

const Tasks = ({
  isMobile,
  searchTerm,
  onCreate,
  onDelete,
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskFilter, setTaskFilter] = useState({ status: 'all', priority: 'all' });

  useEffect(() => {
    adminApi
      .getTasks()
      .then((data) => {
        setTasks(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load tasks:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.project_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = taskFilter.status === 'all' || t.status === taskFilter.status;
    const matchesPriority = taskFilter.priority === 'all' || t.priority === taskFilter.priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
        <p>Loading tasks...</p>
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
            padding: '8px 14px',
            flex: '1',
            minWidth: isMobile ? '100%' : '200px',
          }}
        >
          <span style={{ color: '#6B7280', fontSize: '16px', fontWeight: '400' }}>⌕</span>
          <input
            type="text"
            placeholder="Search tasks..."
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: '14px',
              background: 'transparent',
              color: '#1F2937',
            }}
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
            fontSize: '14px',
            width: isMobile ? '100%' : 'auto',
          }}
          value={taskFilter.status}
          onChange={(e) => setTaskFilter({ ...taskFilter, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Done">Done</option>
        </select>
        <select
          style={{
            padding: '8px 14px',
            border: '1px solid #E8F4E9',
            borderRadius: '8px',
            background: 'white',
            color: '#1F2937',
            fontSize: '14px',
            width: isMobile ? '100%' : 'auto',
          }}
          value={taskFilter.priority}
          onChange={(e) => setTaskFilter({ ...taskFilter, priority: e.target.value })}
        >
          <option value="all">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          onClick={onCreate}
          style={{
            padding: '8px 24px',
            background: '#05620C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '14px',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          Create Task
        </button>
      </div>

      {/* Tasks Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #E8F4E9',
        }}
      >
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E8F4E9', background: '#F8FAF8' }}>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Task</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assignee</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #E8F4E9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px', margin: 0 }}>{t.title}</p>
                      <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>{t.description}</p>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {t.project_name || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {t.assignee_name || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background:
                            t.priority === 'High'
                              ? '#FEE2E2'
                              : t.priority === 'Medium'
                              ? '#FEF3C7'
                              : '#E8F4E9',
                          color:
                            t.priority === 'High'
                              ? '#EF4444'
                              : t.priority === 'Medium'
                              ? '#92400E'
                              : '#05620C',
                        }}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background:
                            t.status === 'Done'
                              ? '#D1FAE5'
                              : t.status === 'In Progress'
                              ? '#DBEAFE'
                              : t.status === 'Review'
                              ? '#FEF3C7'
                              : '#F3F4F6',
                          color:
                            t.status === 'Done'
                              ? '#05620C'
                              : t.status === 'In Progress'
                              ? '#1E40AF'
                              : t.status === 'Review'
                              ? '#92400E'
                              : '#4B5563',
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => onDelete(t.id)}
                        style={{
                          padding: '4px 8px',
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
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    </div>
  );
};

export default Tasks;