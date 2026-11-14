# SCIMUS

A full-stack collaborative study platform for secondary school students featuring adaptive, ML-driven practice question recommendations and social learning tools.

## Overview

`SCIMUS` combines a structured question bank with a personalised recommendation engine that adapts to each student's topical strengths and weaknesses. Built with **Node.js** and **MongoDB**, it tracks granular user performance across subjects to serve targeted practice problems alongside peer progression features.

## Check it out

Live at https://scimus.onrender.com

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

### Recommendation Logic

For each user $u$ and candidate question $q$, SCIMUS computes a priority weight based on:
- **Mastery Deficit:** Lower historical accuracy on topic $T_q$ increases selection probability.
- **Difficulty Alignment:** Matches user ability rating $\theta_u$ against question difficulty $\beta_q$ to target the zone of proximal development.
- **Recency Penalty:** Suppresses recently attempted questions to ensure broad syllabus coverage.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or MongoDB Atlas URI)

## License

MIT
