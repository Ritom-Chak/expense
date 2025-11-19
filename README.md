# Expense Tracking API

A robust backend API for tracking and managing expenses, built with NestJS, TypeORM, and MySQL.

## Features

- **Authentication**: Secure user registration and login using JWT.
- **Expense Management**: Create, read, update, and delete expense records.
- **Data Validation**: Robust input validation using `class-validator`.
- **Logging**: Structured logging with `nestjs-pino`.
- **Database**: Persistent storage using MySQL and TypeORM.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: TypeORM
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/) & Docker Compose (for running the database)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd expense
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory. You can use a template or define the following variables:
    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=password
    DB_DATABASE=expense_db
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

1.  **Start the Database**:
    Use Docker Compose to start the MySQL container.
    ```bash
    docker-compose up -d
    ```

2.  **Run in Development Mode**:
    ```bash
    npm run start:dev
    ```
    The API will be available at `http://localhost:3000`.

3.  **Build for Production**:
    ```bash
    npm run build
    npm run start:prod
    ```

## Docker

You can run the entire application (API + Database) using Docker Compose.

```bash
docker-compose up --build
```

## Deployment

For detailed deployment instructions, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## License

This project is licensed under the MIT License.
