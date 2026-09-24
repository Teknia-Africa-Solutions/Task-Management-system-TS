// frontend/src/pages/Admin/Reports.jsx

import React from 'react';

const Reports = ({ tasks, isMobile, onExportCSV, onExportPDF, onToast }) => {
  // ---------- DATA ----------
  const topProjects = [
    { name: 'Website Redesign', progress: 78, tasks: '12/16', team: 'Frontend', status: 'On Hold', deadline: 'Sep 30, 2026' },
    { name: 'Mobile App Development', progress: 60, tasks: '18/30', team: 'Backend', status: 'In Progress', deadline: 'Oct 15, 2026' },
    { name: 'API Server Migration', progress: 90, tasks: '27/30', team: 'Design', status: 'In Progress', deadline: 'Sep 25, 2026' },
    { name: 'Database Optimization', progress: 45, tasks: '8/20', team: 'QA', status: 'On Hold', deadline: 'Oct 05, 2026' },
  ];

  const recentActivities = [
    { user: 'Jane Cooper', action: 'completed task Configure MySQL Connection Pool', time: '2 hours ago' },
    { user: 'Mike Johnson', action: 'created a new task Setup JWT Authentication', time: '4 hours ago' },
    { user: 'Nova Lee', action: 'updated task status Design Glassmorphism UI Components', time: '6 hours ago' },
    { user: 'Brian Kim', action: 'commented on a task API Rate Limiting Implementation', time: '8 hours ago' },
  ];

  const systemOverview = [
    { label: 'Active Users', current: 128, total: 200, percentage: 64 },
    { label: 'Total Projects', current: 24, total: 50, percentage: 48 },
    { label: 'System Uptime', current: 99.9, total: 100, unit: '%', percentage: 99.9 },
  ];

  const taskCompletionData = [
    { status: 'Pending', value: tasks.filter((t) => t.status === 'Pending').length },
    { status: 'In Progress', value: tasks.filter((t) => t.status === 'In Progress').length },
    { status: 'Completed', value: tasks.filter((t) => t.status === 'Completed').length },
    { status: 'Overdue', value: tasks.filter((t) => t.status === 'Overdue').length },
    { status: 'Blocked', value: tasks.filter((t) => t.status === 'Blocked').length },
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const overdueTasks = tasks.filter((t) => t.status === 'Overdue').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const avgCompletionTime = 2.8;

  const maxValue = Math.max(...taskCompletionData.map((d) => d.value), 3.25);
  const roundedMax = Math.ceil(maxValue / 0.25) * 0.25;

  const yAxisValues = [];
  for (let i = 0; i <= roundedMax / 0.25; i++) {
    yAxisValues.push(i * 0.25);
  }

  // ---------- RENDER ----------
  return (
    <div id="reports-container" style={{ padding: '24px', backgroundColor: '#F8FAF8' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 14px', borderRadius: '8px', border: '1px solid #E8F4E9' }}>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>📅</span>
            <span style={{ fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>Jul 1, 2026 – Sep 30, 2026</span>
          </div>
          <button
            onClick={onExportCSV}
            style={{ padding: '6px 16px', background: '#05620C', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
          >
            📊 CSV
          </button>
          <button
            onClick={onExportPDF}
            style={{ padding: '6px 16px', background: '#D5966C', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
          >
            📊 PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Total Tasks</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>{totalTasks}</p>
          <p style={{ fontSize: '10px', color: '#05620C' }}>↑ 15.7%</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Completed</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>{completedTasks}</p>
          <p style={{ fontSize: '10px', color: '#05620C' }}>↑ 19.4%</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Overdue</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>{overdueTasks}</p>
          <p style={{ fontSize: '10px', color: '#EF4444' }}>↓ 5.2%</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Completion Rate</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>{completionRate}%</p>
          <p style={{ fontSize: '10px', color: '#05620C' }}>↑ 12.3%</p>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Avg. Completion</p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0' }}>2.8d</p>
          <p style={{ fontSize: '10px', color: '#05620C' }}>↓ 18.6%</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="7" height="20" rx="1" />
            <rect x="11" y="8" width="7" height="14" rx="1" />
            <rect x="20" y="12" width="3" height="10" rx="1" />
          </svg>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>Task Completion Rate</h3>
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
                  <rect x={x} y={y} width={barWidth} height={barHeight} fill="#006B1B" rx="4" ry="4" />
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

      {/* Top Projects */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>Top Projects by Progress</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E8F4E9', background: '#F8FAF8' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Project</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Progress</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Tasks</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {topProjects.map((project, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '500', color: '#1F2937', fontSize: '13px' }}>{project.name}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', background: '#E8F4E9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: project.progress + '%', height: '100%', background: project.progress > 70 ? '#05620C' : '#F59E0B', borderRadius: '4px' }}></div>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>{project.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#6B7280', fontSize: '13px' }}>{project.tasks}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: project.status === 'On Hold' ? '#FEF3C7' : '#DBEAFE', color: project.status === 'On Hold' ? '#92400E' : '#1E40AF' }}>
                      {project.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#6B7280', fontSize: '13px' }}>{project.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activities + System Overview */}
   <div style={{ 
  display: 'grid', 
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
  gap: '24px' 
}}>
        {/* Recent Activities */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>Recent Activities</h3>
            <button style={{ fontSize: '12px', color: '#05620C', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map((activity, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', background: '#F8FAF8', borderRadius: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#05620C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>
                  {activity.user.split(' ').map((n) => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: '#1F2937', margin: 0 }}>
                    <strong>{activity.user}</strong> {activity.action}
                  </p>
                  <p style={{ fontSize: '11px', color: '#6B7280', margin: '2px 0 0 0' }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>System Overview</h3>
            <button style={{ fontSize: '12px', color: '#05620C', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {systemOverview.map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: '#6B7280' }}>{item.label}</span>
                  <span style={{ fontWeight: '500', color: '#1F2937' }}>
                    {item.current} {item.unit || ''} / {item.total} {item.unit || ''}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E8F4E9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: Math.min(item.percentage, 100) + '%', height: '100%', background: item.percentage >= 90 ? '#EF4444' : item.percentage >= 70 ? '#F59E0B' : '#05620C', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #E8F4E9', fontSize: '12px', color: '#6B7280' }}>
            Last Backup: <span style={{ fontWeight: '500', color: '#1F2937' }}>May 20, 2024 02:30 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;