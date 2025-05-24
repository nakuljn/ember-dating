# Emberly - MVP Dating App

Emberly is a dating app MVP built around fairness in visibility. Its core principle ensures that a user's profile is shown to as many people as the number of profiles they actively like, promoting meaningful engagement and eliminating imbalances common in swipe-based platforms.

## Core Value Proposition

- **Equal Opportunity**: Every user gets visibility proportional to their engagement
- **Quality Over Quantity**: Limited daily swipes encourage thoughtful decisions
- **Meaningful Connections**: Focus on mutual interest rather than endless swiping

## Features

- **Fair Visibility Model**: A user's profile is displayed to others only as many times as they like other profiles (e.g., like 8 profiles, get shown to 8 users).
- **Swipe-Based Matching**: Users can like or dislike one profile at a time with a daily swipe cap (e.g., 8 swipes).
- **Who Liked You**: View profiles of users who liked you and reciprocate to create matches.
- **Real-Time Chat**: Engage in text-based conversations with matches via WebSockets.
- **Simple Authentication**: Login via Google, Apple, or mobile number using Firebase Auth / Google OAuth2.
- **Minimal Settings**: Basic user info, logout, and app version display.

## Tech Stack

- **Frontend**: 
  - React Native (Expo managed workflow for faster development)
  - Redux for state management
  - React Navigation for screen transitions
  - React Native Elements for UI components
  
- **Backend**: 
  - FastAPI (Python) for RESTful API endpoints
  - Pydantic for data validation
  - Pytest for backend testing
  
- **Database**: 
  - MongoDB (NoSQL) - Atlas cloud service
  - Mongoose for schema management
  
- **Authentication**: 
  - Firebase Auth for social login
  - JWT for session management
  
- **Real-Time Chat**: 
  - WebSockets over FastAPI
  - Message queue for reliability
  
- **Storage**: 
  - AWS S3 for profile photos
  - Image optimization pipeline
  
- **DevOps**:
  - Docker for containerization
  - GitHub Actions for CI/CD

## Project Structure

```
emberly-mvp/
├── frontend/                    # React Native frontend code
│   ├── src/
│   │   ├── assets/              # Images, fonts, etc.
│   │   ├── components/          # Reusable UI components
│   │   ├── screens/             # App screens
│   │   ├── navigation/          # Navigation configuration
│   │   ├── services/            # API clients and services
│   │   ├── store/               # Redux state management
│   │   └── utils/               # Helper functions
│   ├── tests/                   # Frontend tests
│   └── app.json                 # Expo configuration
│
├── backend/                     # FastAPI backend code
│   ├── app/
│   │   ├── api/                 # API route definitions
│   │   ├── core/                # Core application setup
│   │   ├── services/            # Business logic
│   │   │   ├── auth.py          # Authentication logic
│   │   │   ├── profile.py       # Profile management
│   │   │   ├── swipe.py         # Swipe and matching logic
│   │   │   └── chat.py          # Chat functionality
│   │   ├── models/              # MongoDB schemas
│   │   └── utils/               # Helper utilities
│   ├── tests/                   # Test scripts and seed data
│   └── main.py                  # Application entry point
│
├── docs/                        # Architecture and design documents
└── README.md                    # Project overview
```

## Data Models

### User
```json
{
  "id": "string (UUID)",
  "email": "string",
  "phone": "string (optional)",
  "auth_provider": "enum (google|apple|phone)",
  "created_at": "datetime",
  "last_active": "datetime"
}
```

### Profile
```json
{
  "user_id": "string (ref: User.id)",
  "name": "string",
  "birthdate": "date",
  "gender": "string",
  "interested_in": ["string"],
  "bio": "string",
  "photos": ["string (S3 URLs)"],
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "likes_given": "integer (daily resets)",
  "likes_received": "integer (daily resets)",
  "daily_swipe_limit": "integer (default: 8)",
  "total_matches": "integer"
}
```

### Match
```json
{
  "id": "string (UUID)",
  "users": ["string (ref: User.id)"],
  "created_at": "datetime",
  "last_message_at": "datetime (optional)"
}
```

