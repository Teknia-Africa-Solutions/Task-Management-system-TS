// frontend/src/pages/Admin/Dashboard.jsx

import React from 'react';
import StatCard from '../../components/admin/StatCard';
import KanbanBoard from '../../components/admin/KanbanBoard';

const Dashboard = ({ users, tasks, projects, isMobile, onNavigate, onFilterTasks }) => {
  const userGrowthData = [
    { month: 'Jan', users: 45 },
    { month: 'Feb', users: 52 },
    { month: 'Mar', users: 68 },
    { month: 'Apr', users: 81 },
    { month: 'May', users: 95 },
    { month: 'Jun', users: 112 },
    { month: 'Jul', users: 130 },
    { month: 'Aug', users: 156 },
  ];

  const taskStatusData = [
    { label: 'Blocked', count: tasks.filter((t) => t.status === 'Blocked').length, color: '#05620C', bgColor: '#F3F4F6' },
    { label: 'Pending', count: tasks.filter((t) => t.status === 'Pending').length, color: '#F59E0B', bgColor: '#FEF3C7' },
    { label: 'In Progress', count: tasks.filter((t) => t.status === 'In Progress').length, color: '#84CC16', bgColor: '#DBEAFE' },
    { label: 'Completed', count: tasks.filter((t) => t.status === 'Completed').length, color: '#EAB308', bgColor: '#D1FAE5' },
    { label: 'Overdue', count: tasks.filter((t) => t.status === 'Overdue').length, color: '#000000', bgColor: '#FEE2E2' },
  ];

  const total = taskStatusData.reduce((acc, d) => acc + d.count, 0);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === 'Active').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'Completed').length,
    activeProjects: projects.filter((p) => p.status === 'In Progress' || p.status === 'Active').length,
    atRiskProjects: projects.filter((p) => p.status === 'On Hold' || p.progress < 50).length,
    overdueTasks: tasks.filter((t) => t.status === 'Overdue').length,
    inactiveUsers: users.filter((u) => u.status !== 'Active').length,
  };

  return (
    <div style={{ padding: isMobile ? '12px' : '24px', backgroundColor: '#F8FAF8' }}>
      {/* Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          subtext={`+${stats.activeUsers} active`}
          onClick={() => onNavigate('users')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />
        <StatCard
          label="Total Tasks"
          value={stats.totalTasks}
          subtext={`${stats.completedTasks} completed`}
          onClick={() => onNavigate('tasks')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
        <StatCard
          label="Active Projects"
          value={stats.activeProjects}
          subtext={`${stats.atRiskProjects} at risk`}
          iconBg="#FFF0E8"
          iconColor="#FF883E"
          subtextColor="#6B7280"
          onClick={() => onNavigate('projects')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
        <StatCard
          label="Overdue Tasks"
          value={stats.overdueTasks}
          subtext="⚠ Needs attention"
          iconBg="#FEE2E2"
          iconColor="#EF4444"
          subtextColor="#EF4444"
          onClick={() => onFilterTasks('Overdue')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
        />
      </div>

      {/* Charts Section */}
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
  gap: '20px', 
  marginBottom: '24px' 
}}>
        {/* User Growth Chart */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E8F4E9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>User Growth</h3>
            </div>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Last 8 months</span>
          </div>
          <div style={{ height: '220px', width: '100%' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet">
              <text x="0" y="20" fontSize="10" fill="#6B7280">160</text>
              <text x="0" y="55" fontSize="10" fill="#6B7280">120</text>
              <text x="0" y="90" fontSize="10" fill="#6B7280">80</text>
              <text x="0" y="125" fontSize="10" fill="#6B7280">40</text>
              <text x="0" y="160" fontSize="10" fill="#6B7280">0</text>

              <line x1="25" y1="15" x2="480" y2="15" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="25" y1="50" x2="480" y2="50" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="25" y1="85" x2="480" y2="85" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="25" y1="120" x2="480" y2="120" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="25" y1="155" x2="480" y2="155" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />

              {userGrowthData.map((data, i) => {
                const barHeight = (data.users / 160) * 140;
                const x = 35 + i * 55;
                return (
                  <g key={i}>
                    <rect x={x} y={155 - barHeight} width="30" height={barHeight} fill="#05620C" rx="3" ry="3" />
                    <text x={x + 15} y="178" fontSize="10" fill="#6B7280" textAnchor="middle">{data.month}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Task Status Kanban */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E8F4E9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>Task Status</h3>
            </div>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Kanban View</span>
          </div>

          <KanbanBoard
  taskStatusData={taskStatusData}
  total={total}
  isMobile={isMobile}
  onStatusClick={(statusLabel) => onFilterTasks(statusLabel)}
/>
        </div>
      </div>

      {/* Bottom Section */}
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', 
  gap: '20px' 
}}>
        {/* Team Workload */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E8F4E9' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>Team Workload</h3>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Current</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { name: 'Frontend Team', percent: 85, color: '#05620C' },
              { name: 'Backend Team', percent: 72, color: '#96AF25' },
              { name: 'Design Team', percent: 51, color: '#F59E0B' },
              { name: 'QA Team', percent: 79, color: '#FF883E' },
              { name: 'DevOps Team', percent: 55, color: '#9CA3AF' },
            ].map((team) => (
              <div key={team.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: '#1F2937' }}>{team.name}</span>
                  <span style={{ fontWeight: '600', color: team.color }}>{team.percent}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#E8F4E9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${team.percent}%`, height: '100%', backgroundColor: team.color, borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attention Required */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>Attention Required</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#F8FAF8', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#1F2937' }}>Overdue Tasks</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#EF4444' }}>{stats.overdueTasks}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#F8FAF8', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#1F2937' }}>Projects at Risk</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#F59E0B' }}>{stats.atRiskProjects}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#F8FAF8', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#1F2937' }}>Inactive Users</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#6B7280' }}>{stats.inactiveUsers}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: '#F8FAF8', borderRadius: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#05620C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>NA</div>
              <div>
                <p style={{ fontSize: '12px', color: '#1F2937', margin: 0 }}><strong>Nova Admin</strong> created a new project</p>
                <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>10 minutes ago</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: '#F8FAF8', borderRadius: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#96AF25', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>JD</div>
              <div>
                <p style={{ fontSize: '12px', color: '#1F2937', margin: 0 }}><strong>Jane Doe</strong> assigned a task</p>
                <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>25 minutes ago</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: '#F8FAF8', borderRadius: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FF883E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>MJ</div>
              <div>
                <p style={{ fontSize: '12px', color: '#1F2937', margin: 0 }}><strong>Mike Johnson</strong> completed a task</p>
                <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;