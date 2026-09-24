export const USER_ROUTES = {
  dashboard: "dashboard",
  myTasks: "my-tasks",
  projects: "projects",
  calendar: "calendar",
  reports: "reports",
  files: "files",
  messages: "messages",
  notifications: "notifications",
   viewProfile: "profile",
  accountSettings: "settings",
  notificationPreferences: "notification-preferences",
   projectDetail: "projects/:id", 
};
export const SUPERADMIN_ROUTES = {
  dashboard: "dashboard",
  userManagement: "users",
  projects: "projects",
  auditLog: "audit-log",
  settings: "settings",
  reports: "reports",
};

export const superAdminPath = (key) => `/superadmin/${SUPERADMIN_ROUTES[key]}`;


export const userPath = (key) => `/user/${USER_ROUTES[key]}`;
export const projectDetailPath = (id) => `/user/projects/${id}`;