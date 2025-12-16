# Online Exam System

A RESTful backend for an online examination platform built with Node.js, Express and MongoDB. It provides user authentication, question and exam management, exam taking and result retrieval, profile management, email verification and image uploads (Cloudinary).

**Tech stack:**
- Node.js + Express
- MongoDB (Mongoose)
- JWT for authentication
- Cloudinary for image uploads
- Nodemailer for email OTPs

**Key features:**
- Student and admin roles
- Signup / Login with JWT
- Create, update, delete exams (admin)
- Create, update, delete questions (admin)
- Start and submit exams (students)
- Store and retrieve results
- Profile management and profile picture upload
- Email verification via OTP

**Repository structure**
- app.js — app configuration and route mounting
- server.js — server entrypoint
- config/ — database and Cloudinary configuration
- controllers/ — request handlers
- routes/ — API route definitions
- models/ — Mongoose schemas
- middlewares/ — auth, validators, logging
- utils/ — helpers (logger, limiter, error handler)
- validationRules/ — express-validator rules

Prerequisites
- Node.js (>= 16)
- npm
- A running MongoDB instance (URI)
- Cloudinary account for media uploads
- Gmail account or SMTP credentials for sending verification OTPs

Installation

1. Clone the repo:

```bash
git clone <repo-url>
cd online-exam-system
```

2. Install dependencies:

```bash
npm install
```

3. Copy and populate environment variables in a `.env` file at the project root. Required variables used by the code:

- `PORT` (optional, default 8000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `EMAIL_USER` — SMTP username (Gmail address if using Gmail)
- `EMAIL_PASS` — SMTP password or app password
- `EMAIL_SENDER` — email "from" address used when sending OTPs

Optional / recommended Cloudinary env vars (the project currently uses `config/cloudinary.js` — you can replace values with env var usage if preferred):

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Start the server

```bash
# development with auto-restart
npm run dev

# production
npm start
```

Scripts
- `npm run dev` — run with nodemon
- `npm start` — start with node

Environment & Security note
- The repository currently contains hard-coded Cloudinary credentials in `config/cloudinary.js`. For production, move credentials to environment variables and avoid committing secrets.

API overview

Base URL: `/api`

Auth
- `POST /api/auth/signup` — register (body: name, email, password, department, enrollmentNumber, semester, year)
- `POST /api/auth/login` — login (body: email, password) → returns `{ token }`

Email verification
- `GET /api/verify-email/send-otp` — send OTP to `email` (query/body as implemented)
- `POST /api/verify-email/verify-otp` — verify OTP (body: `email`, `otp`)

Countdown
- `GET /api/countdown` — returns a target timestamp (used by frontend)

Questions (admin-protected)
- `POST /api/questions/create` — create question (multipart form; `options` JSON string and optional `image` file)
- `GET /api/questions` — list questions (filters supported)
- `GET /api/questions/:id` — get question by id
- `PUT /api/questions/:id` — update question
- `DELETE /api/questions/:id` — delete question

Exams
- `GET /api/exams` — list exams (supports pagination and filters)
- `GET /api/exams/upcoming` — list upcoming exams
- `GET /api/exams/:id` — get exam by id
- `POST /api/exams/create` — create exam (admin)
- `PUT /api/exams/:id` — update exam (admin)
- `DELETE /api/exams/:id` — delete exam (admin)

Exam taking
- `POST /api/exam-taking/start/:examId` — start an exam (returns exam questions if within start/end window)
- `POST /api/exam-taking/submit` — submit exam answers (body: `examId`, `answers`) and create a result

Results
- `GET /api/results` — get results for logged-in student (returns detailed answers and exam data)

Profile
- `POST /api/profile` — fetch profile (by token, or send `id`/`email` in body)
- `PUT /api/profile/update` — update profile fields
- `PUT /api/profile/change-password` — change password
- `POST /api/profile/upload-picture` — upload profile picture (multipart file upload)

Authentication
- After login, include the JWT in `Authorization` header as `Bearer <token>` for protected endpoints.

Notes & Limitations
- Validation rules are implemented in `validationRules/` using `express-validator`.
- Rate limiting is enabled via `utils/limiter` and request logging via `middlewares/requestLogger`.
- Error handling helpers exist in `utils/handleError.js`.
- Some controllers assume certain request body shapes — follow the frontend or controller implementations when building requests.

Contributing
- Open issues or PRs for bug fixes and features.
- Follow existing code style and add tests where appropriate.

License
- ISC (see package.json)

Contact
- For questions about running the project, open an issue or contact the repository owner.
