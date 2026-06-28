# PrepInt — AI-Powered Mock Interview Platform

PrepInt is a full-stack mock interview platform that uses voice AI to simulate real interview experiences. It handles everything from interview creation to conducting to feedback — entirely through voice, with no manual question-setting required.

---

## What It Does

Most mock interview tools give you a list of questions and a text box. PrepInt works differently:

- A **voice AI agent calls you** and asks what role, level, and tech stack you're preparing for — and creates a custom interview from that conversation
- A **second voice AI agent conducts the interview** in real time, asking questions and listening to your answers
- When the interview ends, your transcript is automatically sent to **Google Gemini**, which generates structured, scored feedback on your performance
- The platform also generates **AI study guides** — tiered by difficulty — that the community can upvote and share

---

## Core Flows

### 1. Interview Creation (Voice Agent)
- User navigates to `/create-interview` and starts a call
- A Vapi voice agent gathers interview preferences conversationally (role, level, tech stack, interview type)
- The agent creates the interview record in MongoDB directly via a Vapi workflow
- The new interview appears on the user's dashboard when the call ends

### 2. Interview Conducting (Voice Agent)
- User selects an interview and starts a call
- A second Vapi agent conducts the interview using pre-generated questions
- Live transcript messages are captured in real time via Vapi events (`call-start`, `call-end`, `message`, `speech-start`, `speech-end`)
- If the AI completes the interview naturally → feedback is auto-generated
- If the user ends the call early → they are redirected home with no feedback (clean UX decision)

### 3. AI Feedback Generation
- Transcript is sent to Google Gemini with a structured prompt
- Gemini returns scored feedback as JSON, validated with **Zod schemas**
- Feedback is saved to MongoDB and the user is redirected to `/feedbacks/:id`

### 4. AI Study Guide Generation (Notes)
- User fills a form: role, level, interview type, tech stack, company type, optional description
- Backend sends inputs to Gemini, which generates a **three-tier study guide**:
  - **Basic** — foundational concepts with short explanations
  - **Intermediate** — practical implementation details
  - **Advanced** — edge cases, optimisations, architectural thinking
- Each tier includes practice Q&A with model answers, what the interviewer evaluates, and common mistakes
- Notes are community-shared and ranked by **upvote ratio** (not raw count) using MongoDB aggregation

---

## Technical Highlights

**Dual JWT Auth System**
- Short-lived access token sent via `Authorization: Bearer` header
- Long-lived refresh token stored in `user.refreshTokens[]` array in MongoDB, sent via `x-refresh-token` header
- On each refresh: old token removed, new token added (rotation)
- Logout removes the refresh token; access token expires naturally
- Email verification uses the same JWT signing flow with a separate expiry

**Secrets Management**
- Vapi workflow IDs are never hardcoded in Angular environment files
- Fetched from the backend via `secretsService.getSecrets()` before any call starts

**Vote Switching Logic**
- Upvote/downvote state is tracked per user per resource in separate Interaction models
- Switching from upvote to downvote decrements one count and increments the other **atomically**
- Uses `findOneAndUpdate` with `upsert: true` — first interaction creates the record, all subsequent ones update it

**Interview State Machine**
- Both voice agent components use a `CallStatus` enum: `INACTIVE → CONNECTING → ACTIVE → FINISHED`
- Controls UI state (spinner, button visibility, redirect logic) in a predictable, consistent way across both flows

**Attempt Tracking**
- Every completed interview is logged as an attempt (`interviewId + userId + timestamp`)
- Supports querying attempt history and ordering

**Zod Schema Validation**
- Gemini feedback output is validated before saving
- Schema evolved from strict `z.tuple()` (fixed category order) to `z.array()` to handle Gemini's non-deterministic output ordering

**Community Layer**
- Interviews and Notes both support upvote, downvote, and favourite
- Per-user interaction state (`voteType`, `isFavorite`) stored in separate Interaction documents
- Notes ranked by upvote ratio via MongoDB aggregation pipeline — quality surfaces over volume

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular, TypeScript |
| Backend | Node.js, Express |
| Database | MongoDB |
| Voice AI | Vapi AI (two separate agents) |
| Feedback AI | Google Gemini |
| Schema Validation | Zod |
| Auth | JWT (dual-token with rotation) |
| Deployment | AWS EC2, AWS S3 |
| Email | Nodemailer |

---

## Project Structure

```
prepint/
├── client/                  # Angular frontend
│   └── src/app/
│       ├── components/      # Interview creation, conducting, feedback, notes, auth
│       ├── _services/       # API service layer
│       ├── _models/         # TypeScript interfaces
│       ├── _guards/         # Auth route guards
│       └── _interceptors/   # HTTP error handling
└── server/                  # Node.js backend
    ├── controllers/         # Auth, interview, feedback, notes, interactions
    ├── models/              # MongoDB schemas
    ├── routes/              # API route definitions
    └── middlewares/         # Error handling, auth protection
```

---

## Running Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Vapi account with two configured workflows (interview creation + conducting)
- Google Gemini API key

### Backend
```bash
cd server
npm install
# Create a .env file with the variables below
npm start
```

**Required environment variables:**
```
PORT=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRY=
REFRESH_TOKEN_EXPIRY=
EMAIL_VERIFY_EXPIRY=
GEMINI_API_KEY=
VAPI_CREATION_WORKFLOW_ID=
VAPI_CONDUCTING_WORKFLOW_ID=
EMAIL_USER=
EMAIL_PASS=
```

### Frontend
```bash
cd client
npm install
ng serve
```

App runs at `http://localhost:4200`

---

## Key Design Decisions

**Why two separate Vapi agents?**
The creation flow and conducting flow have fundamentally different jobs. The creation agent is a freeform conversation. The conducting agent is structured around pre-defined questions. Separating them keeps each workflow clean and independently configurable.

**Why upvote ratio instead of raw count for note ranking?**
A note with 10 upvotes and 0 downvotes is better than one with 100 upvotes and 90 downvotes. Raw count rewards volume; ratio rewards quality.

**Why move from `z.tuple()` to `z.array()` for feedback validation?**
Gemini does not guarantee consistent key ordering in JSON output. The strict tuple schema broke when Gemini returned categories in a different order. The array schema validates structure without assuming order.