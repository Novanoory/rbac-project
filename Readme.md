# 🔐 RBAC Project — User & Admin Management API

A backend REST API built with **Node.js, Express.js, MongoDB, Mongoose, JWT, and bcrypt** to demonstrate authentication and Role-Based Access Control (RBAC).

The project contains two roles:

- 👤 **User**
- 👑 **Admin**

Users can register, log in, and view their profile, while admins have additional permissions such as viewing all users, deleting users, and changing user roles.

---

## 🚀 Features

### Authentication
- User Signup
- User Login
- Password hashing with bcrypt
- Password comparison with bcrypt
- JWT token generation
- JWT token verification
- Protected routes
- User identification using `req.user`

### Authorization / RBAC
- User and Admin roles
- Admin-only middleware
- Role validation
- Admin-only routes
- `401 Unauthorized` handling
- `403 Forbidden` handling

### User Management
- View own profile
- View all users
- Delete users
- Change user roles

### Security
- Passwords are hashed before storing
- Password is excluded from returned user data
- JWT secret stored in environment variables
- `.env` excluded from Git

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| bcrypt | Password hashing |
| JSON Web Token | Authentication |
| dotenv | Environment variables |
| Postman | API testing |
| Nodemon | Development server |

---

## 📁 Project Structure

```text
rbac-project/
│
├── App/
│   ├── controllers/
│   │   └── userController.js
│   │
│   ├── models/
│   │   └── userModel.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   └── route/
│       └── routes.js
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md


  ⚙️ Installation
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/rbac-project.git

Move into the project:

cd rbac-project
2. Install dependencies
npm install
3. Create .env

Create a .env file in the root directory:

PORT=3000


MONGO_URI=mongodb://127.0.0.1:27017/rbac-project


JWT_SECRET=your_secret_key

If you are using MongoDB Atlas, replace MONGO_URI with your MongoDB Atlas connection string.

4. Start the server

For development:

npm run dev

Or:

npm start

You should see:

MongoDB connected
Server running on port 3000
🔑 Authentication Flow

The authentication flow works like this:

User
 ↓
Signup
 ↓
Password hashed with bcrypt
 ↓
User saved in MongoDB
 ↓
Login
 ↓
Password compared with bcrypt
 ↓
JWT generated
 ↓
Token sent to client

For protected requests:

Client
 ↓
JWT Token
 ↓
Authorization Header
 ↓
authMiddleware
 ↓
jwt.verify()
 ↓
req.user = decoded
 ↓
Controller
👑 Authorization / RBAC Flow

Authentication answers:

Who are you?

Authorization answers:

What are you allowed to do?

The project uses two roles:

user
admin

The flow is:

Request
   ↓
authMiddleware
   ↓
JWT valid?
   ↓
req.user
   ↓
adminMiddleware
   ↓
Is role admin?
   ↓
YES → Controller
NO  → 403 Forbidden
👤 User Model

The user model contains:

{
    name,
    email,
    password,
    role
}

The role is restricted using Mongoose enum:

role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
}

Therefore only these roles are allowed:

user
admin

New users automatically receive:

role = user
🔐 Password Security

Passwords are never stored as plain text.

During signup:

const hashedPassword = await bcrypt.hash(password, 10);

The hashed password is stored in MongoDB.

During login:

const passwordMatch = await bcrypt.compare(
    password,
    user.password
);

This verifies whether the entered password matches the stored hash.

🎫 JWT

After successful login, the server creates a JWT:

const token = jwt.sign(
    {
        userId: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

The JWT contains:

userId
role

The secret key is stored inside .env.

🛡️ Authentication Middleware

The authentication middleware:

Gets the Authorization header
Extracts the JWT
Verifies the JWT
Gets the decoded information
Stores it in req.user
Allows the request to continue

Example:

const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);


req.user = decoded;


next();
👑 Admin Middleware

The admin middleware checks the user's role:

if (req.user.role !== "admin") {
    return res.status(403).send({
        status: 0,
        message: "Access denied. Admin only."
    });
}


next();

If the user is not an admin:

403 Forbidden

If the user is an admin:

Request continues
📡 API Endpoints

Base URL:

http://localhost:3000/api/users
1. Signup
POST /signup

Request body:

{
    "name": "Ali",
    "email": "ali@gmail.com",
    "password": "123456"
}

Example:

POST http://localhost:3000/api/users/signup
2. Login
POST /login

Request body:

{
    "email": "ali@gmail.com",
    "password": "123456"
}

Example:

POST http://localhost:3000/api/users/login

Successful response:

{
    "status": 1,
    "message": "Login successful",
    "token": "JWT_TOKEN"
}
3. View Profile

Requires authentication.

GET /profile

Example:

GET http://localhost:3000/api/users/profile

Header:

Authorization: Bearer YOUR_TOKEN
4. Get All Users

Requires:

Valid JWT
Admin role
GET /all

Example:

GET http://localhost:3000/api/users/all

Header:

Authorization: Bearer ADMIN_TOKEN
5. Delete User

Requires:

Valid JWT
Admin role
DELETE /delete/:id

Example:

DELETE http://localhost:3000/api/users/delete/USER_ID

Header:

Authorization: Bearer ADMIN_TOKEN
6. Change User Role

Requires:

Valid JWT
Admin role
PATCH /role/:id

Example:

PATCH http://localhost:3000/api/users/role/USER_ID

Request body:

{
    "role": "admin"
}

Only these roles are accepted:

user
admin
📊 Authorization Table
Endpoint	Authentication	Admin
/signup	❌	❌
/login	❌	❌
/profile	✅	❌
/all	✅	✅
/delete/:id	✅	✅
/role/:id	✅	✅
❌ HTTP Status Codes
400 — Bad Request

Used when the request contains invalid data.

Example:

Invalid role
401 — Unauthorized

Used when authentication fails.

Examples:

Token missing
Invalid token
Expired token
403 — Forbidden

The user is authenticated but does not have permission.

Example:

Normal user trying to access admin route
404 — Not Found

The requested user/resource doesn't exist.

Example:

User not found
500 — Server Error

Used when an unexpected server/database error occurs.

🧪 Testing

The API can be tested using Postman.

Recommended testing order:

1. Signup
   ↓
2. Login
   ↓
3. Copy JWT
   ↓
4. Test /profile
   ↓
5. Test admin route as normal user
   ↓
6. Receive 403 Forbidden
   ↓
7. Change user's role to admin
   ↓
8. Login again
   ↓
9. Test admin route
   ↓
10. Access granted
🔒 Environment Variables

The following variables are used:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Never commit .env to GitHub.

The .gitignore contains:

node_modules
.env
📚 Concepts Learned

This project demonstrates:

REST API
Express routing
MVC structure
MongoDB
Mongoose
CRUD operations
Password hashing
bcrypt
JWT authentication
Authentication middleware
Authorization middleware
Role-Based Access Control
Protected routes
HTTP status codes
Environment variables
API testing with Postman
🔄 Complete Project Workflow
                    ┌──────────────┐
                    │    Client    │
                    └──────┬───────┘
                           │
                           ▼
                    Signup / Login
                           │
                           ▼
                    Express Route
                           │
                           ▼
                     Controller
                           │
                           ▼
                     MongoDB
                           │
                           ▼
                       JWT Token
                           │
                           ▼
                 Authorization Header
                           │
                           ▼
                  Authentication Middleware
                           │
                           ▼
                     jwt.verify()
                           │
                           ▼
                       req.user
                           │
                           ▼
                   Admin Middleware
                           │
                  ┌────────┴────────┐
                  │                 │
                user              admin
                  │                 │
                  ▼                 ▼
                403              Controller
                                │
                                ▼
                             Response
🎯 Future Improvements

Possible future improvements include:

Input validation
Centralized error handling
Refresh tokens
Email verification
Password reset
Rate limiting
Helmet security
CORS configuration
File uploads
Pagination
Search and filtering
MongoDB relationships
Unit and integration testing
API documentation
Deployment to AWS/Render/Railway
👨‍💻 Author

Noor Ul Ain

BS Software Engineering Student

⭐ Project Purpose

This project was created as a learning project to understand JWT authentication and Role-Based Access Control (RBAC) using Node.js, Express.js, and MongoDB.