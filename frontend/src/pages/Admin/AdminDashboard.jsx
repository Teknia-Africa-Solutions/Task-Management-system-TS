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
import { getPriorityBadge, getStatusBadge } from '../../utils/badges';
import { useToast } from '../../hooks/useToast';
import { useIsMobile } from '../../hooks/useIsMobile';
import Toast from '../../components/admin/Toast';
import StatCard from '../../components/admin/StatCard';
import Modal from '../../components/admin/Modal';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import KanbanBoard from '../../components/admin/KanbanBoard';
import AuditLogs from './AuditLogs';
import Calendar from './Calendar';
import Notifications from './Notifications';
import Files from './Files';
import Teams from './Teams';
import Projects from './Projects';
import Users from './Users';
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
  const [settingsTab, setSettingsTab] = useState('General');
  const [darkMode, setDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#05620C');
  const [fontSize, setFontSize] = useState('Medium');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordRequirement, setPasswordRequirement] = useState('Standard (8+ chars)');
 const { toastMessage, toastType, showToast } = useToast();
  const fileInputRef = useRef(null);

const isMobile = useIsMobile();
const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


// ---------- PROFILE STATE ----------
const [profileView, setProfileView] = useState('view'); 
const [profileData, setProfileData] = useState({
  name: 'Admin',
  email: 'admin@taskflow.io',
  phone: '+1 (555) 000-0000',
  department: 'Management',
});
const [tempProfile, setTempProfile] = useState(profileData);
const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
const [passwordError, setPasswordError] = useState('');
const [showPassword, setShowPassword] = useState(false);


// Close mobile sidebar when switching to desktop
useEffect(() => {
  if (!isMobile) setIsMobileSidebarOpen(false);
}, [isMobile]);


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


  // ---------- SETTINGS STATE ----------
const [timeZone, setTimeZone] = useState('Eastern Time (ET)');
const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
const [language, setLanguage] = useState('English');
const [appName] = useState('TaskFlow');

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

  const handleSaveSettings = () => {
    showToast('Settings saved successfully!');
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

  // ---------- FILTER FUNCTIONS ----------
  const getFilteredUsers = () => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = userFilter.role === 'all' || u.role === userFilter.role;
      const matchesStatus = userFilter.status === 'all' || u.status === userFilter.status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const getFilteredTasks = () => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.project.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = taskFilter.status === 'all' || t.status === taskFilter.status;
      const matchesPriority = taskFilter.priority === 'all' || t.priority === taskFilter.priority;
      const matchesProject = taskFilter.project === 'all' || t.project === taskFilter.project;
      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });
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
  // RENDER FUNCTIONS
  // ============================================================

     // ---------- DASHBOARD ----------
