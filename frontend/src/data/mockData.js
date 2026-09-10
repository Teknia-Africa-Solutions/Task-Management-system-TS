 export const stats = [
  { label: "Total Tasks", value: 35, change: "+12% from last week",  color: "#05620C" },
  { label: "Pending Tasks", value: 14, change: "+5% from last week", color: "#FF883E" },
  { label: "In Progress", value: 11, change: "+8% from last week", color: "#2563EB" },
];

export const weeklyData = [
  { day: "Mon", completed: 18, created: 24 },
  { day: "Tue", completed: 22, created: 15 },
  { day: "Wed", completed: 15, created: 20 },
  { day: "Thu", completed: 12, created: 9 },
  { day: "Fri", completed: 8, created: 9 },
];

 export const deadlines = [
  { date: "MAY 21", title: "Project Proposal", note: "Tomorrow" },
  { date: "MAY 23", title: "UI Design Submission", note: "In 2 days" },
  { date: "MAY 24", title: "Client Presentation", note: "In 3 days" },
  { date: "MAY 28", title: "Final Report", note: "In 7 days" },
];
export const allTasks = [
  { id: 1, title: "UI Design for Dashboard", priority: "High", status: "In Progress", category: "Design", due: "2026-05-21", assignee: "Jane Doe" },
  { id: 2, title: "Database Design", priority: "Medium", status: "Todo", category: "Backend", due: "2026-05-23", assignee: "David Brown" },
  { id: 3, title: "API Integration", priority: "Medium", status: "In Progress", category: "Backend", due: "2026-05-24", assignee: "Mike Johnson" },
  { id: 4, title: "Project Documentation", priority: "Low", status: "Todo", category: "Docs", due: "2026-05-28", assignee: "Sarah Wilson" },
];

export const trendData = [
  { week: "Week 1", completed: 10, pending: 8 },
  { week: "Week 2", completed: 20, pending: 12 },
  { week: "Week 3", completed: 17, pending: 11 },
  { week: "Week 4", completed: 25, pending: 15 },
  { week: "Week 5", completed: 22, pending: 9 },
  { week: "Week 6", completed: 33, pending: 13 },
  { week: "Week 7", completed: 28, pending: 11 },
  { week: "Week 8", completed: 38, pending: 16 },
  { week: "Week 9", completed: 41, pending: 14 },
  { week: "Week 10", completed: 33, pending: 10 },
  { week: "Week 11", completed: 47, pending: 17 },
  { week: "Week 12", completed: 50, pending: 12 },
];
export const Tasksstats = [
  { label: "Task Completion Rate", value: "87%", change: "+12% from last month", up: true },
  { label: "Avg. Task Duration", value: "2.4d", change: "-8% from last month", up: false },
  { label: "Team Productivity", value: "92%", change: "+5% from last month", up: true },
];

export const initialNotifications = [
  { id: 1, type: "task", title: "New task assigned: UI Design for Dashboard", time: "10 min ago", read: false },
  { id: 2, type: "message", title: "Jane Doe sent you a message", time: "1 hour ago", read: false },
  { id: 3, type: "deadline", title: "Project Proposal is due tomorrow", time: "3 hours ago", read: false },
  { id: 4, type: "alert", title: "Your task 'API Integration' was marked Blocked", time: "Yesterday", read: true},
  { id: 5, type: "task", title: "Task 'Database Design' status changed to Todo", time: "2 days ago", read: true},
];

export const events = {
  "2026-05-21": [{ title: "Project Proposal", color: "#B91C1C" }],
  "2026-05-23": [{ title: "UI Design", color: "#C2610F" }],
};

// Mock data for sidebar