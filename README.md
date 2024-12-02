# **User Management Service**

This **User Management Service** is a microservice built using **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**. It provides user authentication and management functionalities such as **user registration**, **login**, **profile management**, **password reset**, and more. The service is secured using **JWT** authentication and implements best practices for error handling and logging.

## **Features**

- **User Registration**: Secure user registration with password hashing using **bcryptjs**.
- **User Login**: Authentication using **JWT** (JSON Web Tokens).
- **User Profile**: Fetch authenticated user's profile.
- **Password Reset**: Request and complete password reset via email.
- **Email Verification**: Send email verification links for new users (optional).
- **Logging**: Centralized logging using **Winston** for debugging and monitoring.
- **Error Handling**: Professional error handling with environment-based responses.
- **API Documentation**: Automatically generated and interactive API docs using **Swagger**.

---

## **Technologies Used**

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for building APIs.
- **Prisma**: ORM for interacting with PostgreSQL.
- **PostgreSQL**: Relational database.
- **JWT**: Authentication with JSON Web Tokens.
- **Bcrypt**: Password hashing for security.
- **Nodemailer**: Sending emails for password reset and verification.
- **Winston**: Logging library for structured logs.
- **Swagger**: API documentation and interactive testing.

---

## **Installation**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/user-management-service.git
   cd user-management-service
   ```
2. **Install dependencies**:

   ```bash
    npm install
    ```
3. **Set up environment variables**: Create a .env file in the root directory with the following content:
   ```bash
        DATABASE_URL=postgresql://username:password@localhost:5432/user_management_db
        JWT_SECRET=your_jwt_secret_key
        EMAIL_HOST=smtp.example.com
        EMAIL_PORT=587
        EMAIL_USERNAME=your_email@example.com
        EMAIL_PASSWORD=your_password
        EMAIL_FROM="Houddle Support <support@houddle.com>"
        FRONTEND_URL=https://houddle.com
        LOG_LEVEL=info
    ```
4. **Run Prisma migrations**:
    ```bash
        npx prisma migrate dev --name init
    ```
5. **Start the server**:
    ```bash
        npm start
    ```
## **API Documentation**
This service comes with Swagger for interactive API documentation. Once the server is running, you can access the API docs at:
    ```bash
        http://localhost:4000/api-docs
    ```
## **Folder Structure**
    ```bash
        user-management-service/
        │
        ├── src/
        │   ├── controllers/           # User-related controllers
        │   ├── middlewares/           # Authentication and error-handling middleware
        │   ├── routes/                # Routes for user management (auth.routes.js)
        │   ├── services/              # Business logic for user registration, login, etc.
        │   ├── utils/                 # Utilities (email, logger, JWT token)
        │   ├── prisma/                # Prisma client and schema
        │   └── app.js                 # Main entry point of the application
        │
        ├── prisma/                    # Prisma migrations and schema
        ├── .env                       # Environment variables
        ├── Dockerfile                 # Dockerfile for containerization (if needed)
        ├── package.json               # Project dependencies and scripts
        └── README.md                  # Documentation for the service
    ```
## **Contributing**
Feel free to submit issues or pull requests. Contributions are welcome!

## **License**
This project is licensed under the ISC License.

    ```bash
        This **README.md** provides clear instructions on how to set up, install, and run your **User Management Service**, along with details about the technologies used and the folder structure of the project. You can customize it further by adding more details or sections as needed. 
    ```