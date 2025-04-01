CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) NOT NULL,         
    wallet_address VARCHAR(42) UNIQUE NULL, 
    display_name VARCHAR(100) NULL,         
    email VARCHAR(255) UNIQUE NOT NULL,        
    avatar_url TEXT NULL,                   
    user_status VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    last_login_at TIMESTAMP NULL,          
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id)
);