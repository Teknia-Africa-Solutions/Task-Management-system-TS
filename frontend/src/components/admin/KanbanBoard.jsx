// frontend/src/components/admin/KanbanBoard.jsx

import React from 'react';

const KanbanBoard = ({ taskStatusData, total, onStatusClick }) => {
  return (
    <>
      {/* Kanban Mini-Board Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          height: '180px',
        }}
      >
        {taskStatusData.map((status, index) => {
          const percentage = total > 0 ? Math.round((status.count / total) * 100) : 0;

          return (
            <div
              key={index}
              onClick={() => onStatusClick(status.label)}
              style={{
                background: status.bgColor,
                borderRadius: '10px',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '2px solid transparent',
                position: 'relative',
                minHeight: '140px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = status.color;
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Status Indicator Dot */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: status.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                }}
              >
                <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>
                  {status.count}
                </span>
              </div>

              {/* Status Label */}
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#1F2937',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  marginBottom: '4px',
                }}
              >
                {status.label}
              </span>

              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  background: '#E5E7EB',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginTop: '4px',
                }}
              >
                <div
                  style={{
                    width: percentage + '%',
                    height: '100%',
                    background: status.color,
                    borderRadius: '2px',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>

              {/* Percentage */}
              <span
                style={{
                  fontSize: '9px',
                  color: '#6B7280',
                  marginTop: '3px',
                  fontWeight: '500',
                }}
              >
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Total Tasks Summary */}
      <div
        style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid #F3F4F6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '12px', color: '#6B7280' }}>
          Total Tasks: <strong style={{ color: '#1F2937' }}>{total}</strong>
        </span>
        <span style={{ fontSize: '11px', color: '#05620C', fontWeight: '500' }}>
          Click a status to filter →
        </span>
      </div>
    </>
  );
};

export default KanbanBoard;