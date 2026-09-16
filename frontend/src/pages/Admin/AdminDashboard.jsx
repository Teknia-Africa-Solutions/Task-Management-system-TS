// frontend/src/pages/AdminDashboard.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_TEAMS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_FILES,
  INITIAL_NOTIFICATIONS,
} from '../../services/adminMockData';
import { useToast } from '../../hooks/useToast';
import { useIsMobile } from '../../hooks/useIsMobile';
import Toast from '../../components/admin/Toast';
import Modal from '../../components/admin/Modal';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import AuditLogs from './AuditLogs';
import Calendar from './Calendar';
import Notifications from './Notifications';
import Files from './Files';
import Teams from './Teams';
import Projects from './Projects';
import Users from './Users';
import Tasks from './Tasks';
import Reports from './Reports';
import Profile from './Profile';
import Dashboard from './Dashboard';
// ============================================================
// COMPONENT
// ============================================================
const AdminDashboard = () => {
  // ---------- STATE ----------
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [fileProjectFilter, setFileProjectFilter] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState({ role: 'all', status: 'all' });
  const [taskFilter, setTaskFilter] = useState({ status: 'all', priority: 'all', project: 'all' });
  const [notificationFilter, setNotificationFilter] = useState('all');
 const { toastMessage, toastType, showToast } = useToast();
  const fileInputRef = useRef(null);

const isMobile = useIsMobile();
const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // ---------- DATA STATES ----------
  const [users, setUsers] = useState(INITIAL_USERS);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // ---------- STATS ----------
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'Active').length,
    inactiveUsers: users.filter(u => u.status === 'Inactive').length,
    admins: users.filter(u => u.role === 'Super Admin').length,
    managers: users.filter(u => u.role === 'Project Manager').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'Completed').length,
    overdueTasks: tasks.filter(t => t.status === 'Overdue').length,
    pendingTasks: tasks.filter(t => t.status === 'Pending').length,
    inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
    blockedTasks: tasks.filter(t => t.status === 'Blocked').length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'In Progress').length,
    atRiskProjects: projects.filter(p => p.status === 'At Risk' || p.progress < 50).length,
    totalTeams: teams.length,
    activeTeams: teams.filter(t => t.status === 'Active').length,
    totalMembers: users.length,
    totalFiles: files.length,
    totalStorage: 7.2,
    storageUsed: 72,
    storageLimit: 10,
    unreadNotifications: notifications.filter(n => !n.read).length,
    avgWorkload: Math.round(teams.reduce((acc, t) => acc + t.workload, 0) / teams.length),
  };

  // ---------- HANDLERS ----------
  const handleAddUser = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const role = form.role.value;
    const team = form.team.value;
    if (!name || !email) return;
    const newUser = {
      id: Date.now(),
      name,
      email,
      role,
      team: team || 'General',
      status: 'Active',
      lastActive: new Date().toISOString().split('T')[0],
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    };
    setUsers([...users, newUser]);
    setIsAddUserModalOpen(false);
    showToast(`User ${name} created successfully!`);
  };

  const handleDeleteUser = (id) => {
    const user = users.find(u => u.id === id);
    setUsers(users.filter(u => u.id !== id));
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
    showToast(`User ${user?.name || 'deleted'} deleted successfully!`);
  };

  const handleToggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    showToast('User status updated!');
  };

  const handleAddTeam = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.teamName.value;
    const description = form.description.value;
    const manager = form.manager.value;
    if (!name) return;
    const newTeam = {
      id: Date.now(),
      name,
      description: description || '',
      manager: manager || 'Unassigned',
      members: [],
      activeTasks: 0,
      completedTasks: 0,
      workload: 0,
      status: 'Active',
    };
    setTeams([...teams, newTeam]);
    setIsAddTeamModalOpen(false);
    showToast(`Team ${name} created successfully!`);
  };

  const handleDeleteTeam = (id) => {
    const team = teams.find(t => t.id === id);
    setTeams(teams.filter(t => t.id !== id));
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
    showToast(`Team ${team?.name || 'deleted'} deleted successfully!`);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    
    // Simulate saving to localStorage or API
    setTimeout(() => {
      // Save tasks to localStorage
      localStorage.setItem('savedTasks', JSON.stringify(tasks));
      
      setLastSaved(new Date().toLocaleTimeString());
      setIsSaving(false);
      showToast('Tasks saved successfully! ✅');
    }, 800);
  };
  
  // Load saved tasks on component mount
  const loadSavedTasks = () => {
    const saved = localStorage.getItem('savedTasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks(parsed);
        console.log('✅ Tasks loaded from localStorage');
      } catch (e) {
        console.error('Failed to load saved tasks:', e);
      }
    }
  };

  useEffect(() => {
    loadSavedTasks();
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.projectName.value;
    const description = form.description?.value || '';
    const priority = form.priority?.value || 'Medium';
    const status = form.status?.value || 'Active';
    const manager = form.manager?.value || 'Unassigned';
    const team = form.team?.value || 'General';
    const deadline = form.deadline?.value || '';
    if (!name) return;
    const newProject = {
      id: Date.now(),
      name,
      description,
      manager,
      team,
      progress: 0,
      tasks: { total: 0, completed: 0 },
      deadline: deadline || '2026-06-30',
      priority,
      status,
    };
    setProjects([...projects, newProject]);
    setIsAddProjectModalOpen(false);
    showToast(`Project ${name} created successfully!`);
  };

  const handleDeleteProject = (id) => {
    const project = projects.find(p => p.id === id);
    setProjects(projects.filter(p => p.id !== id));
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
    showToast(`Project ${project?.name || 'deleted'} deleted successfully!`);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.taskTitle.value;
    const description = form.description?.value || '';
    const priority = form.priority?.value || 'Medium';
    const status = form.status?.value || 'Pending';
    const project = form.project?.value || 'General';
    const assignee = form.assignee?.value || 'Unassigned';
    const dueDate = form.dueDate?.value || '';
    if (!title) return;
    const newTask = {
      id: Date.now(),
      title,
      description,
      project,
      assignee,
      priority,
      status,
      dueDate: dueDate || '2026-06-30',
    };
    setTasks([...tasks, newTask]);
    setIsAddTaskModalOpen(false);
    showToast(`Task ${title} created successfully!`);
  };

  const handleUpdateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    showToast('Task status updated!');
  };

  const handleDeleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
    showToast(`Task ${task?.title || 'deleted'} deleted successfully!`);
  };

