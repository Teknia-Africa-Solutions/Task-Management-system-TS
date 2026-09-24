// frontend/src/services/adminMockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'Elina Wambui', email: 'elina@taskflow.io', role: 'Super Admin', team: 'Management', status: 'Active', lastActive: '2026-05-21', avatar: 'EW' },
  { id: 2, name: 'Jane Cooper', email: 'jane@taskflow.io', role: 'Project Manager', team: 'Frontend', status: 'Active', lastActive: '2026-05-21', avatar: 'JC' },
  { id: 3, name: 'Mike Johnson', email: 'mike@taskflow.io', role: 'Project Manager', team: 'Backend', status: 'Active', lastActive: '2026-05-20', avatar: 'MJ' },
  { id: 4, name: 'Nova Lee', email: 'nova@taskflow.io', role: 'Designer', team: 'Design', status: 'Active', lastActive: '2026-05-21', avatar: 'NL' },
  { id: 5, name: 'Brian Kim', email: 'brian@taskflow.io', role: 'Developer', team: 'Backend', status: 'Active', lastActive: '2026-05-21', avatar: 'BK' },
  { id: 6, name: 'Sarah Wilson', email: 'sarah@taskflow.io', role: 'QA', team: 'QA', status: 'Active', lastActive: '2026-05-20', avatar: 'SW' },
  { id: 7, name: 'David Brown', email: 'david@taskflow.io', role: 'DevOps', team: 'DevOps', status: 'Inactive', lastActive: '2026-05-15', avatar: 'DB' },
  { id: 8, name: 'Emily Chen', email: 'emily@taskflow.io', role: 'Developer', team: 'Frontend', status: 'Active', lastActive: '2026-05-19', avatar: 'EC' },
  { id: 9, name: 'Lisa Park', email: 'lisa@taskflow.io', role: 'Designer', team: 'Design', status: 'Active', lastActive: '2026-05-18', avatar: 'LP' },
  { id: 10, name: 'Anna Martinez', email: 'anna@taskflow.io', role: 'QA', team: 'QA', status: 'Inactive', lastActive: '2026-05-10', avatar: 'AM' },
];

export const INITIAL_TEAMS = [
  { id: 1, name: 'Frontend Team', description: 'UI/UX, React, responsive design', manager: 'Jane Cooper', members: ['Emily Chen', 'Nova Lee'], activeTasks: 12, completedTasks: 45, workload: 85, status: 'Active' },
  { id: 2, name: 'Backend Team', description: 'APIs, Node.js, databases', manager: 'Mike Johnson', members: ['Brian Kim'], activeTasks: 8, completedTasks: 38, workload: 72, status: 'Active' },
  { id: 3, name: 'Design Team', description: 'UI/UX design, branding', manager: 'Nova Lee', members: ['Lisa Park'], activeTasks: 6, completedTasks: 22, workload: 51, status: 'Active' },
  { id: 4, name: 'QA Team', description: 'Testing, automation', manager: 'Sarah Wilson', members: ['Anna Martinez'], activeTasks: 10, completedTasks: 30, workload: 79, status: 'Active' },
  { id: 5, name: 'DevOps Team', description: 'Infrastructure, deployment', manager: 'David Brown', members: [], activeTasks: 4, completedTasks: 15, workload: 40, status: 'Inactive' },
];

export const INITIAL_PROJECTS = [
  { id: 1, name: 'Website Redesign', description: 'Complete website overhaul', manager: 'Jane Cooper', team: 'Frontend Team', progress: 75, tasks: { total: 16, completed: 12 }, deadline: '2026-05-30', priority: 'High', status: 'In Progress' },
  { id: 2, name: 'Mobile App Development', description: 'React Native cross-platform app', manager: 'Mike Johnson', team: 'Backend Team', progress: 60, tasks: { total: 30, completed: 18 }, deadline: '2026-06-15', priority: 'High', status: 'In Progress' },
  { id: 3, name: 'API Server Migration', description: 'Migrating legacy API', manager: 'Nova Lee', team: 'Design Team', progress: 90, tasks: { total: 30, completed: 27 }, deadline: '2026-05-25', priority: 'Medium', status: 'In Progress' },
  { id: 4, name: 'Database Optimization', description: 'Query optimization', manager: 'Sarah Wilson', team: 'QA Team', progress: 40, tasks: { total: 20, completed: 8 }, deadline: '2026-06-05', priority: 'Medium', status: 'On Hold' },
];

