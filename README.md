# 🚀 LinkToDev — Backend API

Backend API powering **LinkToDev**, a developer networking platform designed to help developers discover, connect, collaborate, and grow together.

![Backend Deploy](https://github.com/v1v4k/LinkToDev/actions/workflows/deploy.yml/badge.svg)
![Node](https://img.shields.io/badge/node-22-green)
![Docker](https://img.shields.io/badge/docker-containerized-blue)
![MongoDB](https://img.shields.io/badge/database-mongodb-green)
![AWS](https://img.shields.io/badge/cloud-aws-orange)

🌍 **Live:** https://www.linktodev.com

---

## ✨ Features

| Feature | Description |
|:---|:---|
| 🔐 Authentication | Email/password + GitHub OAuth + JWT (HTTP-only cookies) |
| 👤 Profiles | Create, edit, skills, bio, photo |
| 🤝 Connections | Send, accept, reject requests + status tracking |
| 💬 Real-time Chat | Socket.io one-to-one messaging + online presence |
| 💳 Payments | Stripe checkout + webhook handling |
| 🛡️ Security | Helmet, rate limiting, CORS, bcrypt, non-root Docker |
| 📈 Observability | Winston + Morgan logging, health check endpoint |

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Runtime | Node.js 22 |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + GitHub OAuth (Passport.js) |
| Real-Time | Socket.io |
| Payments | Stripe |
| Logging | Winston + Morgan |
| Security | Helmet + express-rate-limit |
| Containerization | Docker (multi-stage build) |
| Registry | AWS ECR |
| Reverse Proxy | Nginx |
| Cloud | AWS EC2 |
| CI/CD | GitHub Actions |

---

## 📂 Project Structure

```plaintext
src/
├── config/          → database, passport
├── controllers/     → request handlers
├── services/        → business logic
├── models/          → mongoose schemas
├── routes/          → express routers
├── middlewares/     → auth, validation
├── helper/          → utility functions
├── utils/           → logger, socket, cron
└── app.js           → entry point
```

---

## 🔐 Environment Variables

```env
# Server
PORT_NO=4444
NODE_ENV=production
FRONTEND_URL=

# Database
MONGO_URI=

# JWT
JWT_SECRET=

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 🚀 Running Locally

### With Docker (recommended)

```bash
docker build -t linktodev-backend .
docker run -p 4444:4444 --env-file .env linktodev-backend
```

### Without Docker

```bash
npm install
npm run dev
```

---

## 📡 API Reference

### 🔐 Auth

| Method | Endpoint | Description |
|:---:|:---|:---|
| POST | /signup | Register user |
| POST | /login | Login — returns JWT cookie |
| POST | /logout | Clear session |
| GET | /auth/github | GitHub OAuth |
| GET | /auth/github/callback | OAuth callback |

### 👤 Profile

| Method | Endpoint | Description |
|:---:|:---|:---|
| GET | /profile | Get logged-in user |
| PATCH | /profile/edit | Update profile |
| PATCH | /profile/password | Change password |

### 🤝 Connections

| Method | Endpoint | Description |
|:---:|:---|:---|
| POST | /sendConnectionRequest/:status/:toUserId | Send/ignore request |
| POST | /request/review/:status/:requestId | Accept/reject request |
| GET | /user/connection-status/:userId | Get connection status |

### 👨‍💻 Users

| Method | Endpoint | Description |
|:---:|:---|:---|
| GET | /user/feed | Get potential connections |
| GET | /user/search | Search by name |
| GET | /user/connections | List connections |
| GET | /user/requests/received | Pending requests |
| GET | /user/:userId | Get user by ID |

### 💬 Chat

| Method | Endpoint | Description |
|:---:|:---|:---|
| GET | /chat/:targetUserId | Get chat history |

### 💳 Payments

| Method | Endpoint | Description |
|:---:|:---|:---|
| POST | /payment/create-checkout-session | Stripe checkout |
| POST | /api/webhook | Stripe webhook |

### 🏥 Health

| Method | Endpoint | Description |
|:---:|:---|:---|
| GET | /health | Server status, uptime, DB state, memory |

---

## 🔌 Socket Events

| Event | Direction | Description |
|:---|:---|:---|
| joinChat | Client → Server | Join private chat room |
| sendMessage | Client → Server | Send message |
| messageReceived | Server → Client | Receive message |
| getOnlineUsers | Server → Client | Online users list |

---

## 🛡️ Security

| Layer | Implementation |
|:---|:---|
| Headers | Helmet.js — sets secure HTTP headers |
| Rate Limiting | 100 req/15min (API), 10 req/15min (auth) |
| Authentication | JWT in HTTP-only cookies |
| Passwords | bcrypt hashing |
| CORS | Restricted to `FRONTEND_URL` |
| Container | Non-root user (`appuser`) |

---

## 📈 Observability

| Tool | Purpose |
|:---|:---|
| Morgan | HTTP request logging |
| Winston | Application event logging |
| /health | Server status endpoint |

```plaintext
logs/
├── error.log
└── combined.log
```

---

## 🚢 Deployment & CI/CD

Full deployment architecture, CI/CD pipeline, branch strategy, and rollback procedures are documented in the infrastructure repository.

👉 [LinkToDev Infrastructure](https://github.com/v1v4k/linktodev-infra)

---


## 📈 Future Improvements

- Google OAuth
- Redis Caching
- Swagger / OpenAPI Documentation
- Unit Tests (Jest) + Integration Tests (Supertest)
- AWS CloudWatch Monitoring
- Background Jobs (BullMQ / SQS)
- Notifications System

---

## 🔗 Related Repositories

| Repo | Description |
|:---|:---|
| [LinkToDev Frontend](https://github.com/v1v4k/LinkToDevWeb) | React frontend application |
| [LinkToDev Infrastructure](https://github.com/v1v4k/linktodev-infra) | Docker, Nginx, CI/CD configs |