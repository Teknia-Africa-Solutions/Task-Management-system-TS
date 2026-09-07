export const USER_ROUTES = {
  dashboard: "dashboard",
  myTasks: "my-tasks",
  projects: "projects",
  calendar: "calendar",
  reports: "reports",
  files: "files",
  messages: "messages",
  notifications: "notifications",
};

export const userPath = (key) => `/user/${USER_ROUTES[key]}`;