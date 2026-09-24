// frontend/src/utils/badges.js

/**
 * Returns Tailwind classes for a priority badge
 */
export const getPriorityBadge = (priority) => {
  const styles = {
    Critical: 'bg-red-600 text-white',
    Urgent: 'bg-[#FF883E] text-white',
    High: 'bg-[#05620C] text-white',
    Medium: 'bg-[#E8F4E9] text-[#05620C]',
    Low: 'bg-[#FFF0E8] text-[#FF883E]',
  };
  return `px-2 py-0.5 rounded text-[10px] font-semibold ${styles[priority] || styles.Medium}`;
};

/**
 * Returns Tailwind classes for a status/role badge
 */
export const getStatusBadge = (status) => {
  const styles = {
    'Super Admin': 'bg-[#FF883E] text-white',
    admin: 'bg-[#E8F4E9] text-[#05620C]',
    'Project Manager': 'bg-[#05620C] text-white',
    user: 'bg-[#E8F4E9] text-[#05620C]',
    QA: 'bg-[#E8F4E9] text-[#05620C]',
    DevOps: 'bg-[#E8F4E9] text-[#05620C]',
    Developer: 'bg-[#E8F4E9] text-[#05620C]',
    Designer: 'bg-[#E8F4E9] text-[#05620C]',
    Active: 'bg-[#05620C] text-white',
    Inactive: 'bg-[#E8F4E9] text-[#6B7280]',
    Pending: 'bg-[#E8F4E9] text-[#05620C]',
    'In Progress': 'bg-[#E8F4E9] text-[#05620C]',
    Completed: 'bg-[#05620C] text-white',
    'On Hold': 'bg-[#E8F4E9] text-[#6B7280]',
    Blocked: 'bg-[#FF883E] text-white',
    Overdue: 'bg-[#FF883E] text-white',
    'At Risk': 'bg-[#FF883E] text-white',
  };
  return `px-2 py-0.5 rounded text-[11px] font-medium ${styles[status] || 'bg-[#E8F4E9] text-[#05620C]'}`;
};