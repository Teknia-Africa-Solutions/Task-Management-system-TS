// frontend/src/pages/Admin/Reports.jsx

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

const Reports = ({ isMobile }) => {
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([adminApi.getReportsSummary(), adminApi.getTasks()])
      .then(([summaryData, tasksData]) => {
        setSummary(summaryData);
        setTasks(tasksData);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load reports:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
        <p>Loading reports...</p>
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

  // Compute task status counts from real tasks
  const taskCompletionData = [
  { status: 'Todo', value: tasks.filter((t) => t.status === 'Todo').length, color: '#006B1B' },
  { status: 'In Progress', value: tasks.filter((t) => t.status === 'In Progress').length, color: '#006B1B' },
  { status: 'Review', value: tasks.filter((t) => t.status === 'Review').length, color: '#006B1B' },
  { status: 'Done', value: tasks.filter((t) => t.status === 'Done').length, color: '#006B1B' },
];

  const maxValue = Math.max(...taskCompletionData.map((d) => d.value), 5);
  const roundedMax = Math.ceil(maxValue / 0.25) * 0.25;

  const yAxisValues = [];
  for (let i = 0; i <= roundedMax / 0.25; i++) {
    yAxisValues.push(i * 0.25);
  }

  return (
    <div style={{ padding: isMobile ? '12px' : '24px', backgroundColor: '#F8FAF8', overflowX: 'hidden' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6b806d', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Total Users</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>{summary.totalUsers}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Total Projects</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>{summary.totalProjects}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Total Tasks</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>{summary.totalTasks}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Completed</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>{summary.completedTasks}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Overdue</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>{summary.overdueTasks}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Completion Rate</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>{summary.completionRate}%</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="7" height="20" rx="1" />
            <rect x="11" y="8" width="7" height="14" rx="1" />
            <rect x="20" y="12" width="3" height="10" rx="1" />
          </svg>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>Task Status Overview</h3>
        </div>

        <div style={{ height: '220px', width: '100%', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 220" preserveAspectRatio="xMidYMid meet">
            {yAxisValues.map((val) => {
              const y = 200 - (val / roundedMax) * 170;
              const isWholeNumber = val % 1 === 0;
              return (
                <g key={val}>
                  <text x="0" y={y + 4} fontSize={isWholeNumber ? '10' : '8'} fill={isWholeNumber ? '#6B7280' : '#9CA3AF'} textAnchor="start" fontWeight={isWholeNumber ? '600' : '400'}>
                    {val}
                  </text>
                  <line x1={isWholeNumber ? '30' : '40'} y1={y} x2="590" y2={y} stroke={isWholeNumber ? '#E5E7EB' : '#F3F4F6'} strokeWidth={isWholeNumber ? '1' : '0.5'} strokeDasharray={isWholeNumber ? 'none' : '4,4'} />
                </g>
              );
            })}

            {taskCompletionData.map((item, index) => {
              const barWidth = 70;
              const spacing = 35;
              const totalWidth = taskCompletionData.length * (barWidth + spacing) - spacing;
              const startX = (600 - totalWidth) / 2;
              const x = startX + index * (barWidth + spacing);
              const barHeight = (item.value / roundedMax) * 170;
              const y = 200 - barHeight;

              return (
                <g key={index}>
                  <rect x={x} y={y} width={barWidth} height={barHeight} fill={item.color} rx="4" ry="4" />
                  <title>{item.status + '\n' + item.value + ' Tasks'}</title>
                  <text x={x + barWidth / 2} y="218" fontSize="11" fill="#6B7280" textAnchor="middle" fontWeight="500">
                    {item.status}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Reports;