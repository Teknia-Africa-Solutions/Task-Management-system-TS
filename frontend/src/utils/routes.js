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
};

export const userPath = (key) => `/user/${USER_ROUTES[key]}`;