### Message
```json
{
  "id": "string (UUID)",
  "match_id": "string (ref: Match.id)",
  "sender_id": "string (ref: User.id)",
  "content": "string",
  "sent_at": "datetime",
  "read_at": "datetime (optional)"
}
```

## API Endpoints

### Authentication
- `POST /auth/login`: Authenticate via Firebase/Google OAuth2.
  - Request: `{ "token": "firebase_id_token" }`
  - Response: `{ "access_token": "jwt", "user": User }`
- `POST /auth/register`: Create a new user account.
  - Request: `{ "token": "firebase_id_token", "profile": Profile }`
  - Response: `{ "access_token": "jwt", "user": User, "profile": Profile }`

### Profile
- `GET /profile`: Retrieve current user profile.
  - Response: `{ "profile": Profile }`
- `PUT /profile`: Update user profile.
  - Request: `{ "profile": Partial<Profile> }`
  - Response: `{ "profile": Profile }`
- `POST /profile/photos`: Upload profile photo.
  - Request: Multipart form with image file
  - Response: `{ "url": "string (S3 URL)" }`

### Swipe
- `GET /profiles/discover`: Get profiles to swipe on.
  - Response: `{ "profiles": Profile[], "remaining_swipes": integer }`
- `POST /swipe`: Like or dislike a profile.
  - Request: `{ "profile_id": "string", "action": "like|dislike" }`
  - Response: `{ "match": Match (if created) or null, "remaining_swipes": integer }`

### Likes & Matches
- `GET /likes/received`: Fetch profiles of users who liked you.
  - Response: `{ "profiles": Profile[] }`
- `GET /matches`: Get all matches.
  - Response: `{ "matches": Match[] with Profile data }`

### Chat
- `GET /matches/{match_id}/messages`: Get messages for a match.
  - Response: `{ "messages": Message[] }`
- `WebSocket /ws/chat/{user_id}`: Real-time messaging.
  - Events:
    - `message`: New message received
    - `read_receipt`: Message read status update

## Development Roadmap

### Phase 1: Core Backend (Days 1-4)
- Set up project structure and database
- Implement authentication system
- Build profile management
- Create swipe and matching algorithm
- Develop chat functionality

### Phase 2: Mobile App Foundation (Days 5-6)
- Set up React Native project
- Implement navigation and basic screens
- Build authentication flow
- Create profile creation and editing

### Phase 3: Key Features (Days 7-9)
- Develop profile discovery and swipe interface
- Implement visibility algorithm
- Build matches view
- Create real-time chat functionality

### Phase 4: Polish & Launch (Day 10)
- Optimize performance
- Implement error handling
- Add analytics
- Prepare for testing deployment

## Testing Strategy

- **Unit Tests**: Test individual components and services
- **Integration Tests**: Verify API endpoints and data flow
- **End-to-End Tests**: Test complete user journeys
- **Performance Tests**: Verify app responsiveness and backend scalability

## Limitations

- No push notifications.
- No AI-driven matching or profile verification.
- No multimedia (images/videos) in chats.
- No undo or premium features.
- Basic onboarding without complex filters.

## Future Enhancements (Post-MVP)

- Push notifications for matches and messages
- Advanced profile filtering (interests, hobbies, etc.)
- AI-based profile recommendations
- Premium features (unlimited swipes, undo, profile boosts)
- Social games for organic connections
- Video chat integration
- Content moderation system
- Advanced analytics and insights

## Technical Considerations

- **Scalability**: MongoDB sharding for horizontal scaling
- **Security**: Input validation, rate limiting, and JWT best practices
- **Privacy**: Data minimization and proper encryption
- **Performance**: Image optimization and lazy loading
- **Offline Support**: Basic functionality without connectivity

## Design Principles

- **Simplicity**: Prioritize core functionality over feature bloat.
- **Fairness**: Ensure equitable visibility based on user engagement.
- **Fast Iteration**: Focus on rapid development and feedback.
- **Intentionality**: Encourage meaningful interactions through limited swipes.
- **Minimalism**: Clean, light-colored UI with intuitive interactions.

## Contributing

Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.
