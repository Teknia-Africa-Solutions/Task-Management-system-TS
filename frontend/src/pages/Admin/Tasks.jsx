// frontend/src/pages/Admin/Tasks.jsx

import React from 'react';

const Tasks = ({
  tasks,
  searchTerm,
  taskFilter,
  setTaskFilter,
  lastSaved,
  isSaving,
  onSave,
  onCreate,
  onUpdateStatus,
  onUpdatePriority,
  onDelete,
}) => {
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = taskFilter.status === 'all' || t.status === taskFilter.status;
    const matchesPriority = taskFilter.priority === 'all' || t.priority === taskFilter.priority;
    const matchesProject = taskFilter.project === 'all' || t.project === taskFilter.project;
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  return (
    <div style={{ padding: '16px 24px 24px 24px' }}>
      {/* Header with Save button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastSaved && (
            <span style={{ fontSize: '13px', color: '#6B7280' }}>Last saved: {lastSaved}</span>
          )}
          <button
            onClick={onSave}
            disabled={isSaving}
            style={{
              padding: '8px 24px',
              background: isSaving ? '#9CA3AF' : '#05620C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #E8F4E9', borderRadius: '8px', padding: '8px 14px', flex: '1', minWidth: '200px' }}>
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
          style={{ padding: '8px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937', fontSize: '14px' }}
          value={taskFilter.status}
          onChange={(e) => setTaskFilter({ ...taskFilter, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Blocked">Blocked</option>
          <option value="Overdue">Overdue</option>
        </select>
        <select
          style={{ padding: '8px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937', fontSize: '14px' }}
          value={taskFilter.priority}
          onChange={(e) => setTaskFilter({ ...taskFilter, priority: e.target.value })}
        >
          <option value="all">All Priority</option>
          <option value="Critical">Critical</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          onClick={onCreate}
          style={{ padding: '8px 24px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '14px' }}
        >
          Create Task
        </button>
      </div>

      {/* Tasks Table */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8F4E9' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
              {filteredTasks.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #E8F4E9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px', margin: 0 }}>{t.title}</p>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>{t.description}</p>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: '14px' }}>{t.project}</td>
                  <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: '14px' }}>{t.assignee}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={t.priority}
                      onChange={(e) => onUpdatePriority(t.id, e.target.value)}
                      style={{ padding: '6px 10px', border: '1px solid #E8F4E9', borderRadius: '6px', fontSize: '13px', background: 'white', color: '#1F2937', cursor: 'pointer', fontWeight: '500', minWidth: '90px' }}
                    >
                      <option value="Critical">Critical</option>
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={t.status}
                      onChange={(e) => onUpdateStatus(t.id, e.target.value)}
                      style={{ padding: '6px 10px', border: '1px solid #E8F4E9', borderRadius: '6px', fontSize: '13px', background: 'white', color: '#1F2937', cursor: 'pointer', minWidth: '110px' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#6B7280', fontSize: '14px' }}>{t.dueDate}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => onDelete(t.id)}
                      style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#1F2937', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tasks;