export interface PostgresConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
  }
  
  
  export interface AppConfig {
    env: string;
    port: number;
    pg: PostgresConfig;
    
  }