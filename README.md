Expense Tracking API
A robust backend API for tracking and managing expenses, built with NestJS, TypeORM, and MySQL.

Features
Authentication: Secure user registration and login using JWT.
Expense Management: Create, read, update, and delete expense records.
Data Validation: Robust input validation using class-validator.
Logging: Structured logging with nestjs-pino.
Database: Persistent storage using MySQL and TypeORM.
Tech Stack
Framework: NestJS
Language: TypeScript
Database: MySQL
ORM: TypeORM
Containerization: Docker & Docker Compose
Getting Started
Prerequisites
Node.js (v18 or later)
Docker & Docker Compose (for running the database)
Installation
Clone the repository:

git clone <repository-url>
cd expense
Install dependencies:

npm install
Set up environment variables: Create a .env file in the root directory. You can use a template or define the following variables:

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_usename
DB_PASSWORD=your_password
DB_DATABASE=expense_db
JWT_SECRET=your_jwt_secret
Running the Application
Start the Database: Use Docker Compose to start the MySQL container.

docker-compose up -d
Run in Development Mode:

npm run start:dev
The API will be available at http://localhost:3000.

Build for Production:

npm run build
npm run start:prod
Docker
You can run the entire application (API + Database) using Docker Compose.

docker-compose up --build
Deployment
For detailed deployment instructions, please refer to DEPLOYMENT.md.

License
This project is licensed under the MIT License.
