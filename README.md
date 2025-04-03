# Todo Backend API

A RESTful API for a todo application built with Express and TypeScript.

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- Environment variables configured (see below)

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=production
PORT=3000
PG_HOST=your_postgres_host
PG_USER=your_postgres_user
PG_PASSWORD=your_postgres_password
PG_DATABASE=your_postgres_database
PG_PORT=5432
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d
```

### Building and Running with Docker

#### Using Docker Compose 
```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```



### API Endpoints
- `GET /` - API health check
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks/:id` - Get a specific task
- `PUT /api/v1/tasks/:id` - Update a task
- `DELETE /api/v1/tasks/:id` - Delete a task 