
# 🛍️ E-Commerce API

This is a simple e-commerce REST API built with **Node.js**, **Express**, **MongoDB**, **JWT Authentication**, and documented using **Swagger**. The project is Dockerized using **Docker Compose** for easy setup and deployment.

---

## 🚀 Features

- User authentication (Register, Login, Refresh, Logout)
- JWT-based access/refresh tokens (stored in HTTP-only cookies)
- Product management (CRUD)
- Swagger API documentation
- Rate limiting for security
- MongoDB integration (cloud/local)
- Docker + Docker Compose support

---

## 📦 Tech Stack

- Node.js + Express
- MongoDB (local or cloud)
- Mongoose
- JWT for Auth
- Swagger for API Docs
- Docker + Docker Compose

---



## API Documentation

The swagger Documentation is available
[here](https://ecommerce-backend-917r.onrender.com/api-docs/)



## 🛠️ Setup Instructions

### 🐳 Using Docker Compose (Recommended)

> Requires: [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

1. Clone the repo:

```bash
git clone https://github.com/AbhishekSingh-22/e-commerce_backend.git
cd e-commerce_backend
```

2. Create a .env file from the template(.env.example)

3. Start the containers:
```bash
docker-compose up --build
```

4. Access the API:

- Backend: http://localhost:3000

- Swagger Docs: http://localhost:3000/api-docs


### 🧑‍💻 Local Development (Without Docker)

1. Install dependencies:
```bash
npm install
```

2. Set up environment variable in .env file using .env.example template

3. Run the app
```bash
npm run dev 
```



## 🔐 Auth Flow
- Access Token is returned via header
- Refresh Token is stored in HTTP-only cookies
- Refresh flow supports token rotation
- Rate limiting is applied to auth routes

## 🔄 Refresh Token Rotation
1. Upon login:
- Access + Refresh tokens are issued

2. On /refresh-token:
- Old token is revoked
- New refresh + access token are issued

3. Refresh token is stored as a cookie and in MongoDB

## 🐳 Docker Image (Optional)
If you want to pull the backend image directly from Docker Hub:
```bash
docker pull abhisheksingh2229/ecommerce_api
```

## 🔒 Rate Limiting
- Prevents brute force attacks
- Configurable via middleware
- Currently applied on auth routes


## Author

Made with ❤️ by [Abhishek Singh](https://github.com/AbhishekSingh-22)

