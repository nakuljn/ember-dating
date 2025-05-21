# Emberly - MVP Dating App

Emberly is a dating app MVP built around fairness in visibility. Its core principle ensures that a user's profile is shown to as many people as the number of profiles they actively like, promoting meaningful engagement and eliminating imbalances common in swipe-based platforms.

## Features

- **Fair Visibility Model**: A user's profile is displayed to others only as many times as they like other profiles (e.g., like 8 profiles, get shown to 8 users).
- **Swipe-Based Matching**: Users can like or dislike one profile at a time with a daily swipe cap (e.g., 8 swipes).
- **Who Liked You**: View profiles of users who liked you and reciprocate to create matches.
- **Real-Time Chat**: Engage in text-based conversations with matches via WebSockets.
- **Simple Authentication**: Login via Google, Apple, or mobile number using Firebase Auth / Google OAuth2.
- **Minimal Settings**: Basic user info, logout, and app version display.

## Tech Stack

- **Frontend**: React Native
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (NoSQL)
- **Authentication**: Firebase Auth / Google OAuth2
- **Real-Time Chat**: WebSockets over FastAPI
- **Storage**: AWS S3 for profile photos

## Project Structure

```
emberly-mvp/
├── frontend/               # React Native frontend code
├── backend/                # FastAPI backend code
│   ├── services/           # Authentication, Profile, Swipe, Matching, Chat
│   ├── models/             # MongoDB schemas
│   └── tests/              # Test scripts and seed data
├── docs/                   # Architecture and design documents
└── README.md               # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)
- MongoDB (local or Atlas)
- Firebase project (for authentication)
- AWS account (for S3 photo storage)

### Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn pymongo python-jose[cryptography] passlib[bcrypt] python-multipart
   ```
3. Set up environment variables in a `.env` file:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/emberly
   FIREBASE_API_KEY=<your-firebase-api-key>
   AWS_ACCESS_KEY_ID=<your-aws-access-key>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
   AWS_S3_BUCKET=<your-s3-bucket>
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Firebase in `frontend/src/config/firebase.js` with your Firebase credentials.
4. Start the React Native app:
   ```bash
   npm run start
   ```
5. Run on iOS or Android simulator:
   ```bash
   npm run ios
   # or
   npm run android
   ```

### Database Setup
1. Ensure MongoDB is running locally or use a MongoDB Atlas cluster.
2. Seed the database with dummy profiles:
   ```bash
   python backend/tests/seed_db.py
   ```

## API Endpoints

- **Authentication**:
  - `POST /auth/login`: Authenticate via Firebase/Google OAuth2.
  - `POST /auth/register`: Create a new user account.
- **Profile**:
  - `GET /user/profile`: Retrieve user profile data.
- **Swipe**:
  - `POST /swipe`: Like or dislike a profile (updates `likes_given` and `likes_received`).
- **Who Liked You**:
  - `GET /likes/received`: Fetch profiles of users who liked you.
- **Chat**:
  - `GET /chats`: Retrieve all chat conversations.
  - WebSocket: `/ws/chat/{userId}` for real-time messaging.

## Testing

- Run the seed script to generate 50 dummy profiles:
  ```bash
  python backend/tests/seed_db.py
  ```
- Manually test:
  - Swipe cap enforcement.
  - Visibility rule (profile shown only to as many users as liked).
  - Chat initiation after mutual likes.
- Use Postman or similar tools to test API endpoints.

## Limitations

- No push notifications.
- No AI-driven matching or profile verification.
- No multimedia (images/videos) in chats.
- No undo or premium features.
- Basic onboarding without complex filters.

## Future Enhancements

- Advanced profile filtering and discovery.
- AI-based matchmaking.
- Push notifications and reminders.
- Premium features (e.g., undo, profile boosts).
- Social games for organic connections.

## Design Principles

- **Simplicity**: Prioritize core functionality over feature bloat.
- **Fairness**: Ensure equitable visibility based on user engagement.
- **Fast Iteration**: Focus on rapid development and feedback.
- **Intentionality**: Encourage meaningful interactions through limited swipes.

## Contributing

Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.
