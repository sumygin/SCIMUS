# SCIMUS

A full-stack collaborative study platform for secondary school students featuring adaptive, ML-driven practice question recommendations and social learning tools.

## Overview

`SCIMUS` combines a structured question bank with a personalised recommendation engine that adapts to each student's topical strengths and weaknesses. Built with **Node.js** and **MongoDB**, it tracks granular user performance across subjects to serve targeted practice problems alongside peer progression features.

## Key Features

- **ML Question Recommendation Engine:** Scores and selects practice questions dynamically based on historical accuracy, topic decay, and question difficulty ratings.
- **Structured Question Bank:** Categorised secondary school curriculum problems with instant marking and step-by-step worked solutions.
- **Performance Analytics:** Tracks per-topic mastery, streak history, and response times stored in MongoDB document schemas.
- **Social & Peer Features:** Shared study groups, leaderboards, and peer progress tracking to keep revision engaging.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)
- **Recommendation Pipeline:** Custom collaborative/content-based scoring model
- **Authentication:** Session / JWT-based user authentication

## System Architecture

```text
scimus/
├── src/
│   ├── config/          # Database and environment configuration
│   ├── controllers/     # Route handlers for auth, questions, and social feeds
│   ├── models/          # Mongoose schemas (User, Question, Attempt, Group)
│   ├── recommender/     # ML scoring and question selection logic
│   ├── routes/          # Express API endpoints
│   └── public/          # Frontend assets and client scripts
├── .env.example
├── package.json
└── server.js
```

### Recommendation Logic

For each user $u$ and candidate question $q$, SCIMUS computes a priority weight based on:
- **Mastery Deficit:** Lower historical accuracy on topic $T_q$ increases selection probability.
- **Difficulty Alignment:** Matches user ability rating $\theta_u$ against question difficulty $\beta_q$ to target the zone of proximal development.
- **Recency Penalty:** Suppresses recently attempted questions to ensure broad syllabus coverage.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or MongoDB Atlas URI)

### Installation

```bash
# Clone the repository
git clone https://github.com/sumygin/scimus.git
cd scimus

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/scimus
SESSION_SECRET=your_secret_key
```

### Running the Application

```bash
# Run in development mode
npm run dev

# Start production server
npm start
```

## License

MIT