// ---------- REPORT EXPORT HANDLERS ----------
const handleExportCSV = () => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const overdueTasks = tasks.filter((t) => t.status === 'Overdue').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const headers = ['Metric', 'Value'];
  const rows = [
    ['Total Tasks', totalTasks],
    ['Completed Tasks', completedTasks],
    ['Overdue Tasks', overdueTasks],
    ['Completion Rate', completionRate + '%'],
    ['Avg. Completion Time', '2.8 days'],
  ];
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reports_export.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully! ✅');
};

const handleExportPDF = async () => {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    showToast('Generating PDF... 📄');

    const reportsContainer = document.getElementById('reports-container');
    if (!reportsContainer) {
      showToast('Error: Reports container not found!');
      return;
    }

    const clone = reportsContainer.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = '1200px';
    clone.style.backgroundColor = '#F8FAF8';
    clone.style.padding = '24px';
    document.body.appendChild(clone);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#F8FAF8',
      logging: false,
      width: 1200,
      height: clone.scrollHeight,
      windowHeight: clone.scrollHeight,
    });

    document.body.removeChild(clone);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width * 0.75, canvas.height * 0.75],
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('reports_export.pdf');

    showToast('PDF exported successfully! ✅');
  } catch (error) {
    console.error('PDF Export Error:', error);
    showToast('Error generating PDF. Please try again. ❌');
  }
};

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.type.split('/')[0] || 'File',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploader: 'Admin',
        project: 'General',
        icon: '📄',
      };
      setFiles([...files, newFile]);
      showToast(`File ${file.name} uploaded successfully!`);
    }
    e.target.value = '';
  };

  const handleDeleteFile = (id) => {
    const file = files.find(f => f.id === id);
    setFiles(files.filter(f => f.id !== id));
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
    showToast(`File ${file?.name || 'deleted'} deleted successfully!`);
  };

  const handleMarkNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    showToast('Notification marked as read!');
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read!');
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    showToast('Notification deleted!');
  };