export const INITIAL_TASKS = [
  { id: 1, title: 'Deploy Staging Server v2.4', description: 'Deploy latest staging build', project: 'Website Redesign', assignee: 'Jane Cooper', priority: 'Urgent', status: 'Pending', dueDate: '2026-05-22' },
  { id: 2, title: 'Fix Auth Cookie Expiry Bug', description: 'Fix authentication cookie expiration', project: 'API Server', assignee: 'Mike Johnson', priority: 'High', status: 'In Progress', dueDate: '2026-05-23' },
  { id: 3, title: 'Review Figma Component Specs', description: 'Review design system components', project: 'Mobile App', assignee: 'Nova Lee', priority: 'Medium', status: 'Pending', dueDate: '2026-05-21' },
  { id: 4, title: 'Update API Documentation', description: 'Update API docs with new endpoints', project: 'API Server', assignee: 'Brian Kim', priority: 'Low', status: 'Pending', dueDate: '2026-05-24' },
  { id: 5, title: 'Design Dashboard UI', description: 'Create admin dashboard designs', project: 'Website Redesign', assignee: 'Emily Chen', priority: 'High', status: 'In Progress', dueDate: '2026-05-25' },
  { id: 6, title: 'Setup CI/CD Pipeline', description: 'Configure GitHub Actions', project: 'DevOps', assignee: 'David Brown', priority: 'Critical', status: 'Blocked', dueDate: '2026-05-20' },
  { id: 7, title: 'User Authentication Flow', description: 'Implement OAuth2 login', project: 'Mobile App', assignee: 'Mike Johnson', priority: 'High', status: 'Completed', dueDate: '2026-05-15' },
  { id: 8, title: 'Database Indexing', description: 'Optimize database queries', project: 'Database Optimization', assignee: 'Sarah Wilson', priority: 'Medium', status: 'Overdue', dueDate: '2026-05-10' },
  { id: 9, title: 'Responsive Design Fixes', description: 'Fix mobile responsiveness issues', project: 'Website Redesign', assignee: 'Nova Lee', priority: 'Medium', status: 'In Progress', dueDate: '2026-05-28' },
  { id: 10, title: 'API Rate Limiting', description: 'Implement rate limiting middleware', project: 'API Server', assignee: 'Brian Kim', priority: 'Low', status: 'Pending', dueDate: '2026-06-01' },
  { id: 999, title: 'Blocked Task - Needs Review', description: 'This task is blocked', project: 'Test Project', assignee: 'Admin', priority: 'High', status: 'Blocked', dueDate: '2026-06-15' },
];

export const INITIAL_FILES = [
  { id: 1, name: 'Database_Schema_v2.sql', type: 'SQL', size: '2.4 MB', uploader: 'Mike Johnson', project: 'API Server', icon: '💻' },
  { id: 2, name: 'UI_Spec.png', type: 'Image', size: '8.1 MB', uploader: 'Jane Cooper', project: 'Website Redesign', icon: '🖼️' },
  { id: 3, name: 'API_Doc.pdf', type: 'PDF', size: '512 KB', uploader: 'Mike Johnson', project: 'API Server', icon: '📄' },
  { id: 4, name: 'Architecture_Diagram.png', type: 'Image', size: '4.3 MB', uploader: 'Nova Lee', project: 'Mobile App', icon: '🖼️' },
  { id: 5, name: 'Test_Cases.xlsx', type: 'Spreadsheet', size: '1.8 MB', uploader: 'Sarah Wilson', project: 'QA', icon: '📊' },
  { id: 6, name: 'Deployment_Guide.pdf', type: 'PDF', size: '890 KB', uploader: 'David Brown', project: 'DevOps', icon: '📄' },
];

export const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'user', title: 'New User Registered', description: 'John Doe created an account', timestamp: '2026-05-21T10:30:00', read: false },
  { id: 2, type: 'project', title: 'Project Created', description: 'Project Alpha was created', timestamp: '2026-05-21T09:15:00', read: false },
  { id: 3, type: 'task', title: 'Task Assigned', description: 'Mike assigned a task', timestamp: '2026-05-21T08:00:00', read: false },
  { id: 4, type: 'security', title: 'Security Alert', description: 'Failed login attempt detected', timestamp: '2026-05-21T07:30:00', read: false },
  { id: 5, type: 'task', title: 'Task Overdue', description: 'API Integration task is overdue', timestamp: '2026-05-20T18:00:00', read: true },
  { id: 6, type: 'project', title: 'Project At Risk', description: 'Website Redesign at risk', timestamp: '2026-05-20T16:00:00', read: true },
  { id: 7, type: 'system', title: 'System Update', description: 'Scheduled maintenance completed', timestamp: '2026-05-19T22:00:00', read: true, icon: '🔄' },
  { id: 8, type: 'file', title: 'File Uploaded', description: 'New design file uploaded', timestamp: '2026-05-19T14:00:00', read: false },
];