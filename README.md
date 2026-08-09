# JobBoard — MERN Stack Job Board Web App

A full-stack, responsive job board built with **MongoDB, Express, React (Vite), and Node.js**.

## Features implemented

| Feature | Where |
|---|---|
| Home page — welcome message + featured job listings | `client/src/pages/Home.jsx` |
| Job listings page — search, filters, pagination | `client/src/pages/JobListings.jsx` |
| Job detail page | `client/src/pages/JobDetail.jsx` |
| Employer dashboard — post/manage jobs, view applicants, company profile | `client/src/pages/EmployerDashboard.jsx`, `PostJob.jsx` |
| Candidate dashboard — profile management, application tracking | `client/src/pages/CandidateDashboard.jsx` |
| Job application with resume upload | `client/src/pages/ApplyJob.jsx` (Multer on the backend) |
| Search functionality | Text index on `Job` model + `SearchBar.jsx` |
| Email notifications (application confirmation, new applicant alert, status updates, welcome email) | `server/utils/sendEmail.js` (Nodemailer) |
| Authentication & security | JWT + bcrypt, role-based route protection (`candidate` / `employer`) |
| Mobile responsiveness | Tailwind CSS, mobile nav, responsive grids throughout |

## Project structure

```
job-board-mern/
├── server/           # Express + MongoDB API
│   ├── config/        # DB connection
│   ├── models/         # User, Job, Application (Mongoose)
│   ├── middleware/    # auth (JWT), file upload (Multer), error handler
│   ├── controllers/    # business logic
│   ├── routes/         # REST endpoints
│   ├── utils/           # email templates, token helper, seed script
│   └── server.js
└── client/            # React (Vite) frontend
    └── src/
        ├── api/          # axios instance
        ├── context/      # AuthContext
        ├── components/  # Navbar, Footer, JobCard, SearchBar, etc.
        └── pages/        # Home, JobListings, JobDetail, Dashboards, etc.
```

## Prerequisites

- Node.js 18+
- A MongoDB database — either [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works fine) or a local MongoDB instance
- (Optional, for real emails) SMTP credentials — e.g. a Gmail App Password, Mailtrap, or SendGrid

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set at minimum:

```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=some-long-random-string
```

SMTP settings are optional — if left blank, the app logs emails to the console instead of failing, so you can develop without setting up email.

Seed some demo data (a demo employer, candidate, and 5 jobs):

```bash
npm run seed
```

This prints demo login credentials:
- Employer: `employer@demo.com` / `password123`
- Candidate: `candidate@demo.com` / `password123`

Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

## 2. Frontend setup

In a new terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173` and is already configured (via `vite.config.js` proxy and `VITE_API_URL`) to talk to the backend on port 5000.

## 3. Try it out

1. Open `http://localhost:5173`
2. Register as an **employer**, post a job, and mark it as "featured" to see it on the homepage
3. Register as a **candidate** (or use the seeded one) and apply to a job with a resume file
4. Check the employer dashboard's "Applicants" tab to see the application and update its status
5. Check your terminal running the server — you'll see email logs (or real emails if SMTP is configured)

## Notes on production readiness

This is a complete, working foundation. Before deploying it for real users, you'd want to additionally:
- Add rate limiting (`express-rate-limit`) and input sanitization on the API
- Move resume storage to a cloud bucket (S3, Cloudinary) instead of local disk
- Add refresh tokens / shorter-lived access tokens
- Add automated tests
- Add pagination to the employer's applicants list for high-volume postings
