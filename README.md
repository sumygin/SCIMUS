# SCIMUS

A study site for secondary school students. Questions are recommended based on how you have been getting on with each subject, and there are collections, comments, a study timer and leaderboards to keep revision going.

Live at https://scimus.onrender.com

## What's in it

- **Question bank** – past paper style and user-made questions with mark schemes, searchable by stage, subject, topic, paper and year. Maths is written in LaTeX.
- **Recommendations** – every subject keeps an ability rating for you and a difficulty rating for each question. Both move a little every time you interact with a question, and the next questions are picked from just above, at and just below your level.
- **Collections** – save questions into your own lists and share them.
- **Comments and inbox** – discuss questions, reply to each other, get notified.
- **Study timer and leaderboards** – time studied, questions solved, questions written and likes, by school and country.

## How it's built

| Part | What it is |
| --- | --- |
| `code/app.js` | Express setup, security middleware, startup |
| `code/routes.js` | All pages and API routes |
| `code/database.js` | Mongoose models |
| `code/model.py` | Small FastAPI service that does the rating maths |
| `code/public/` | The pages themselves, plain HTML/CSS/JS |
| `code/insert/` | Scripts that fill a database with subjects, topics and sample questions |

Sessions are stored in MongoDB and passwords are hashed with bcrypt.

## Running it locally

You need Node 20+, Python 3.10+ and MongoDB running on the default port.

```bash
npm install
```

```bash
pip install -r code/requirements.txt
```

```bash
npm run seed
```

```bash
npm start
```

The site is then on http://localhost:3000. Node starts the Python service for you on port 8000.

`npm run seed` wipes and refills the subjects, topics, schools and questions, so it refuses to touch a database that isn't local unless you run it with `SEED_CONFIRM=yes`.

## Deploying

The site runs as two services: the Node app and the Python model.

**Node app** – build with `npm install`, start with `npm start`.

| Variable | |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Long random string. Without it a temporary one is made on every start, which logs everyone out |
| `MODEL_URL` | Address of the Python service |
| `MODEL_KEY` | Optional. If set on both services the model only answers the Node app |
| `NODE_ENV` | `production` (set automatically on Render) |

**Python model** – install `code/requirements.txt`, start from the `code` folder with `uvicorn model:app --host 0.0.0.0 --port $PORT`.

## License

MIT
