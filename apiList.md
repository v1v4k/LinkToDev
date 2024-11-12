# APIs

## authRouter
- POST /sidnup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /resuest/send/interested/:userId
- POST /resuest/send/ignored/:userId
- POST /resuest/review/accepted/:requestId
- POST /resuest/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignore, interested, accepted, rejected