const handleLogout = () => {
  if (window.confirm('Are you sure you want to logout?')) {
    showToast('Logging out... 🔒');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  }
};

  const handleConfirmAction = () => {
    if (confirmAction) {
      if (confirmAction.type === 'deleteUser') handleDeleteUser(confirmAction.id);
      else if (confirmAction.type === 'deleteTeam') handleDeleteTeam(confirmAction.id);
      else if (confirmAction.type === 'deleteProject') handleDeleteProject(confirmAction.id);
      else if (confirmAction.type === 'deleteTask') handleDeleteTask(confirmAction.id);
      else if (confirmAction.type === 'deleteFile') handleDeleteFile(confirmAction.id);
    }
  };

    // ---------- MENU ITEMS ----------
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    { 
      id: 'users', 
      label: 'Users',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    { 
      id: 'teams', 
      label: 'Teams',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    { 
      id: 'projects', 
      label: 'Projects',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    { 
      id: 'tasks', 
      label: 'Tasks',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    },
    { 
      id: 'calendar', 
      label: 'Calendar',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    { 
      id: 'files', 
      label: 'Files',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )
    },
    { 
      id: 'reports', 
      label: 'Reports',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
          <circle cx="12" cy="16" r="5" />
          <line x1="12" y1="11" x2="12" y2="16" />
          <line x1="9" y1="13" x2="12" y2="16" />
          <line x1="15" y1="13" x2="12" y2="16" />
        </svg>
      )
    },
    { 
      id: 'notifications', 
      label: 'Notifications',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
    },
    
    { 
      id: 'audit', 
      label: 'Audit Logs',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Profile',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
  ];
  // ============================================================
  // MODALS
  // ============================================================

  const renderConfirmModal = () => (
  <Modal
    isOpen={isConfirmModalOpen}
    onClose={() => { setIsConfirmModalOpen(false); setConfirmAction(null); }}
    title="⚠️ Confirm Action"
    maxWidth={400}
  >
    <p style={{ color: '#6B7280', marginBottom: '20px' }}>Are you sure you want to perform this action? This cannot be undone.</p>
    <div style={{ display: 'flex', gap: '12px' }}>
      <button onClick={handleConfirmAction} style={{ flex: 1, padding: '10px', background: '#FF883E', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Confirm</button>
      <button onClick={() => { setIsConfirmModalOpen(false); setConfirmAction(null); }} style={{ padding: '10px 20px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
    </div>
  </Modal>
);

 const renderAddUserModal = () => (
  <Modal
    isOpen={isAddUserModalOpen}
    onClose={() => setIsAddUserModalOpen(false)}
    title="Add New User"
  >
    <form onSubmit={handleAddUser}>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Full Name *</label>
        <input type="text" name="name" required style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937' }} placeholder="Enter full name" />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Email *</label>
        <input type="email" name="email" required style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937' }} placeholder="Enter email" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Role</label>
          <select name="role" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937' }}>
            <option value="User">User</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="QA">QA</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Team</label>
          <select name="team" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937' }}>
            <option value="Management">Management</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Design">Design</option>
            <option value="QA">QA</option>
            <option value="DevOps">DevOps</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" style={{ flex: 1, padding: '10px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Create User</button>
        <button type="button" onClick={() => setIsAddUserModalOpen(false)} style={{ padding: '10px 20px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </form>
  </Modal>
);

  const renderAddTeamModal = () => (
  <Modal
    isOpen={isAddTeamModalOpen}
    onClose={() => setIsAddTeamModalOpen(false)}
    title="Create Team"
  >
    <form onSubmit={handleAddTeam}>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Team Name *</label>
        <input type="text" name="teamName" required style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937' }} placeholder="Enter team name" />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Description</label>
        <textarea name="description" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937', minHeight: '60px' }} placeholder="Enter team description"></textarea>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Manager</label>
        <input type="text" name="manager" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937' }} placeholder="Enter manager name" />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" style={{ flex: 1, padding: '10px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Create Team</button>
        <button type="button" onClick={() => setIsAddTeamModalOpen(false)} style={{ padding: '10px 20px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </form>
  </Modal>
);

const renderAddProjectModal = () => (
  <Modal
    isOpen={isAddProjectModalOpen}
    onClose={() => setIsAddProjectModalOpen(false)}
    title="Create New Project"
  >
    <form onSubmit={handleAddProject}>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Project Name *</label>
        <input type="text" name="projectName" required style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937' }} placeholder="Enter project name" />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Description</label>
        <textarea name="description" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937', minHeight: '60px' }} placeholder="Enter project description"></textarea>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Priority</label>
          <select name="priority" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937' }}>
            <option value="Low">Low</option>
            <option value="Medium" selected>Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Status</label>
          <select name="status" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937' }}>
            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Project Manager</label>
          <select name="manager" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937' }}>
            <option value="Jane Cooper">Jane Cooper</option>
            <option value="Mike Johnson">Mike Johnson</option>
            <option value="Nova Lee">Nova Lee</option>
            <option value="Sarah Wilson">Sarah Wilson</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Team</label>
          <select name="team" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937' }}>
            <option value="Frontend Team">Frontend Team</option>
            <option value="Backend Team">Backend Team</option>
            <option value="Design Team">Design Team</option>
            <option value="QA Team">QA Team</option>
            <option value="DevOps Team">DevOps Team</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Deadline</label>
        <input type="date" name="deadline" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937' }} />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" style={{ flex: 1, padding: '10px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Create Project</button>
        <button type="button" onClick={() => setIsAddProjectModalOpen(false)} style={{ padding: '10px 20px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </form>
  </Modal>
);

const renderAddTaskModal = () => (
  <Modal
    isOpen={isAddTaskModalOpen}
    onClose={() => setIsAddTaskModalOpen(false)}
    title="Create New Task"
  >
    <form onSubmit={handleAddTask}>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Task Title *</label>
        <input type="text" name="taskTitle" required style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937' }} placeholder="Enter task title" />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Description</label>
        <textarea name="description" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937', minHeight: '60px' }} placeholder="Enter task description"></textarea>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Priority</label>
          <select name="priority" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937' }}>
            <option value="Low">Low</option>
            <option value="Medium" selected>Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Status</label>
          <select name="status" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937' }}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Project</label>
          <select name="project" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937' }}>
            <option value="Website Redesign">Website Redesign</option>
            <option value="Mobile App">Mobile App</option>
            <option value="API Server">API Server</option>
            <option value="Database Optimization">Database Optimization</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Assignee</label>
          <select name="assignee" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937' }}>
            <option value="Jane Cooper">Jane Cooper</option>
            <option value="Mike Johnson">Mike Johnson</option>
            <option value="Nova Lee">Nova Lee</option>
            <option value="Brian Kim">Brian Kim</option>
            <option value="Sarah Wilson">Sarah Wilson</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1F2937', marginBottom: '4px' }}>Due Date</label>
        <input type="date" name="dueDate" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937' }} />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" style={{ flex: 1, padding: '10px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>Create Task</button>
        <button type="button" onClick={() => setIsAddTaskModalOpen(false)} style={{ padding: '10px 20px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </form>
  </Modal>
);


  // ============================================================
  // MAIN RENDER
  // ============================================================

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return (
  <Dashboard
    users={users}
    tasks={tasks}
    projects={projects}
    isMobile={isMobile}
    onNavigate={(tab) => setActiveTab(tab)}
    onFilterTasks={(status) => {
      setActiveTab('tasks');
      setTaskFilter({ ...taskFilter, status });
    }}
  />
);
    case 'users': return (
  <Users
    users={users}
    stats={stats}
    searchTerm={searchTerm}
    userFilter={userFilter}
    setUserFilter={setUserFilter}
    onAddUser={() => setIsAddUserModalOpen(true)}
    onToggleStatus={handleToggleUserStatus}
    onDelete={(id) => {
      setConfirmAction({ type: 'deleteUser', id });
      setIsConfirmModalOpen(true);
    }}
  />
);
  case 'teams': return (
  <Teams
    teams={teams}
    stats={stats}
    searchTerm={searchTerm}
    selectedTeam={selectedTeam}
    setSelectedTeam={setSelectedTeam}
    onCreate={() => setIsAddTeamModalOpen(true)}
    onDelete={(id) => {
      setConfirmAction({ type: 'deleteTeam', id });
      setIsConfirmModalOpen(true);
    }}
  />
);
    case 'projects': return (
  <Projects
    projects={projects}
    searchTerm={searchTerm}
    onCreate={() => setIsAddProjectModalOpen(true)}
    onDelete={(id) => {
      setConfirmAction({ type: 'deleteProject', id });
      setIsConfirmModalOpen(true);
    }}
  />
);
     case 'tasks': return (
  <Tasks
    tasks={tasks}
    searchTerm={searchTerm}
    taskFilter={taskFilter}
    setTaskFilter={setTaskFilter}
    lastSaved={lastSaved}
    isSaving={isSaving}
    onSave={handleSaveChanges}
    onCreate={() => setIsAddTaskModalOpen(true)}
    onUpdateStatus={handleUpdateTaskStatus}
    onUpdatePriority={(id, priority) => {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, priority } : t)));
      showToast('Priority updated!');
    }}
    onDelete={(id) => {
      setConfirmAction({ type: 'deleteTask', id });
      setIsConfirmModalOpen(true);
    }}
  />
);
     case 'calendar': return <Calendar />;
    case 'files': return (
  <Files
    files={files}
    searchTerm={searchTerm}
    fileTypeFilter={fileTypeFilter}
    setFileTypeFilter={setFileTypeFilter}
    fileProjectFilter={fileProjectFilter}
    setFileProjectFilter={setFileProjectFilter}
    onUploadClick={handleFileUpload}
    onFileChange={handleFileChange}
    onDelete={(id) => {
      setConfirmAction({ type: 'deleteFile', id });
      setIsConfirmModalOpen(true);
    }}
    fileInputRef={fileInputRef}
  />
);
   case 'notifications': return (
  <Notifications
    notifications={notifications}
    notificationFilter={notificationFilter}
    setNotificationFilter={setNotificationFilter}
    onMarkAllRead={handleMarkAllRead}
    onMarkRead={handleMarkNotificationRead}
    onDelete={handleDeleteNotification}
  />
);
    case 'reports': return (
  <Reports
    tasks={tasks}
    onExportCSV={handleExportCSV}
    onExportPDF={handleExportPDF}
    onToast={showToast}
  />
);
      
      case 'audit': return <AuditLogs searchTerm={searchTerm} />;
   case 'profile': return <Profile onToast={showToast} />;
      default: return (
  <Dashboard
    users={users}
    tasks={tasks}
    projects={projects}
    isMobile={isMobile}
    onNavigate={(tab) => setActiveTab(tab)}
    onFilterTasks={(status) => {
      setActiveTab('tasks');
      setTaskFilter({ ...taskFilter, status });
    }}
  />
);
    }
  };

  // ============================================================
  // MAIN RETURN
  // ============================================================

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAF8', display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
     <AdminSidebar
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  menuItems={menuItems}
  isMobile={isMobile}
  isMobileSidebarOpen={isMobileSidebarOpen}
  onLogout={handleLogout}
/>

 {/* ✅ MOBILE OVERLAY - ADD RIGHT HERE ✅ */}
    {isMobile && isMobileSidebarOpen && (
      <div 
        onClick={() => setIsMobileSidebarOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 40,
          cursor: 'pointer'
        }}
      />
    )}

      {/* Main Content */}
      <div style={{
  flex: 1,
  marginLeft: isMobile ? 0 : (sidebarOpen ? 260 : 72),
  transition: 'margin-left 0.3s ease',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
}}>
        {/* Header */}
<AdminHeader
  activeTab={activeTab}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  unreadCount={stats.unreadNotifications}
  onProfileClick={() => setActiveTab('profile')}
  onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
  isMobile={isMobile}
/>

        {/* Content */}
       <main style={{ flex: 1, backgroundColor: '#F8FAF8', paddingTop: '0px' }}>
  {renderContent()}
</main>
      </div>

      {/* Modals */}
     {renderConfirmModal()}
    {renderAddUserModal()}
    {renderAddTeamModal()}
    {renderAddProjectModal()}
    {renderAddTaskModal()}
     <Toast message={toastMessage} type={toastType} />
    </div>
  );
};

export default AdminDashboard;