const renderDashboard = () => {
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

  // Task Status Data - FOR KANBAN BOARD
  const taskStatusData = [
    { label: 'Blocked', count: tasks.filter(t => t.status === 'Blocked').length, color: '#05620C', bgColor: '#F3F4F6' },
    { label: 'Pending', count: tasks.filter(t => t.status === 'Pending').length, color: '#F59E0B', bgColor: '#FEF3C7' },
    { label: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length, color: '#84CC16', bgColor: '#DBEAFE' },
    { label: 'Completed', count: tasks.filter(t => t.status === 'Completed').length, color: '#EAB308', bgColor: '#D1FAE5' },
    { label: 'Overdue', count: tasks.filter(t => t.status === 'Overdue').length, color: '#000000', bgColor: '#FEE2E2' },
  ];

  const total = taskStatusData.reduce((acc, d) => acc + d.count, 0);

  // Statistics from data
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'Active').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'Completed').length,
    activeProjects: projects.filter(p => p.status === 'In Progress' || p.status === 'Active').length,
    atRiskProjects: projects.filter(p => p.status === 'On Hold' || p.progress < 50).length,
    overdueTasks: tasks.filter(t => t.status === 'Overdue').length,
    inactiveUsers: users.filter(u => u.status !== 'Active').length,
  };

 return (
    <div style={{ padding: '24px', backgroundColor: '#F8FAF8' }}>
      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Card 1 - Total Users */}
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          subtext={`+${stats.activeUsers} active`}
          iconBg="#E8F4E9"
          iconColor="#05620C"
          subtextColor="#05620C"
          onClick={() => setActiveTab('users')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />

        {/* Card 2 - Total Tasks */}
        <StatCard
          label="Total Tasks"
          value={stats.totalTasks}
          subtext={`${stats.completedTasks} completed`}
          iconBg="#E8F4E9"
          iconColor="#05620C"
          subtextColor="#05620C"
          onClick={() => setActiveTab('tasks')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />

        {/* Card 3 - Active Projects */}
        <StatCard
          label="Active Projects"
          value={stats.activeProjects}
          subtext={`${stats.atRiskProjects} at risk`}
          iconBg="#FFF0E8"
          iconColor="#FF883E"
          subtextColor="#6B7280"
          onClick={() => setActiveTab('projects')}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          }
        />

        {/* Card 4 - Overdue Tasks */}
        <StatCard
          label="Overdue Tasks"
          value={stats.overdueTasks}
          subtext="⚠ Needs attention"
          iconBg="#FEE2E2"
          iconColor="#EF4444"
          subtextColor="#EF4444"
          onClick={() => {
            setActiveTab('tasks');
            setTaskFilter({ ...taskFilter, status: 'Overdue' });
          }}
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
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
              {/* Y-axis labels */}
              <text x="0" y="20" fontSize="10" fill="#6B7280">160</text>
              <text x="0" y="55" fontSize="10" fill="#6B7280">120</text>
              <text x="0" y="90" fontSize="10" fill="#6B7280">80</text>
              <text x="0" y="125" fontSize="10" fill="#6B7280">40</text>
              <text x="0" y="160" fontSize="10" fill="#6B7280">0</text>
              
              {/* Grid lines */}
              <line x1="25" y1="15" x2="480" y2="15" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="25" y1="50" x2="480" y2="50" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="25" y1="85" x2="480" y2="85" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="25" y1="120" x2="480" y2="120" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="25" y1="155" x2="480" y2="155" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
              
              {/* Bars */}
              {userGrowthData.map((data, i) => {
                const barHeight = (data.users / 160) * 140;
                const x = 35 + (i * 55);
                return (
                  <g key={i}>
                    <rect 
                      x={x} 
                      y={155 - barHeight} 
                      width="30" 
                      height={barHeight} 
                      fill="#05620C" 
                      rx="3" 
                      ry="3"
                    />
                    <text x={x + 15} y="178" fontSize="10" fill="#6B7280" textAnchor="middle">{data.month}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Task Status Kanban Mini-Board - REPLACES DONUT CHART */}
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
  onStatusClick={(statusLabel) => {
    setActiveTab('tasks');
    setTaskFilter({ ...taskFilter, status: statusLabel });
  }}
/>
</div>
      </div>

      {/* Bottom Section - 3 Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Team Workload */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E8F4E9' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>Team Workload</h3>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Current</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Frontend Team */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#1F2937' }}>Frontend Team</span>
                <span style={{ fontWeight: '600', color: '#05620C' }}>85%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#E8F4E9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#05620C', borderRadius: '4px' }}></div>
              </div>
            </div>
            
            {/* Backend Team */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#1F2937' }}>Backend Team</span>
                <span style={{ fontWeight: '600', color: '#96AF25' }}>72%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#E8F4E9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '72%', height: '100%', backgroundColor: '#96AF25', borderRadius: '4px' }}></div>
              </div>
            </div>
            
            {/* Design Team */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#1F2937' }}>Design Team</span>
                <span style={{ fontWeight: '600', color: '#F59E0B' }}>51%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#E8F4E9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '51%', height: '100%', backgroundColor: '#F59E0B', borderRadius: '4px' }}></div>
              </div>
            </div>
            
            {/* QA Team */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#1F2937' }}>QA Team</span>
                <span style={{ fontWeight: '600', color: '#FF883E' }}>79%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#E8F4E9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '79%', height: '100%', backgroundColor: '#FF883E', borderRadius: '4px' }}></div>
              </div>
            </div>
            
            {/* DevOps Team */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#1F2937' }}>DevOps Team</span>
                <span style={{ fontWeight: '600', color: '#9CA3AF' }}>55%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#E8F4E9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '55%', height: '100%', backgroundColor: '#9CA3AF', borderRadius: '4px' }}></div>
              </div>
            </div>
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

        {/* Recent Activity*/}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: '#F8FAF8', borderRadius: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#05620C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>NA</div>
              <div>
                <p style={{ fontSize: '12px', color: '#1F2937' }}><strong>Nova Admin</strong> created a new project</p>
                <p style={{ fontSize: '11px', color: '#6B7280' }}>10 minutes ago</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: '#F8FAF8', borderRadius: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#96AF25', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>JD</div>
              <div>
                <p style={{ fontSize: '12px', color: '#1F2937' }}><strong>Jane Doe</strong> assigned a task</p>
                <p style={{ fontSize: '11px', color: '#6B7280' }}>25 minutes ago</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: '#F8FAF8', borderRadius: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FF883E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>MJ</div>
              <div>
                <p style={{ fontSize: '12px', color: '#1F2937' }}><strong>Mike Johnson</strong> completed a task</p>
                <p style={{ fontSize: '11px', color: '#6B7280' }}>1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  
      // ---------- USERS ----------
  const renderUsers = () => {
    const filteredUsers = getFilteredUsers();
    return (
      <div style={{ padding: '16px 24px 24px 24px' }}>
       {/* Summary Cards - SMALLER */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Total Users</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.totalUsers}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Active</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.activeUsers}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Inactive</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.inactiveUsers}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Admins</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.admins}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '14px 16px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '10px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0 }}>Managers</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', margin: '2px 0 0 0' }}>{stats.managers}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #E8F4E9', borderRadius: '8px', padding: '8px 14px', flex: '1', minWidth: '200px' }}>
           <span style={{ color: '#6B7280', fontSize: '16px', fontWeight: '400' }}>⌕</span>
            <input 
              type="text" 
              placeholder="Search users..." 
              style={{ border: 'none', outline: 'none', flex: 1, fontSize: '13px', background: 'transparent', color: '#1F2937' }} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            style={{ padding: '8px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937', fontSize: '13px' }} 
            value={userFilter.role} 
            onChange={(e) => setUserFilter({ ...userFilter, role: e.target.value })}
          >
            <option value="all">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="QA">QA</option>
            <option value="DevOps">DevOps</option>
          </select>
          <select 
            style={{ padding: '8px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937', fontSize: '13px' }} 
            value={userFilter.status} 
            onChange={(e) => setUserFilter({ ...userFilter, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button 
            onClick={() => setIsAddUserModalOpen(true)} 
            style={{ padding: '8px 20px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}
          >
            + Add User
          </button>
        </div>

        {/* Users Table */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E8F4E9', background: '#F8FAF8' }}>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Team</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Active</th>
                  <th style={{ textAlign: 'center', padding: '14px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #E8F4E9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          background: u.role === 'Super Admin' || u.role === 'admin' ? '#FF883E' : '#05620C',
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '12px', 
                          fontWeight: '600' 
                        }}>
                          {u.avatar}
                        </div>
                        <span style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={getStatusBadge(u.role)} style={{ fontSize: '11px' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{u.team}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={getStatusBadge(u.status)} style={{ fontSize: '11px' }}>{u.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '13px' }}>{u.lastActive}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
  <button 
  onClick={() => handleToggleUserStatus(u.id)} 
  style={{ padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: '#6B7280' }} 
  title="Toggle Status"
>
  &#x21BB;  {/* This is the rotate/refresh symbol */}
</button>
 <button 
  onClick={() => { setConfirmAction({ type: 'deleteUser', id: u.id }); setIsConfirmModalOpen(true); }} 
  style={{ padding: '4px 6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#1F2937', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} 
  title="Delete"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  
  
     // ---------- TASKS ----------
  const renderTasks = () => {
    const filteredTasks = getFilteredTasks();
    
    // Handle priority change
    const handlePriorityChange = (taskId, newPriority) => {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, priority: newPriority } : task
      ));
      showToast('Priority updated!');
    };

    return (
      <div style={{ padding: '16px 24px 24px 24px' }}>
        {/* Header with Save button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {lastSaved && (
              <span style={{ fontSize: '13px', color: '#6B7280' }}>
                Last saved: {lastSaved}
              </span>
            )}
            <button 
              onClick={handleSaveChanges}
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
                opacity: isSaving ? 0.7 : 1
              }}
              disabled={isSaving}
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
              onChange={(e) => setSearchTerm(e.target.value)} 
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
            onClick={() => setIsAddTaskModalOpen(true)} 
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
                        onChange={(e) => handlePriorityChange(t.id, e.target.value)} 
                        style={{ 
                          padding: '6px 10px', 
                          border: '1px solid #E8F4E9', 
                          borderRadius: '6px', 
                          fontSize: '13px', 
                          background: 'white', 
                          color: '#1F2937', 
                          cursor: 'pointer',
                          fontWeight: '500',
                          minWidth: '90px'
                        }}
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
                        onChange={(e) => handleUpdateTaskStatus(t.id, e.target.value)} 
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
                        onClick={() => { setConfirmAction({ type: 'deleteTask', id: t.id }); setIsConfirmModalOpen(true); }} 
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

   // ---------- REPORTS ----------
const renderReports = () => {
  // ---------- DATA ----------
  const tasksOverviewData = [
    { month: 'Jul', completed: 45, inProgress: 30, pending: 20, overdue: 5 },
    { month: 'Aug', completed: 65, inProgress: 28, pending: 15, overdue: 6 },
    { month: 'Sep', completed: 78, inProgress: 22, pending: 10, overdue: 3 },
  ];

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

  // Calculate task completion data from actual tasks
  const taskCompletionData = [
    { status: 'Pending', value: tasks.filter(t => t.status === 'Pending').length },
    { status: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
    { status: 'Completed', value: tasks.filter(t => t.status === 'Completed').length },
    { status: 'Overdue', value: tasks.filter(t => t.status === 'Overdue').length },
    { status: 'Blocked', value: tasks.filter(t => t.status === 'Blocked').length },
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const overdueTasks = tasks.filter(t => t.status === 'Overdue').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const avgCompletionTime = 2.8;

  // Find max value for Y-axis (round up to nearest 0.25)
  const maxValue = Math.max(...taskCompletionData.map(d => d.value), 3.25);
  const roundedMax = Math.ceil(maxValue / 0.25) * 0.25;

  // ---------- EXPORT FUNCTIONS ----------
  const handleExportCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Tasks', totalTasks],
      ['Completed Tasks', completedTasks],
      ['Overdue Tasks', overdueTasks],
      ['Completion Rate', completionRate + '%'],
      ['Avg. Completion Time', avgCompletionTime + ' days'],
    ];
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully! ✅');
  };

  // ---------- UPDATED PDF EXPORT FUNCTION ----------
  const handleExportPDF = async () => {
    try {
      // Dynamically import html2canvas and jspdf
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      showToast('Generating PDF... 📄');
      
      // Get the reports container
      const reportsContainer = document.getElementById('reports-container');
      
      if (!reportsContainer) {
        showToast('Error: Reports container not found!');
        return;
      }

      // Create a clone for PDF generation (to avoid UI interference)
      const clone = reportsContainer.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '1200px';
      clone.style.backgroundColor = '#F8FAF8';
      clone.style.padding = '24px';
      document.body.appendChild(clone);

      // Wait for fonts to load
      await new Promise(resolve => setTimeout(resolve, 100));

      // Render to canvas
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

      // Remove the clone
      document.body.removeChild(clone);

      // Create PDF
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

  const statusColors = ['#0E9F6E', '#3F83F8', '#F59E0B', '#EF4444', '#6B7280'];

  // Generate Y-axis values from 0 to roundedMax in 0.25 increments
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
          <button onClick={handleExportPDF} style={{ padding: '6px 16px', background: '#D5966C', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>📊 PDF</button>
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

      {/* Task Completion Rate - VERTICAL BAR CHART (Full Width) */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E8F4E9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05620C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="7" height="20" rx="1" />
            <rect x="11" y="8" width="7" height="14" rx="1" />
            <rect x="20" y="12" width="3" height="10" rx="1" />
          </svg>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>Task Completion Rate</h3>
        </div>
        
        {/* Bar Chart */}
        <div style={{ height: '220px', width: '100%', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 220" preserveAspectRatio="xMidYMid meet">
            {/* Y-axis labels and grid lines - 0 to 3.25 in 0.25 increments */}
            {yAxisValues.map((val) => {
              const y = 200 - (val / roundedMax) * 170;
              const isWholeNumber = val % 1 === 0;
              return (
                <g key={val}>
                  <text 
                    x="0" 
                    y={y + 4} 
                    fontSize={isWholeNumber ? "10" : "8"} 
                    fill={isWholeNumber ? "#6B7280" : "#9CA3AF"} 
                    textAnchor="start"
                    fontWeight={isWholeNumber ? "600" : "400"}
                  >
                    {val}
                  </text>
                  <line 
                    x1={isWholeNumber ? "30" : "40"} 
                    y1={y} 
                    x2="590" 
                    y2={y} 
                    stroke={isWholeNumber ? "#E5E7EB" : "#F3F4F6"} 
                    strokeWidth={isWholeNumber ? "1" : "0.5"} 
                    strokeDasharray={isWholeNumber ? "none" : "4,4"} 
                  />
                </g>
              );
            })}

            {/* Bars */}
            {taskCompletionData.map((item, index) => {
              const barWidth = 70;
              const spacing = 35;
              const totalWidth = taskCompletionData.length * (barWidth + spacing) - spacing;
              const startX = (600 - totalWidth) / 2;
              const x = startX + (index * (barWidth + spacing));
              const barHeight = (item.value / roundedMax) * 170;
              const y = 200 - barHeight;

              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#006B1B"
                    rx="4"
                    ry="4"
                  />
                  <title>{item.status + '\n' + item.value + ' Tasks'}</title>
                  <text
                    x={x + barWidth / 2}
                    y="218"
                    fontSize="11"
                    fill="#6B7280"
                    textAnchor="middle"
                    fontWeight="500"
                  >
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
                  {activity.user.split(' ').map(n => n[0]).join('')}
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

  // ---------- PROFILE ----------
const renderProfile = () => {
  const handleEditClick = () => {
    setTempProfile(profileData);
    setProfileView('edit');
  };

  const handleSaveProfile = () => {
    setProfileData(tempProfile);
    setProfileView('view');
    showToast('Profile updated successfully! ✅');
  };

  const handleCancelEdit = () => {
    setTempProfile(profileData);
    setProfileView('view');
  };

  const handlePasswordClick = () => {
    setProfileView('password');
    setPasswordData({ current: '', new: '', confirm: '' });
    setPasswordError('');
  };

  const handleSavePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setPasswordError('All fields are required');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwordData.new.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    showToast('Password changed successfully! ✅');
    setProfileView('view');
    setPasswordData({ current: '', new: '', confirm: '' });
    setPasswordError('');
  };

  const handleCancelPassword = () => {
    setProfileView('view');
    setPasswordData({ current: '', new: '', confirm: '' });
    setPasswordError('');
  };

  const handleSecuritySettings = () => {
    setActiveTab('settings');
    setSettingsTab('Security');
  };

  // ----- VIEW MODE -----
  if (profileView === 'view') {
    return (
      <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #E8F4E9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          {/* Header: Avatar + Name/Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #05620C, #96AF25)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '700', flexShrink: 0 }}>
              {profileData.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', margin: 0 }}>{profileData.name}</h2>
              <p style={{ color: '#6B7280', margin: '4px 0 8px 0' }}>Administrator</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-block', padding: '2px 16px', borderRadius: '12px', background: '#E8F4E9', color: '#05620C', fontSize: '12px', fontWeight: '600' }}>Active</span>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Joined January 2026</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #E8F4E9', paddingTop: '20px' }}>
            <div><p style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</p><p style={{ fontSize: '14px', color: '#1F2937' }}>{profileData.email}</p></div>
            <div><p style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</p><p style={{ fontSize: '14px', color: '#1F2937' }}>Administrator</p></div>
            <div><p style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</p><p style={{ fontSize: '14px', color: '#1F2937' }}>{profileData.department}</p></div>
            <div><p style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Login</p><p style={{ fontSize: '14px', color: '#1F2937' }}>Today, 10:30 AM</p></div>
            <div><p style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</p><p style={{ fontSize: '14px', color: '#1F2937' }}>{profileData.phone}</p></div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E8F4E9', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={handleEditClick} style={{ padding: '8px 24px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Edit Profile</button>
            <button onClick={handlePasswordClick} style={{ padding: '8px 24px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Change Password</button>
            </div>
        </div>
      </div>
    );
  }

  // ----- EDIT MODE -----
  if (profileView === 'edit') {
    return (
      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #E8F4E9' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', marginBottom: '20px' }}>Edit Profile</h2>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Full Name</label>
            <input type="text" value={tempProfile.name} onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: '#F8FAF8', color: '#1F2937', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Email</label>
            <input type="email" value={tempProfile.email} onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: '#F8FAF8', color: '#1F2937', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Phone</label>
            <input type="text" value={tempProfile.phone} onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: '#F8FAF8', color: '#1F2937', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Department</label>
            <input type="text" value={tempProfile.department} onChange={(e) => setTempProfile({ ...tempProfile, department: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: '#F8FAF8', color: '#1F2937', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={handleSaveProfile} style={{ padding: '10px 28px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Save Changes</button>
            <button onClick={handleCancelEdit} style={{ padding: '10px 28px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // ----- PASSWORD MODE -----
  if (profileView === 'password') {
    return (
      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #E8F4E9' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1F2937', marginBottom: '20px' }}>Change Password</h2>
          {passwordError && <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>{passwordError}</p>}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Current Password</label>
            <input type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937', outline: 'none' }} placeholder="Enter current password" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937', outline: 'none' }} placeholder="Enter new password" />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }} type="button">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Confirm Password</label>
            <input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', background: 'white', color: '#1F2937', outline: 'none' }} placeholder="Confirm new password" />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={handleSavePassword} style={{ padding: '10px 28px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Update Password</button>
            <button onClick={handleCancelPassword} style={{ padding: '10px 28px', background: '#F8FAF8', color: '#1F2937', border: '1px solid #E8F4E9', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

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
      case 'dashboard': return renderDashboard();
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
      case 'tasks': return renderTasks();
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
      case 'reports': return renderReports();
      case 'settings': return renderSettings();
      case 'audit': return <AuditLogs searchTerm={searchTerm} />;
      case 'profile': return renderProfile();
      default: return renderDashboard();
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