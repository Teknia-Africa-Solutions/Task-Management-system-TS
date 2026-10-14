// frontend/src/pages/Admin/Tasks.jsx

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

const Tasks = ({ isMobile, searchTerm, onCreate, onDelete }) => {
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

  const getPriorityStyle = (priority) => {
    if (priority === 'High') return { background: '#FEE2E2', color: '#EF4444' };
    if (priority === 'Medium') return { background: '#FEF3C7', color: '#92400E' };
    return { background: '#E8F4E9', color: '#05620C' };
  };

  const getStatusStyle = (status) => {
    if (status === 'Done') return { background: '#D1FAE5', color: '#05620C' };
    if (status === 'In Progress') return { background: '#DBEAFE', color: '#1E40AF' };
    if (status === 'Review') return { background: '#FEF3C7', color: '#92400E' };
    return { background: '#F3F4F6', color: '#4B5563' };
  };

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
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', background: 'transparent', color: '#1F2937' }}
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

      {/* MOBILE: Card layout */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#6B7280', border: '1px solid #E8F4E9' }}>
              <p>No tasks found.</p>
            </div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #E8F4E9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                {/* Header: Title + Description */}
                <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                    {t.title}
                  </p>
                  {t.description && (
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                      {t.description}
                    </p>
                  )}
                </div>

                {/* Details: Label + Value rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Project</span>
                    <span style={{ fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>
                      {t.project_name || '—'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Assignee</span>
                    <span style={{ fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>
                      {t.assignee_name || '—'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Priority</span>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        ...getPriorityStyle(t.priority),
                      }}
                    >
                      {t.priority}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Status</span>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        ...getStatusStyle(t.status),
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Due Date</span>
                    <span style={{ fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>
                      {t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                  <button
                    onClick={() => onDelete(t.id)}
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
                    Delete Task
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
                            ...getPriorityStyle(t.priority),
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
                            ...getStatusStyle(t.status),
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
      )}
    </div>
  );
};

export default Tasks;