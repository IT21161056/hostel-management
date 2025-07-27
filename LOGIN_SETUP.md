# Hostel Management System - Login Setup Guide

## Overview

The login system has been implemented with JWT authentication, refresh tokens, and role-based access control.

## Features Implemented

### Backend

- JWT-based authentication with access and refresh tokens
- Secure cookie-based refresh token storage
- Role-based authorization (admin, warden, accountant, kitchen)
- Password hashing with bcrypt
- CORS configuration for frontend integration
- Automatic token refresh handling

### Frontend

- React-based login form with error handling
- Persistent authentication state
- Automatic token refresh on API calls
- Role-based route protection
- User menu with logout functionality
- Loading states and proper error messages

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   NODE_ENV=development
   ```

4. Seed the database with test users:

   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Test Users

After running the seed script, you can login with any of these credentials:

| Email               | Password | Role       | Permissions           |
| ------------------- | -------- | ---------- | --------------------- |
| admin@ananda.edu    | password | Admin      | Full system access    |
| warden@ananda.edu   | password | Warden     | Students & Attendance |
| accounts@ananda.edu | password | Accountant | Finance & Payments    |
| kitchen@ananda.edu  | password | Kitchen    | Meal Planning only    |

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### Users

- `POST /api/v1/users` - Create user (Admin only)
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID (Admin only)
- `PUT /api/v1/users/:id` - Update user (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

## Security Features

1. **JWT Tokens**: Access tokens for API calls, refresh tokens for session renewal
2. **Secure Cookies**: Refresh tokens stored in httpOnly, secure cookies
3. **Password Hashing**: All passwords hashed with bcrypt
4. **CORS Protection**: Configured to allow only specific origins
5. **Role-based Access**: Different permissions for different user roles
6. **Automatic Token Refresh**: Transparent token renewal on API calls

## Role Permissions

### Admin

- Full system access
- User management
- All features and reports

### Warden

- Student management
- Attendance tracking
- Basic reports

### Accountant

- Financial management
- Payment tracking
- Financial reports

### Kitchen Staff

- Meal planning
- Inventory management
- Kitchen reports

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the frontend URL is in `allowedOrigins.js`
2. **Token Expiry**: The system automatically refreshes tokens
3. **Database Connection**: Check MongoDB connection string in `.env`
4. **Port Conflicts**: Ensure ports 5001 (backend) and 5173 (frontend) are available

### Debug Mode

To enable debug logging, set `NODE_ENV=development` in your backend `.env` file.

## Next Steps

1. Implement password reset functionality
2. Add email verification
3. Implement session management
4. Add audit logging
5. Implement rate limiting
6. Add two-factor authentication
