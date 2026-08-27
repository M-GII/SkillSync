# SkillSync

SkillSync is a full-stack job application tracker that helps users organize applications and evaluate how well their profile matches a job description using keyword matching, semantic similarity, and skill gap analysis.

## Features

- Track job applications across different stages
- Add job descriptions, skills, notes, salary, location, and job links
- Drag-and-drop application board
- Create and edit a user profile
- Analyze jobs against profile skills and profile summary
- Keyword-based skill matching
- Semantic similarity scoring
- Matched and missing skill detection
- Generated job-fit explanations
- Save analysis results for each job
- User authentication and user-specific data

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- dnd-kit

### Backend
- Next.js Server Actions
- MongoDB
- Mongoose
- Better Auth

### Analyzer
- Python
- FastAPI
- NumPy
- OpenAI embeddings

## Job Analysis

SkillSync combines multiple signals to evaluate how well a user's profile matches a job.

### Keyword Match

The analyzer compares the user's listed skills against skills detected in the job description.

It returns:

- Matched skills
- Missing skills
- Keyword match score

### Semantic Match

The analyzer compares the meaning of the user's profile summary with the job description using embeddings and cosine similarity.

This allows the system to recognize related experience even when the wording is different.

### Overall Match

The final score combines the keyword and semantic scores:

```text
Overall Match = 90% Keyword Match + 10% Semantic Match
```

The analysis is then saved to the job so it remains available after refreshing the page.

## Architecture

```
                    SkillSync
                        |
          +-------------+-------------+
          |                           |
          v                           v
   Next.js Frontend             FastAPI Analyzer
      Vercel                        Render
          |                           |
          |                           +--> Keyword Matching
          |                           |
          |                           +--> Semantic Similarity
          |                           |
          |                           +--> OpenAI Embeddings
          |
          v
     MongoDB Atlas
```

## Deployment

- Frontend: Vercel
- Analyzer API: Render
- Database: MongoDB Atlas

## Live Demo

https://skill-sync-gules-six.vercel.app

## Running Locally

Clone the repository:

```bash
git clone <your-repository-url>
cd SkillSync
```

### Frontend

Navigate to the Next.js application:

```bash
cd SkillSync
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```
MONGO_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_ANALYZER_API=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will run at:

```
http://localhost:3000
```

### Analyzer

From the repository root:

```bash
cd Analyzer
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```
OPENAI_API_KEY=your_openai_api_key
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

The analyzer will run at:

```
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```
http://127.0.0.1:8000/docs
```

## Project Structure

```
SkillSync/
├── Analyzer/
│   ├── main.py
│   ├── skill_matcher.py
│   ├── skill_library.py
│   ├── requirements.txt
│   └── .gitignore
│
├── SkillSync/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
└── README.md
```

## Environment Variables

### Next.js
```
MONGO_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
NEXT_PUBLIC_ANALYZER_API=
```

### FastAPI
```
OPENAI_API_KEY=
```

Never commit `.env` or `.env.local` files containing real credentials.

## Future Improvements
- Resume parsing
- More advanced skill extraction
- Improved semantic scoring
- Historical analysis comparisons
- Job recommendations
- Additional application analytics
- More detailed profile-based scoring
