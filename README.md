# LinkToDev — Backend API
The official backend service for **LinkToDev**, a developer networking platform.  
It handles developer discovery logic, connection management, authentication, and real-time chat via Socket.io.

![Backend Deploy](https://github.com/v1v4k/LinkToDev/actions/workflows/deploy.yml/badge.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green) 
🌍 **Live Application:** https://www.linktodev.com

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (HTTP-only cookies)
- **Real-time:** Socket.io

## 🔐 Environment Variables
Create a `.env` file in the root of the project:
```env
MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_secure_secret>
PORT=4444
```

## 🚀 Installation & Running
### 1. Install Dependencies
```bash
npm install
```
### 2. Start the Server
**Production Mode:**
```bash
npm run start
```
**Development Mode (Nodemon):**
```bash
npm run dev
```

## 📡 API Overview
All endpoints are served from this backend service.  
**Authentication Strategy:**
- JWT is issued upon login and stored in a secure **HTTP-only cookie**.
- Frontend requests must include `withCredentials: true` to pass the cookie.
- All request/response bodies are JSON unless stated otherwise.

## 🔌 Endpoints
### 🔐 Auth Router
| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/signup` | Create a new user account |
| `POST` | `/login` | Login and receive a JWT cookie |
| `POST` | `/logout` | Clear the session cookie |
### 👤 Profile Router
| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/profile` | Get current logged-in user data |
| `PATCH` | `/profile/edit` | Update profile details (skills, bio, etc.) |
| `PATCH` | `/profile/password`| Change account password |
### 🔗 Request Router
| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/sendConnectionRequest/:status/:toUserId` | Send request (`interested`) or ignore (`ignored`) |
| `POST` | `/request/review/:status/:requestId` | Review request (`accepted` or `rejected`) |
**Status Rules:**
- `interested`: Sends a connection request.
- `ignored`: Permanently removes the user from your feed.
- `accepted`: Approve request and create a connection.
- `rejected`: Decline the request.
- *Note: Only the receiver can review a request.*
### 🧑‍💻 Users & Discovery (`/user`)
| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/user/feed` | Get potential connections (excludes connected/ignored users) |
| `GET` | `/user/search` | Search users by first name (`?query=Name`) |
| `GET` | `/user/connections` | List all accepted connections |
| `GET` | `/user/requests/received` | List pending incoming requests |
### 💬 Chat Router
| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/chat/:targetUserId` | Fetch chat history with a specific connection |

## ⚡ Real-time Events (Socket.io)
The backend runs a Socket.io server alongside Express to handle instant messaging.
**Events:**
- `joinChat`: Client emits this to join a specific room (based on userId).
- `sendMessage`: Client emits a message payload.
- `messageReceived`: Server broadcasts the message to the recipient instantly.

## 🚢 Deployment Architecture
The backend is hosted on **Google Cloud Platform (GCP)** with isolated environments for Staging and Production.
### Environments
- **Staging (`dev`):** An isolated instance for testing new features before release.
- **Production (`main`):** The live environment serving real user traffic.
### Server Configuration
Both environments follow this architecture:
- **Web Server:** Nginx (Reverse Proxy handling SSL & forwarding traffic).
- **Process Management:** PM2 ensures the Node.js process stays alive.
```bash
# PM2 process list example
pm2 list
# │ id │ name                │ status  │ uptime │ memory      │
# │ 0  │ linktodev-prod      │ online  │ 24h    │ 150mb       │
# │ 1  │ linktodev-staging   │ online  │ 2h     │ 120mb       │
```

## 🔁 CI/CD Pipeline
Automated deployments via **GitHub Actions**.
| Branch | Environment | Strategy |
|:---:|:---:|:---|
| `dev` | Staging | **Auto-deploy** to test server |
| `main` | Production | **Manual Approval** -> Deploy to Prod |

