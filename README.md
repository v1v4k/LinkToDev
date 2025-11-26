# LinkToDev Backend

LinkToDev is a developer discovery and connection backend.  
Users can browse other developers, express interest or ignore them, review incoming connection requests, view accepted connections, search users, and access chat history.

Built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.

---

## Environment Variables

Create a `.env` file:

```
MONGO_URL=<mongodb-connection-string>
JWT_SECRET=<jwt-secret>
PORT=8000
```

---

## Installation & Running

Install dependencies:
```
npm install
```

Start in production mode:
```
npm run start
```

Start in development mode (nodemon):
```
npm run dev
```

---

# API Endpoints

Below are the actual API routes implemented in the backend.

---

# Auth Router

```
POST /signup
POST /login
POST /logout
```

---

# Profile Router

```
GET    /profile
PATCH  /profile/edit
PATCH  /profile/password
```

---

# Request Router

### Send Connection Request / Ignore
```
POST /sendConnectionRequest/:status/:toUserId
```
Allowed `status`:
```
interested    → send a connection request  
ignored       → remove user from feed  
```

---

### Review Incoming Request (Accept / Reject)
```
POST /request/review/:status/:requestId
```
Allowed `status`:
```
accepted      → becomes a connection  
rejected      → decline the request  
```

---

### Received Requests
```
GET /user/requests/received
```

---

### Accepted Connections
```
GET /user/connections
```

---

# User Router

### Developer Feed  
Returns users the logged-in user has **not interacted with**.
```
GET /user/feed
```
Feed excludes:
- users already connected  
- users ignored  
- users with pending requests  
- the logged-in user  

---

### Search Users
```
GET /user/search?query=<firstName>
```

---

# Chat Router

### Chat History With a Connected User
```
GET /chat/:targetUserId
```

---

## Notes

- All routes except signup/login/logout require:
  ```
  Authorization: Bearer <token>
  ```
- `interested` creates a pending request.
- `ignored` permanently removes a user from feed.
- Only the receiver can `accept` or `reject` a request.
- Only accepted connections can chat.

