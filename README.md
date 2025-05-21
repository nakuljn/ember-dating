# Emberly 🔥

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-v0.71.8-blue.svg)](https://reactnative.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95.1-green.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0-green.svg)](https://www.mongodb.com/)

## A Fair Dating App for Meaningful Connections

Emberly is a dating app built on a simple principle: **you get visibility proportional to your engagement**. Your profile is shown to others only as many times as you like other profiles, creating a balanced ecosystem that encourages meaningful interactions.

<!--- ![Emberly App Banner](docs/assets/banner_placeholder.png) -->

## 🌟 Core Features

- **Fair Visibility Model**: Get shown to as many people as profiles you like
- **Balanced Matching**: Daily swipe cap promotes quality over quantity
- **Who Liked You**: See who's interested before you decide
- **Real-Time Chat**: Connect instantly with your matches
- **Minimalist Design**: Clean, intuitive interface focused on what matters

## 🚀 Why Emberly?

Most dating apps suffer from severe visibility imbalances, where a small percentage of users receive most of the attention. Emberly solves this by creating an ecosystem where visibility is earned through participation, not determined by algorithms that reinforce existing patterns.

## 💻 Tech Stack

### Frontend
- React Native with Expo
- Redux for state management
- React Navigation
- React Native Elements

### Backend
- FastAPI (Python)
- MongoDB
- WebSockets for real-time chat
- Firebase Authentication
- AWS S3 for image storage

## 📋 Development Status

This project is currently in MVP development phase. We're building core functionality first with a focus on the unique visibility algorithm and essential features.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)
- MongoDB (local or Atlas)
- Firebase project
- AWS S3 bucket

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/emberly.git
cd emberly

# Set up Python environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (copy from .env.example)
cp .env.example .env
# Edit .env with your credentials

# Run the development server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

## 📱 App Structure

```
emberly/
├── frontend/                    # React Native app
├── backend/                     # FastAPI server
├── docs/                        # Documentation
└── README.md                    # This file
```

See the [Design Document](docs/DesignDoc.md) for detailed architecture information.

## 🧪 Testing

We follow test-driven development practices:

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📸 Screenshots

![Swiping Interface](docs/assets/screenshot1_placeholder.png)
![Matches Screen](docs/assets/screenshot2_placeholder.png)
![Chat Interface](docs/assets/screenshot3_placeholder.png)

## 🔮 Roadmap

- [ ] Core backend implementation
- [ ] Mobile app foundation
- [ ] Key features development
- [ ] UI/UX polish
- [ ] Beta testing
- [ ] Initial launch

## Future Enhancements

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Design Principles

- **Simplicity**: Prioritize core functionality over feature bloat.
- **Fairness**: Ensure equitable visibility based on user engagement.
- **Fast Iteration**: Focus on rapid development and feedback.
- **Intentionality**: Encourage meaningful interactions through limited swipes.

## 🙏 Acknowledgements

- [React Native](https://reactnative.dev/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [MongoDB](https://www.mongodb.com/)
- [Firebase](https://firebase.google.com/)
- [AWS](https://aws.amazon.com/)
