CREATE TABLE IF NOT EXISTS tasks (
    user_id VARCHAR(255) NOT NULL,
    task_id VARCHAR(255) NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT NOT NULL,
    task_status VARCHAR(255) NOT NULL,
    task_priority VARCHAR(255) NOT NULL,
    task_blockchain_hash VARCHAR(255) NOT NULL,    
    task_category VARCHAR(255) NOT NULL,    
    task_due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);