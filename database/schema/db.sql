-- =========================================================
-- TASK MANAGEMENT SYSTEM DATABASE
-- MySQL 8+
-- =========================================================

CREATE DATABASE IF NOT EXISTS task_management
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE task_management;


-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role ENUM('Member', 'Admin', 'SuperAdmin')
        NOT NULL DEFAULT 'Member',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_role (role)
);


-- =========================================================
-- PROJECTS
-- =========================================================

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    description TEXT NULL,

    color VARCHAR(20) DEFAULT '#05620C',

    created_by INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    INDEX idx_projects_created_by (created_by)
);


-- =========================================================
-- PROJECT MEMBERS
-- =========================================================
-- Defines which users belong to which projects.
-- A user can belong to multiple projects.

CREATE TABLE project_members (
    project_id INT NOT NULL,

    user_id INT NOT NULL,

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (project_id, user_id),

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_project_members_user (user_id)
);


-- =========================================================
-- TASKS
-- =========================================================

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(200) NOT NULL,

    description TEXT NULL,

    category VARCHAR(100) NULL,

    priority ENUM('Low', 'Medium', 'High')
        NOT NULL DEFAULT 'Medium',

    status ENUM('Todo', 'In Progress', 'Review', 'Done')
        NOT NULL DEFAULT 'Todo',

    due_date DATE NULL,

    project_id INT NULL,

    assignee_id INT NULL,

    created_by INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE SET NULL,

    FOREIGN KEY (assignee_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    INDEX idx_tasks_project (project_id),

    INDEX idx_tasks_assignee (assignee_id),

    INDEX idx_tasks_creator (created_by),

    INDEX idx_tasks_status (status),

    INDEX idx_tasks_priority (priority),

    INDEX idx_tasks_due_date (due_date)
);


-- =========================================================
-- TASK ACTIVITY / HISTORY
-- =========================================================
-- Keeps a history of important task changes.

CREATE TABLE task_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,

    task_id INT NOT NULL,

    user_id INT NULL,

    action VARCHAR(100) NOT NULL,

    description TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    INDEX idx_task_activity_task (task_id),

    INDEX idx_task_activity_user (user_id)
);


-- =========================================================
-- TASK COMMENTS
-- =========================================================

CREATE TABLE task_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    task_id INT NOT NULL,

    user_id INT NULL,

    comment TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    INDEX idx_task_comments_task (task_id),

    INDEX idx_task_comments_user (user_id)
);


-- =========================================================
-- FILES
-- =========================================================
-- General file records.
-- Files can optionally belong to a task or project.

CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    original_name VARCHAR(255) NULL,

    file_path VARCHAR(500) NOT NULL,

    mime_type VARCHAR(100) NULL,

    size_bytes BIGINT UNSIGNED NOT NULL,

    uploaded_by INT NULL,

    project_id INT NULL,

    task_id INT NULL,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (uploaded_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    INDEX idx_files_uploaded_by (uploaded_by),

    INDEX idx_files_project (project_id),

    INDEX idx_files_task (task_id)
);


-- =========================================================
-- CONVERSATIONS
-- =========================================================

CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- CONVERSATION PARTICIPANTS
-- =========================================================

CREATE TABLE conversation_participants (
    conversation_id INT NOT NULL,

    user_id INT NOT NULL,

    last_read_at TIMESTAMP NULL,

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (conversation_id, user_id),

    FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_conversation_participants_user (user_id)
);


-- =========================================================
-- MESSAGES
-- =========================================================

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,

    conversation_id INT NOT NULL,

    sender_id INT NOT NULL,

    text TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_messages_conversation (conversation_id),

    INDEX idx_messages_sender (sender_id),

    INDEX idx_messages_created_at (created_at)
);


-- =========================================================
-- NOTIFICATIONS
-- =========================================================

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    type ENUM(
        'task',
        'message',
        'deadline',
        'alert',
        'project'
    ) NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT NULL,

    related_task_id INT NULL,

    related_project_id INT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (related_task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    FOREIGN KEY (related_project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    INDEX idx_notifications_user (user_id),

    INDEX idx_notifications_read (is_read),

    INDEX idx_notifications_task (related_task_id),

    INDEX idx_notifications_project (related_project_id),

    INDEX idx_notifications_created_at (created_at)
);


-- =========================================================
-- OPTIONAL: TASK LABELS
-- =========================================================
-- Allows multiple labels such as:
-- Bug, Frontend, Backend, Urgent, Design, Testing

CREATE TABLE labels (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(50) NOT NULL UNIQUE,

    color VARCHAR(20) DEFAULT '#6B7280',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- TASK <-> LABELS
-- =========================================================

CREATE TABLE task_labels (
    task_id INT NOT NULL,

    label_id INT NOT NULL,

    PRIMARY KEY (task_id, label_id),

    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    FOREIGN KEY (label_id)
        REFERENCES labels(id)
        ON DELETE CASCADE
);


-- =========================================================
-- OPTIONAL: TASK WATCHERS
-- =========================================================
-- Users who want notifications about a task
-- even if they are not the assignee.

CREATE TABLE task_watchers (
    task_id INT NOT NULL,

    user_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (task_id, user_id),

    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);